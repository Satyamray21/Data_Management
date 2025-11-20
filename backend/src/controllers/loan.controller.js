import Loan from "../models/loan.model.js";
import Member from "../models/members.model.js";

// =============================
// CREATE LOAN
// =============================
export const createLoan = async (req, res) => {
  try {
    const {
      memberId,
      typeOfLoan,
      loanDate,
      purposeOfLoan,
      loanAmount,
      lafDate,
      fdrAmount,
      fdrSchema,
      pdcDetails,
    } = req.body;

    // ========== 1. Check Member Exists ==========
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // ========== 2. Create Loan ==========
    const loan = await Loan.create({
      memberId,
      typeOfLoan,
      loanDate,
      purposeOfLoan,
      loanAmount,
      lafDate,
      fdrAmount,
      fdrSchema,
      pdcDetails,
    });

    return res.status(201).json({
      success: true,
      message: "Loan created successfully",
      data: loan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// GET ALL LOANS
// =============================
export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate("memberId", "personalDetails.nameOfMember personalDetails.membershipNumber personalDetails.phoneNo")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: loans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// GET SINGLE LOAN
// =============================
export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate(
      "memberId",
      "personalDetails.nameOfMember personalDetails.membershipNumber personalDetails.phoneNo"
    );

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// UPDATE LOAN
// =============================
export const updateLoan = async (req, res) => {
  try {
    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("memberId");

    if (!updatedLoan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Loan updated successfully",
      data: updatedLoan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// DELETE LOAN
// =============================
export const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Loan deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// GET LOANS BY MEMBER ID
// =============================
export const getLoansByMemberId = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Check if member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Get loans linked to this member
    const loans = await Loan.find({ memberId })
      .populate(
        "memberId",
        "personalDetails.nameOfMember personalDetails.membershipNumber personalDetails.phoneNo"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: loans,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
