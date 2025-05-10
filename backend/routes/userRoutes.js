import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import router from "./authRoutes";

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.get("/admin", protect, adminOnly, (req, res) => {
  res.send("welcome Admin");
});

export default router;
