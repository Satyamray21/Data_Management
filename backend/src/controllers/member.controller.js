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


export const getMissingFieldsForMember = async (req, res) => {
  try {
    const { membershipNumber, nameOfMember } = req.query;

    if (!membershipNumber && !nameOfMember) {
      return res.status(400).json({
        success: false,
        message: "Please provide either membershipNumber or nameOfMember.",
      });
    }

    const member = await Member.findOne({
      $or: [
        { "personalDetails.membershipNumber": membershipNumber },
        { "personalDetails.nameOfMember": nameOfMember },
      ],
    }).lean();

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    // Template based on your schema
    const schemaTemplate = {
      personalDetails: {
        nameOfMember: "",
        membershipNumber: "",
        nameOfFather: "",
        nameOfMother: "",
        dateOfBirth: "",
        ageInYears: "",
        membershipDate: "",
        amountInCredit: "",
        gender: "",
        maritalStatus: "",
        religion: "",
        caste: "",
        phoneNo: "",
        alternatePhoneNo: "",
        emailId: "",
      },
      addressDetails: {
        permanentAddress: {
          flatHouseNo: "",
          areaStreetSector: "",
          locality: "",
          landmark: "",
          city: "",
          country: "",
          state: "",
          pincode: "",
        },
        permanentAddressBillPhoto: "",
        currentResidentalAddress: {
          flatHouseNo: "",
          areaStreetSector: "",
          locality: "",
          landmark: "",
          city: "",
          country: "",
          state: "",
          pincode: "",
        },
        currentResidentalBillPhoto: "",
        previousCurrentAddress: [],
      },
      referenceDetails: {
        referenceName: "",
        referenceMno: "",
        guarantorName: "",
        gurantorMno: [],
      },
      documents: {
        passportSize: "",
        panNo: "",
        rationCard: "",
        drivingLicense: "",
        aadhaarNo: "",
        voterId: "",
        passportNo: "",
        panNoPhoto: "",
        rationCardPhoto: "",
        drivingLicensePhoto: "",
        aadhaarNoPhoto: "",
        voterIdPhoto: "",
        passportNoPhoto: "",
      },
      professionalDetails: {
        qualification: "",
        occupation: "",
      },
      familyDetails: {
        familyMembersMemberOfSociety: false,
        familyMember: [],
        familyMemberNo: [],
      },
      bankDetails: {
        bankName: "",
        branch: "",
        accountNumber: "",
        ifscCode: "",
      },
      guaranteeDetails: {
        whetherMemberHasGivenGuaranteeInOtherSociety: false,
        otherSociety: [],
        whetherMemberHasGivenGuaranteeInOurSociety: false,
        ourSociety: [],
      },
      loanDetails: [],
    };

    // Recursive function for both flat + detailed results
    const findMissingFields = (schemaObj, dataObj) => {
      const missingFlat = [];
      const missingDetailed = {};

      for (const key in schemaObj) {
        const schemaValue = schemaObj[key];
        const dataValue = dataObj ? dataObj[key] : undefined;

        if (dataValue === undefined || dataValue === null || dataValue === "") {
          missingFlat.push(key);
          missingDetailed[key] = schemaValue;
        } else if (
          typeof schemaValue === "object" &&
          !Array.isArray(schemaValue)
        ) {
          const { flat, detailed } = findMissingFields(schemaValue, dataValue);
          if (flat.length > 0) {
            missingFlat.push(...flat.map((f) => `${key}.${f}`));
            missingDetailed[key] = detailed;
          }
        }
      }

      return { flat: missingFlat, detailed: missingDetailed };
    };

    const { flat: missingFields, detailed: missingFieldsDetailed } =
      findMissingFields(schemaTemplate, member);

    res.status(200).json({
      success: true,
      message: "Missing fields retrieved successfully.",
      member: {
        nameOfMember: member.personalDetails?.nameOfMember || null,
        membershipNumber: member.personalDetails?.membershipNumber || null,
      },
      totalMissing: missingFields.length,
      missingFields,
      missingFieldsDetailed,
    });
  } catch (error) {
    console.error("❌ Error checking missing fields:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const addGuarantor = async (req, res) => {
  try {
    const { membershipNumber, nameOfMember, guarantor } = req.body;

    // Validate required fields
    if (!membershipNumber && !nameOfMember) {
      return res.status(400).json({
        success: false,
        message: "Please provide either membershipNumber or nameOfMember.",
      });
    }

    if (
      !guarantor ||
      !guarantor.nameOfMember ||
      !guarantor.membershipNo ||
      !guarantor.amountOfLoan
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Guarantor details are incomplete. Required: nameOfMember, membershipNo, amountOfLoan.",
      });
    }

    // Find the member
    const member = await Member.findOne({
      $or: [
        { "personalDetails.membershipNumber": membershipNumber },
        { "personalDetails.nameOfMember": nameOfMember },
      ],
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    // Initialize the array if empty
    if (!member.guaranteeDetails) member.guaranteeDetails = {};
    if (!Array.isArray(member.guaranteeDetails.ourSociety))
      member.guaranteeDetails.ourSociety = [];

    // Push new guarantor
    member.guaranteeDetails.ourSociety.push(guarantor);

    // Save updated member
    await member.save();

    res.status(200).json({
      success: true,
      message: "Guarantor added successfully.",
      updatedMember: {
        nameOfMember: member.personalDetails.nameOfMember,
        membershipNumber: member.personalDetails.membershipNumber,
        guaranteeDetails: member.guaranteeDetails,
      },
    });
  } catch (error) {
    console.error("❌ Error adding guarantor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

