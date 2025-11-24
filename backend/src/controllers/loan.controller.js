import Loan from "../models/loan.model.js";
import Member from "../models/members.model.js";


const getSuretyData = async (membershipNo, pdc = []) => {
    const m = await Member.findOne({
        "personalDetails.membershipNumber": membershipNo,
    });

    if (!m) return null;

    return {
        memberId: m._id,
        memberName: m.personalDetails.nameOfMember,
        membershipNumber: m.personalDetails.membershipNumber,
        mobileNumber: m.personalDetails.phoneNo,
        pdcDetails: pdc,
    };
};

export const createLoan = async (req, res) => {
    try {
        const {
            membershipNumber,
            typeOfLoan,
            loanDate,
            purposeOfLoan,
            loanAmount,
            lafDate,
            fdrAmount,
            fdrSchema,
            pdcDetails = [],
            suretyGiven = [],
            suretyTaken = [],
            bankDetails = {},
        } = req.body;

        // 1️⃣ Find main borrower
        const mainMember = await Member.findOne({
            "personalDetails.membershipNumber": membershipNumber,
        });

        if (!mainMember) {
            return res.status(404).json({
                success: false,
                message: "Main member not found",
            });
        }

        // 2️⃣ Prepare surety lists
        const suretyGivenList = [];
        for (let s of suretyGiven) {
            const details = await getSuretyData(s.membershipNumber, s.pdcDetails || []);
            if (details) suretyGivenList.push(details);
        }

        const suretyTakenList = [];
        for (let s of suretyTaken) {
            const details = await getSuretyData(s.membershipNumber, s.pdcDetails || []);
            if (details) suretyTakenList.push(details);
        }

        // 3️⃣ Create Loan
        const loan = await Loan.create({
            memberId: mainMember._id,
            membershipNumber,
            typeOfLoan,
            loanDate,
            purposeOfLoan,
            loanAmount,
            lafDate,
            fdrAmount,
            fdrSchema,
            pdcDetails,
            bankDetails,
            suretyGiven: suretyGivenList,
            suretyTaken: suretyTakenList,
        });

        return res.status(201).json({
            success: true,
            message: "Loan created successfully",
            data: loan,
        });
    } catch (error) {
        console.log("❌ CREATE ERROR:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find()
            .populate("memberId", "personalDetails.nameOfMember personalDetails.membershipNumber personalDetails.phoneNo")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: loans });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id)
            .populate("memberId", "personalDetails.nameOfMember personalDetails.membershipNumber personalDetails.phoneNo");

        if (!loan) {
            return res.status(404).json({ success: false, message: "Loan not found" });
        }

        return res.status(200).json({ success: true, data: loan });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const updateLoan = async (req, res) => {
    try {
        const {
            membershipNumber,
            suretyGiven = [],
            suretyTaken = [],
        } = req.body;

        const updateData = { ...req.body };

        // Update surety fields if provided
        if (suretyGiven.length > 0) {
            const list = [];
            for (let s of suretyGiven) {
                const details = await getSuretyData(s.membershipNumber, s.pdcDetails || []);
                if (details) list.push(details);
            }
            updateData.suretyGiven = list;
        }

        if (suretyTaken.length > 0) {
            const list = [];
            for (let s of suretyTaken) {
                const details = await getSuretyData(s.membershipNumber, s.pdcDetails || []);
                if (details) list.push(details);
            }
            updateData.suretyTaken = list;
        }

        const updatedLoan = await Loan.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedLoan) {
            return res.status(404).json({ success: false, message: "Loan not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Loan updated successfully",
            data: updatedLoan,
        });
    } catch (error) {
        console.log("❌ UPDATE ERROR:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


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
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const getLoansByMemberId = async (req, res) => {
    try {
        const { membershipNumber } = req.params;

        const member = await Member.findOne({
            "personalDetails.membershipNumber": membershipNumber,
        });

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }

        const loans = await Loan.find({ membershipNumber }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: loans,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
