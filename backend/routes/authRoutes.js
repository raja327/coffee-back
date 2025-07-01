import express from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
  getProfile,
  updatePassword,
} from "../controllers/authController.js";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  registerUser
);

router.post("/login", loginUser);

// Protected profile route
router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, updatePassword);

export default router;
