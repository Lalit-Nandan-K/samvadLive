import multer from "multer";
import path from "path"; // Needed to extract file extension

// 1. Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure you have an 'uploads' directory at your server root
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp + original extension
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// 2. Middleware to handle single file upload (name 'file')
export const uploadFile = upload.single("file");

// 3. Controller function to return the public URL
export const getFileUrl = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // The path where the file is publicly accessible
  res.status(200).json({ fileUrl: `/uploads/${req.file.filename}` });
};
