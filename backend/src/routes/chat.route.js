// backend/src/routes/chat.route.js
import express from "express";
import { getMessages } from "../controllers/chat.controller.js";
import { uploadFile, getFileUrl, handleMulterError } from "../controllers/file.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { canUserAccessRoom } from "../lib/chat-room.js";

const router = express.Router();
router.use(protectRoute);

// Get messages for a room
router.get("/:roomId", getMessages);

// Upload file endpoint with error handling
router.post("/upload/:roomId", (req, res, next) => {
  if (!canUserAccessRoom(req.user, req.params.roomId)) {
    return res.status(403).json({ message: "Forbidden" });
  }

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
