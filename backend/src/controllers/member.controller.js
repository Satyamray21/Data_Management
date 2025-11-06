import Member from "../models/members.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

// ===== CREATE MEMBER =====
export const createMember = async (req, res) => {
  try {
    const { body, files } = req;

    // Upload documents/photos to Cloudinary if provided
    const uploadedPhotos = {};

    // If you have file uploads (like passportSize, panNoPhoto, etc.)
    for (const key in files) {
      const file = files[key][0]; // assuming multer is used (req.files.<fieldname>[0])
      const result = await uploadOnCloudinary(file.path);
      if (result) uploadedPhotos[key] = result.secure_url;
    }

    const newMember = new Member({
      ...body,
      documents: {
        ...(body.documents || {}),
        ...uploadedPhotos,
      },
    });

    await newMember.save();

    return res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: newMember,
    });
  } catch (error) {
    console.error("Error creating member:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create member",
      error: error.message,
    });
  }
};

// ===== GET MEMBER BY ID =====
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    return res.status(200).json({ success: true, data: member });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ===== GET ALL MEMBERS =====
export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    return res.status(200).json({ success: true, data: members });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ===== UPDATE MEMBER =====
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, files } = req;

    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    // Handle Cloudinary uploads for new images
    const uploadedPhotos = {};
    for (const key in files) {
      const file = files[key][0];
      const result = await uploadOnCloudinary(file.path);
      if (result) uploadedPhotos[key] = result.secure_url;
    }

    // Check if current address changed
    const newAddress = body?.addressDetails?.currentResidentalAddress;
    const oldAddress = member.addressDetails?.currentResidentalAddress;

    if (newAddress && newAddress !== oldAddress) {
      member.addressDetails.previousCurrentAddress = [
        ...(member.addressDetails.previousCurrentAddress || []),
        oldAddress,
      ];
      member.addressDetails.currentResidentalAddress = newAddress;
    }

    // Update other fields
    if (body.personalDetails) member.personalDetails = body.personalDetails;
    if (body.referenceDetails) member.referenceDetails = body.referenceDetails;
    if (body.professionalDetails) member.professionalDetails = body.professionalDetails;
    if (body.familyDetails) member.familyDetails = body.familyDetails;
    if (body.bankDetails) member.bankDetails = body.bankDetails;
    if (body.guaranteeDetails) member.guaranteeDetails = body.guaranteeDetails;
    if (body.loanDetails) member.loanDetails = body.loanDetails;

    // Merge uploaded docs
    member.documents = {
      ...member.documents,
      ...body.documents,
      ...uploadedPhotos,
    };

    await member.save();

    return res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: member,
    });
  } catch (error) {
    console.error("Error updating member:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update member",
      error: error.message,
    });
  }
};

// ===== DELETE MEMBER =====
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete member",
      error: error.message,
    });
  }
};
