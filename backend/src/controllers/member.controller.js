import Member from "../models/members.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import qs from "qs";
import objectPath from "object-path";

export const createMember = async (req, res) => {
  try {
    console.log("🟢 Raw Request Body:", req.body);
    console.log("🟢 Request Files:", req.files);

    // Parse nested objects properly from form-data
    const body = qs.parse(req.body);

    // Handle file uploads
    const uploadedPhotos = {};
    
    if (req.files) {
      console.log("📁 Processing files:", Object.keys(req.files));
      
      for (const fieldName in req.files) {
        const fileArray = req.files[fieldName];
        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0];
          console.log(`📄 Processing file: ${fieldName} - ${file.originalname}`);
          
          try {
            // Use file.buffer since we're using memoryStorage
            const result = await uploadOnCloudinary(file.buffer, file.originalname);
            if (result) {
              // Map frontend field names to backend document field names
              const fieldMapping = {
                'passportSize': 'passportSize',
                'panNoPhoto': 'panNoPhoto',
                'aadhaarNoPhoto': 'aadhaarNoPhoto', 
                'rationCardPhoto': 'rationCardPhoto',
                'drivingLicensePhoto': 'drivingLicensePhoto',
                'voterIdPhoto': 'voterIdPhoto',
                'passportNoPhoto': 'passportNoPhoto',
                'permanentAddressBillPhoto': 'permanentAddressBillPhoto',
                'currentResidentalBillPhoto': 'currentResidentalBillPhoto'
              };
              
              const backendFieldName = fieldMapping[fieldName] || fieldName;
              uploadedPhotos[backendFieldName] = result.secure_url;
              console.log(`✅ Uploaded ${fieldName} to ${result.secure_url}`);
            }
          } catch (uploadError) {
            console.error(`❌ Error uploading ${fieldName}:`, uploadError);
          }
        }
      }
    }

    // Build the member data structure
    const newMemberData = {
      ...body,
      documents: {
        ...(body.documents || {}),
        ...uploadedPhotos,
      }
    };

    // Handle address details separately to ensure proper structure
    if (body.addressDetails) {
      newMemberData.addressDetails = {
        ...body.addressDetails,
        permanentAddressBillPhoto: uploadedPhotos.permanentAddressBillPhoto,
        currentResidentalBillPhoto: uploadedPhotos.currentResidentalBillPhoto ? [uploadedPhotos.currentResidentalBillPhoto] : []
      };
    }

    // Ensure personalDetails exists
    if (body.personalDetails) {
      newMemberData.personalDetails = body.personalDetails;
    }

    // Ensure other sections exist to match model
    if (!newMemberData.referenceDetails) {
      newMemberData.referenceDetails = {};
    }
    if (!newMemberData.professionalDetails) {
      newMemberData.professionalDetails = {};
    }
    if (!newMemberData.familyDetails) {
      newMemberData.familyDetails = {};
    }
    if (!newMemberData.bankDetails) {
      newMemberData.bankDetails = {};
    }
    if (!newMemberData.guaranteeDetails) {
      newMemberData.guaranteeDetails = {};
    }
    if (!newMemberData.loanDetails) {
      newMemberData.loanDetails = [];
    }

    console.log("✅ Final data to save:", JSON.stringify(newMemberData, null, 2));

    // Validate required fields
    if (!newMemberData.personalDetails || !newMemberData.personalDetails.nameOfMember) {
      return res.status(400).json({
        success: false,
        message: "Member name is required",
      });
    }

    const newMember = new Member(newMemberData);
    await newMember.save();

    return res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: newMember,
    });
  } catch (error) {
    console.error("❌ Error creating member:", error);
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
    const body = qs.parse(req.body);
    const { files } = req;

    console.log("🟢 Update - Raw Request Body:", req.body);
    console.log("🟢 Update - Request Files:", files);

    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    // Handle Cloudinary uploads for new images
    const uploadedPhotos = {};
    if (files) {
      for (const fieldName in files) {
        const fileArray = files[fieldName];
        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0];
          try {
            const result = await uploadOnCloudinary(file.buffer, file.originalname);
            if (result) {
              uploadedPhotos[fieldName] = result.secure_url;
              console.log(`✅ Updated ${fieldName} to ${result.secure_url}`);
            }
          } catch (uploadError) {
            console.error(`❌ Error uploading ${fieldName}:`, uploadError);
          }
        }
      }
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
    if (body.personalDetails) {
      member.personalDetails = { ...member.personalDetails, ...body.personalDetails };
    }
    if (body.referenceDetails) {
      member.referenceDetails = { ...member.referenceDetails, ...body.referenceDetails };
    }
    if (body.professionalDetails) {
      member.professionalDetails = { ...member.professionalDetails, ...body.professionalDetails };
    }
    if (body.familyDetails) {
      member.familyDetails = { ...member.familyDetails, ...body.familyDetails };
    }
    if (body.bankDetails) {
      member.bankDetails = { ...member.bankDetails, ...body.bankDetails };
    }
    if (body.guaranteeDetails) {
      member.guaranteeDetails = { ...member.guaranteeDetails, ...body.guaranteeDetails };
    }
    if (body.loanDetails) {
      member.loanDetails = body.loanDetails;
    }

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
    console.error("❌ Error updating member:", error);
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