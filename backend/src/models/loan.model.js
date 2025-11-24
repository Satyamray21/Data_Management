import mongoose from "mongoose";
import { pdcSchema } from "./pdc.model.js";

const loanSchema = new mongoose.Schema(
    {

        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: false,
        },

        membershipNumber: {
            type: String,
            required: true,
        },

        typeOfLoan: {
            type: String,
            enum: ["Loan", "LAF", "LAP"],
            required: true,
        },

        loanDate: {
            type: String,
            required: function () {
                return this.typeOfLoan === "Loan" || this.typeOfLoan === "LAP";
            },
        },

        purposeOfLoan: {
            type: String,
            required: function () {
                return this.typeOfLoan === "Loan" || this.typeOfLoan === "LAP";
            },
        },

        loanAmount: {
            type: String,
            required: function () {
                return this.typeOfLoan === "Loan" || this.typeOfLoan === "LAP";
            },
        },


        lafDate: {
            type: String,
            required: function () {
                return this.typeOfLoan === "LAF";
            },
        },

        fdrAmount: {
            type: String,
            required: function () {
                return this.typeOfLoan === "LAF";
            },
        },

        fdrSchema: {
            type: String,
            required: function () {
                return this.typeOfLoan === "LAF";
            },
        },

        pdcDetails: {
            type: [pdcSchema],
            default: [],
        },

        bankDetails:{
            bankName:{
                type:String,
            },
            branchName:{
                type:String,
            },
            accountNumber:{
                type:String,
            },
            ifscCode:{
                type:String,
            },
            accountNameHolder:{
                type:String,
            },

        },
       suretyGiven: [
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },
        memberName: { type: String, required: true },
        membershipNumber: { type: String, required: true },
        mobileNumber: { type: String, required: true },
         pdcDetails: {
            type: [pdcSchema],
            default: [],
        },
    }
],

suretyTaken:[
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },
        memberName: { type: String, required: true },
        membershipNumber: { type: String, required: true },
        mobileNumber: { type: String, required: true },
         pdcDetails: {
            type: [pdcSchema],
            default: [],
        },
    }
]


    },
    { timestamps: true }
);


loanSchema.pre("save", async function (next) {
    if (!this.isModified("memberId")) return next();

    const Member = mongoose.model("Member");

    const member = await Member.findById(this.memberId);

    if (member) {
        this.membershipNumber = member.personalDetails.membershipNumber;
    }

    next();
});

export default mongoose.model("Loan", loanSchema);