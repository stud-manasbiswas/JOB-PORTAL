// utils/upload.js
import multer from "multer";

const storage = multer.memoryStorage(); // this allows buffer upload for cloudinary.stream

const upload = multer({ storage });

export default upload;
