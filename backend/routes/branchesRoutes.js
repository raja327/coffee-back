import express from "express";
import uploadBranch from "../middleware/multerBranches.js";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../controllers/branchController.js";
const router = express.Router();

import { protect, adminOnly } from "../middleware/authMiddleware.js";
router.get("/", getBranches);
router.post(
  "/",
  protect,
  adminOnly,
  uploadBranch.single("image"),
  createBranch
);
router.put(
  "/:id",
  protect,
  adminOnly,
  uploadBranch.single("image"),
  updateBranch
);
router.delete("/:id", protect, adminOnly, deleteBranch);

export default router;
