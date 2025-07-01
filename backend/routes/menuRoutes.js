import express from "express";
import { body } from "express-validator";
import {
  getAllMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMenuItems.js";

const router = express.Router();

router.get("/", getAllMenuItems);
router.get("/:id", getMenuItem);

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"), // 👈 middleware to handle image upload
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ],
  createMenuItem
);

router.put("/:id", protect, adminOnly, upload.single("image"), updateMenuItem);
router.delete("/:id", protect, adminOnly, deleteMenuItem);

export default router;
