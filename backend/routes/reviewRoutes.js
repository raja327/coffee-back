import express from "express";

import {
  createReview,
  getReviewByMenu,
  deleteReview,
} from "../controllers/reviewController";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/:menuId", protect, createReview);
router.get("/:menuId", getReviewByMenu);
router.delete("/:id", protect, adminOnly, deleteReview);
