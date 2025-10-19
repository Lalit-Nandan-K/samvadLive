import express from "express";
import { getMessages } from "../controllers/chat.controller.js";
import { uploadFile, getFileUrl } from "../controllers/file.controller.js"; // Import new controller

const router = express.Router();

router.get("/:roomId", getMessages);
router.post("/upload", uploadFile, getFileUrl); // New upload route

export default router;
