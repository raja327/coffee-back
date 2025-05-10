import Order from "../models/Order";
import MenuItem from "../models/MenuItem.js";
// Place an order

export const placeOrder = async (req, res) => {
  try {
    const { items, branch } = req.body;
    const userId = req.user._id;

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await Menu.findById(item.menuItem);
        return {
          menuItem: menuItem._id,
          quality: item.quality,
          price: menuItem.price,
        };
      })
    );
    const totalAmount = populatedItems.reduce(
      (acc, item) => acc + item.price * item.quality,
      0
    );

    const order = await Order.create({
      user: userId,
      items: populatedItems.map(({ menuItem, quality }) => ({
        menuItem,
        quality,
      })),
      branch,
      totalAmount,
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get orders for logged-in user

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.menuItem branch"
    );
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Admin:Get all orders

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user items.menuItem branch");
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
