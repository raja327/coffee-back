import express from "express";
import {
  placeOrder,
  getAllOrders,
  deleteMyOrder,
  updateOrderStatus,
  getMyOrders,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.delete("/my/:id", protect, deleteMyOrder);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id", protect, adminOnly, updateOrderStatus);

export default router;
