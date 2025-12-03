import express from "express";
import multer from "multer";
import { importMembers } from "../controllers/memberExcel.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-members-excel", upload.single("excel"), importMembers);

export default router;
