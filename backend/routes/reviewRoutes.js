import express from "express";

import {
  createReview,
  getReviewByMenu,
  deleteReview,
  getAllReviews,
  updateReviewStatus,
} from "../controllers/reviewController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/:menuId", protect, createReview);
router.get("/:menuId", getReviewByMenu);
router.delete("/:id", protect, adminOnly, deleteReview);

// Admin-only route
router.get("/", protect, adminOnly, getAllReviews);
router.patch("/:reviewId/status", protect, adminOnly, updateReviewStatus);

export default router;
