import mongoose from "mongoose";

const pdcSchema = new mongoose.Schema({
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
    numberOfCheques:{
        type:Number,
    },
    chequeSeries:
    {
        type:String,
    },
    seriesDate:{
        type:String
    },

},{timestamps:true});

export default mongoose.model("PDC",pdcSchema);