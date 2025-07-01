import Review from "../models/Review.js";
import MenuItem from "../models/MenuItem.js";

// @desc    Create a new review
// @route   POST /api/reviews/:menuId
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const menuId = req.params.menuId;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Please enter rating and comment" });
    }

    const menuExists = await MenuItem.findById(menuId);
    if (!menuExists) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      menu: menuId,
    });

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this menu" });
    }

    const review = new Review({
      user: req.user._id,
      menu: menuId,
      rating: Number(rating),
      comment,
      status: "pending", // default status
    });

    const createdReview = await review.save();

    // Update average rating and numReviews
    const reviews = await Review.find({ menu: menuId });
    const averageRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    menuExists.numReviews = reviews.length;
    menuExists.averageRating = averageRating.toFixed(1);
    await menuExists.save();

    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get reviews for a specific menu item
// @route   GET /api/reviews/:menuId
// @access  Public
export const getReviewByMenu = async (req, res) => {
  try {
    const reviews = await Review.find({ menu: req.params.menuId }).populate(
      "user",
      "name"
    );
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a review by ID
// @route   DELETE /api/reviews/:id
// @access  Admin
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const menuId = review.menu;

    await Review.findByIdAndDelete(req.params.id);

    // Recalculate ratings
    const remainingReviews = await Review.find({ menu: menuId });
    const averageRating =
      remainingReviews.reduce((acc, item) => acc + item.rating, 0) /
      (remainingReviews.length || 1);

    const menuItem = await MenuItem.findById(menuId);
    if (menuItem) {
      menuItem.numReviews = remainingReviews.length;
      menuItem.averageRating = remainingReviews.length
        ? averageRating.toFixed(1)
        : 0;
      await menuItem.save();
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all reviews (Admin only)
// @route   GET /api/reviews
// @access  Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("menu", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update review status (approve/reject)
// @route   PATCH /api/reviews/:reviewId/status
// @access  Admin
export const updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.status = status;
    await review.save();

    res.status(200).json({ message: "Review status updated", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
