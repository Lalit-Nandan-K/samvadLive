// backend/src/routes/chat.route.js
import express from "express";
import { getMessages } from "../controllers/chat.controller.js";
import { uploadFile, getFileUrl, handleMulterError } from "../controllers/file.controller.js";

const router = express.Router();

// Get messages for a room
router.get("/:roomId", getMessages);

// Upload file endpoint with error handling
router.post("/upload", (req, res, next) => {
  console.log("Upload request received");
  uploadFile(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return handleMulterError(err, req, res, next);
    }
    getFileUrl(req, res);
  });
});

export default router;