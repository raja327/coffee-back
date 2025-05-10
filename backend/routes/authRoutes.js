import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { body } from "express-validator";

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

export default router;
