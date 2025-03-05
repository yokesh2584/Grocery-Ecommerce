import express from "express";
import { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", authUser);
router.post("/register", registerUser);
router.route("/me").get(protect, getUserProfile).put(protect, updateUserProfile);
router.route("/admin").get(protect, admin, getUsers);
router.route("/:id").get(protect, admin, getUserById).delete(protect, admin, deleteUser).put(protect, admin, updateUser);

export default router;