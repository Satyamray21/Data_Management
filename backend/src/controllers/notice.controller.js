import Member from "../models/members.model.js";
import nodemailer from "nodemailer";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

/**
 * @route POST /api/notice/send
 * @desc Send notice email to selected members
 * @body {
 *   memberIds: [String], // array of member _id
 *   subject: String,
 *   message: String,
 *   attachment: File (optional)
 * }
 */
export const sendNoticeToMembers = async (req, res) => {
  try {
    const { memberIds, subject, message } = req.body;

    if (!memberIds || memberIds.length === 0)
      return res.status(400).json({ success: false, message: "No members selected" });

    // Fetch member details
    const members = await Member.find({ _id: { $in: memberIds } });
    const emailList = members.map((m) => m.personalDetails.emailId).filter(Boolean);

    if (emailList.length === 0)
      return res.status(404).json({ success: false, message: "No valid emails found" });

    // Setup SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // use STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Handle optional file upload
    let uploadedFileUrl = null;
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      uploadedFileUrl = uploadResult?.secure_url || null;
    }

    // Email options
    const mailOptions = {
      from: `"Society Notice" <${process.env.SMTP_FROM}>`,
      to: emailList.join(","),
      subject,
      html: `
        <div style="font-family:sans-serif; padding:10px;">
          <h3 style="color:#2c3e50;">${subject}</h3>
          <p>${message}</p>
          ${uploadedFileUrl ? `<p><a href="${uploadedFileUrl}" target="_blank">View Attachment</a></p>` : ""}
          <hr/>
          <small>This is an automated notice from the society management system.</small>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Notice sent successfully to ${emailList.length} member(s).`,
    });
  } catch (error) {
    console.error("Error sending notice:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
