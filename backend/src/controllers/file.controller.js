import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

// 🔥 Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "auto";

    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.includes("word") ||
      file.mimetype.includes("text")
    ) {
      resourceType = "raw";
    }

    return {
      folder: "chat-app-samvad",
      resource_type: resourceType,

      // ⭐ IMPORTANT FIX FOR PDF PREVIEW
      public_id: file.originalname,
      use_filename: true,
      unique_filename: false,

      access_mode: "public",
    };
  },
});

// multer
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadFile = upload.single("file");

// return url
export const getFileUrl = (req, res) => {
  console.log("UPLOAD RESPONSE FILE:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    fileUrl: req.file.path,
  });
};

export const handleMulterError = (err, req, res, next) => {
  console.error("Multer error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "File too large (max 10MB)",
    });
  }

  return res.status(500).json({
    message: err.message || "Upload failed",
  });
};
