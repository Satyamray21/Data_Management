import Loan from "../models/loan.model.js";
import Member from "../models/members.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* -----------------------------------------------------------------------------
 * CREATE LOAN
 * ---------------------------------------------------------------------------*/
export const createLoan = async (req, res) => {
  try {
    const data = req.body;
    console.log("Req",req.body);
    if (!data.typeOfLoan) throw new ApiError(400, "typeOfLoan is required");

    let member = null;

    if (data.memberId) {
      member = await Member.findById(data.memberId);
      if (!member) throw new ApiError(404, "Member not found");
      data.membershipNumber = member.personalDetails.membershipNumber;
    }

    if (!data.membershipNumber)
      throw new ApiError(400, "membershipNumber is required");

    const loanPayload = {
  memberId: data.memberId || null,
  membershipNumber: data.membershipNumber,
  typeOfLoan: data.typeOfLoan,
  loanDate: data.loanDate,
  loanAmount: data.loanAmount,
  purposeOfLoan: data.purposeOfLoan,
  lafDate: data.lafDate,
  lafAmount: data.lafAmount,
  fdrAmount: data.fdrAmount,
  fdrScheme: data.fdrScheme,
  bankDetails: data.bankDetails || {},
  pdcDetails: Array.isArray(data.pdcDetails) ? data.pdcDetails : [],
  suretyGiven: Array.isArray(data.suretyGiven) ? data.suretyGiven : [],
  suretyTaken: [],
};


    const newLoan = await Loan.create(loanPayload);

    // update surety taken for each guarantor
    if (loanPayload.suretyGiven.length > 0) {
      for (let g of loanPayload.suretyGiven) {
        await Loan.updateMany(
          { memberId: g.memberId },
          {
            $push: {
              suretyTaken: {
                memberId: data.memberId,
                membershipNumber: data.membershipNumber,
                memberName: member?.personalDetails?.fullName || "",
                mobileNumber: member?.personalDetails?.mobileNumber || "",
              },
            },
          }
        );
      }
    }

    return res
      .status(201)
      .json(new ApiResponse(201, newLoan, "Loan created successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------------------------------------------------------
 * GET ALL LOANS
 * ---------------------------------------------------------------------------*/
export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, loans, "Loans fetched successfully"));
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* -----------------------------------------------------------------------------
 * GET LOAN BY ID
 * ---------------------------------------------------------------------------*/
export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) throw new ApiError(404, "Loan not found");

    return res
      .status(200)
      .json(new ApiResponse(200, loan, "Loan fetched successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------------------------------------------------------
 * UPDATE LOAN
 * ---------------------------------------------------------------------------*/
export const updateLoan = async (req, res) => {
  try {
    const updateData = req.body;

    const loan = await Loan.findById(req.params.id);
    if (!loan) throw new ApiError(404, "Loan not found");

    // update loan fields
    Object.assign(loan, updateData);

    await loan.save();

    return res
      .status(200)
      .json(new ApiResponse(200, loan, "Loan updated successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------------------------------------------------------
 * DELETE LOAN
 * ---------------------------------------------------------------------------*/
export const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) throw new ApiError(404, "Loan not found");

    await loan.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Loan deleted successfully"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
