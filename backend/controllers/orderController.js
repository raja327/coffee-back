import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
// Place an order

export const placeOrder = async (req, res) => {
  if (req.user === "admin")
    return res
      .status(401)
      .json({ message: "Admin are not allowed to place order" });
  const { items, total, phone, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in order" });
  }

  try {
    const order = new Order({
      user: req.user._id,
      items,
      total,
      phone,
      shippingAddress,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Order Error:", error); // Add this
    res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
  }
};

// get orders for logged-in user

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.menuItem"
    );
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get orders" });
  }
};
export const deleteMyOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    console.log(order);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};

// Admin:Get all orders

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.menuItem", "name price image");
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch all orders", error: error.message });
  }
};

// Admin :update order status
// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    await order.save();

    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update order", error: err.message });
  }
};
