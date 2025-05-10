import Review from "../models/Review";

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const menuId = req.params.menuId;

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      menu: menuId,
    });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this item" });
    }
    const review = new Review({
      user: req.user._id,
      menu: menuId,
      rating: Number(rating),
      comment,
    });
    const createdReview = await review.save();
    res.status(201).json(createReview);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getReviewByMenu = async (req, res) => {
  try {
    const reviews = await Review.find({ menu: req.params.menuId }).populate(
      "user",
      "name"
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
