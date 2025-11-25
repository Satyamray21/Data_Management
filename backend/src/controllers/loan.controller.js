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


/* ---------------------------------------------------------------------------
 * GET SURETY SUMMARY FOR A MEMBER
 * -------------------------------------------------------------------------*/
export const getSuretySummaryByMember = async (req, res) => {
  try {
    const { membershipNumber } = req.params;

    // All loans where this member has GIVEN surety
    const suretyGiven = await Loan.find({
      suretyGiven: {
        $elemMatch: { membershipNumber }
      }
    });

    // All loans where this member has TAKEN surety
    const suretyTaken = await Loan.find({
      suretyTaken: {
        $elemMatch: { membershipNumber }
      }
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          membershipNumber,
          suretyGiven,
          suretyTaken
        },
        "Surety summary fetched successfully"
      )
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ---------------------------------------------------------------------------
 * GET GUARANTOR RELATION SUMMARY FOR A MEMBER (Loan Based)
 * -------------------------------------------------------------------------*/
export const getGuarantorRelationsByMember = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Provide membershipNumber or name in 'search' query.",
      });
    }

    // 1️⃣ Find member
    const member = await Member.findOne({
      $or: [
        { "personalDetails.fullName": { $regex: search, $options: "i" } },
        { "personalDetails.membershipNumber": search },
      ],
    }).lean();

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }

    const membershipNumber = member.personalDetails.membershipNumber;
    const memberId = member._id.toString();

    // 2️⃣ Loans taken BY ME → myGuarantors
    const myLoans = await Loan.find({ membershipNumber }).lean();

    const myGuarantors = myLoans.flatMap((loan) =>
      (loan.suretyGiven || []).map((g) => ({
        loanId: loan._id,
        name: g.memberName,
        membershipNumber: g.membershipNumber,
        mobileNumber: g.mobileNumber,
        amountOfLoan: loan.loanAmount,
        typeOfLoan: loan.typeOfLoan,
        loanDate: loan.loanDate,
      }))
    );

    // 3️⃣ Loans where I am the guarantor → forWhomIAmGuarantor
    const loansWhereIGaveSurety = await Loan.find({
      $or: [
        { "suretyGiven.membershipNumber": membershipNumber },
        { "suretyGiven.memberId": memberId }
      ]
    }).lean();

    const forWhomIAmGuarantor = [];

    for (let loan of loansWhereIGaveSurety) {
      const borrower = await Member.findOne({
        "personalDetails.membershipNumber": loan.membershipNumber,
      }).lean();

      forWhomIAmGuarantor.push({
        loanId: loan._id,
        name: borrower?.personalDetails?.fullName || "Unknown Borrower",
        membershipNumber: loan.membershipNumber,
        mobileNumber: borrower?.personalDetails?.mobileNumber || "",
        amountOfLoan: loan.loanAmount,
        typeOfLoan: loan.typeOfLoan,
        loanDate: loan.loanDate,
      });
    }

    // 4️⃣ Response
    return res.status(200).json({
      success: true,
      member: {
        _id: member._id,
        name: member.personalDetails.fullName,
        membershipNumber,
      },
      myGuarantors,
      forWhomIAmGuarantor,
    });

  } catch (error) {
    console.error("❌ getGuarantorRelationsByMember ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


