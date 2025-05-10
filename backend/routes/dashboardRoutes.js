import express from "express";
import { getAdminDashboard } from "../controllers/dashboardController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, adminOnly, getAdminDashboard);

export default router;
