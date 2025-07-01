import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/userController.js";
const router = express.Router();

// Admin:Get all users
router.get("/", protect, adminOnly, getAllUsers);

export default router;
