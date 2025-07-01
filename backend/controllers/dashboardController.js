import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import Branch from "../models/Branch.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalMenuItems = await MenuItem.countDocuments();
    const totalBranches = await Branch.countDocuments();
    const totalReviews = await Review.countDocuments();

    const orderByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const topSellingItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          totalSold: { $sum: "$items.quality" },
        },
      },
      {
        $lookup: {
          from: "menuItems",
          localField: "_id",
          foreignField: "_id",
          as: "menuItemDetails",
        },
      },
      { $unwind: "$menuItemDetails" },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);
    res.json({
      totalUsers,
      totalOrders,
      totalSales: totalSales[0]?.total || 0,
      totalMenuItems,
      totalBranches,
      totalReviews,
      orderByStatus,
      topSellingItems,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to load dashboard", error: error.message });
  }
};
