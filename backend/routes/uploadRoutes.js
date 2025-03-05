import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

const storage = multer.memoryStorage(); // Store images in memory as binary
const upload = multer({ storage });

router.post("/", upload.single("image"), uploadImage);

export default router;
