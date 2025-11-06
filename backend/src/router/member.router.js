import express from "express";
import multer from "multer";
import {
  createMember,
  getMemberById,
  getAllMembers,
  updateMember,
  deleteMember,
} from "../controllers/member.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp local folder

router.post("/", upload.fields([{ name: "passportSize" }, { name: "panNoPhoto" }]), createMember);
router.get("/", getAllMembers);
router.get("/:id", getMemberById);
router.put("/:id", upload.fields([{ name: "passportSize" }, { name: "panNoPhoto" }]), updateMember);
router.delete("/:id", deleteMember);

export default router;
