import Member from "../models/members.model.js";
import fs from "fs";
import path from "path";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



export const createMember = async (req, res) => {
  try {
    console.log("🟢 Raw Request Body:", req.body);
    console.log("🟢 Request Files:", req.files);

    // Process text fields
    const {
      personalDetails,
      addressDetails,
      familyDetails,
      loanDetails,
      referenceDetails,
      guaranteeDetails,
      documents,
      professionalDetails,
      bankDetails
    } = req.body;

    // Process uploaded files with Cloudinary
    const fileFields = {};

    if (req.files) {
      console.log("📁 Processing files:", Object.keys(req.files));
      
      // Handle each file field and upload to Cloudinary
      for (const [fieldname, files] of Object.entries(req.files)) {
        if (files && files[0]) {
          const file = files[0];
          console.log(`📄 Processing file: ${fieldname} - ${file.originalname}`);
          console.log(`📍 File path: ${file.path}`);
          
          try {
            // Upload to Cloudinary
            const cloudinaryResult = await uploadOnCloudinary(file.path);
            
            if (cloudinaryResult && cloudinaryResult.secure_url) {
              console.log(`✅ Cloudinary upload successful: ${cloudinaryResult.secure_url}`);
              fileFields[fieldname] = cloudinaryResult.secure_url;
            } else {
              console.log(`❌ Cloudinary upload failed for: ${fieldname}`);
              fileFields[fieldname] = ""; // Set empty string if upload fails
            }
          } catch (uploadError) {
            console.error(`❌ Error uploading ${fieldname} to Cloudinary:`, uploadError);
            fileFields[fieldname] = ""; // Set empty string on error
          }
        } else {
          console.log(`❌ No file found for: ${fieldname}`);
          fileFields[fieldname] = "";
        }
      }
    }

    // Build the member data object with Cloudinary URLs
    const memberData = {
      personalDetails: personalDetails || {},
      addressDetails: {
        ...addressDetails,
        // Add Cloudinary URLs to address details
        permanentAddressBillPhoto: fileFields.permanentAddressBillPhoto || "",
        currentResidentalBillPhoto: fileFields.currentResidentalBillPhoto || ""
      },
      familyDetails: familyDetails || {},
      loanDetails: loanDetails || [],
      referenceDetails: referenceDetails || {},
      guaranteeDetails: guaranteeDetails || {},
      documents: {
        ...documents,
        // Add document Cloudinary URLs
        passportSize: fileFields.passportSize || "",
        panNoPhoto: fileFields.panNoPhoto || "",
        aadhaarNoPhoto: fileFields.aadhaarNoPhoto || "",
        rationCardPhoto: fileFields.rationCardPhoto || "",
        drivingLicensePhoto: fileFields.drivingLicensePhoto || "",
        voterIdPhoto: fileFields.voterIdPhoto || "",
        passportNoPhoto: fileFields.passportNoPhoto || ""
      },
      professionalDetails: professionalDetails || {},
      bankDetails: bankDetails || {}
    };

    console.log("✅ Final data to save:", JSON.stringify(memberData, null, 2));

    // Create and save the member
    const newMember = new Member(memberData);
    const savedMember = await newMember.save();

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: savedMember
    });

  } catch (error) {
    console.error("❌ Error creating member:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Other controller functions remain the same...
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const updateMember = async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember
    });
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Member deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};