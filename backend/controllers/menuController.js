import cloudinary from "../config/cloudinary.js";
import MenuItem from "../models/MenuItem.js";

// desc get all menu Items

export const getAllMenuItems = async (req, res) => {
  try {
    // const items = await MenuItem.find();
    // res.status(200).json(items);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    // console.log(page);
    const skip = (page - 1) * limit;
    //fetch total count
    const totalMenuItems = await MenuItem.countDocuments();
    // fetch paginated items
    const items = await MenuItem.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      items,
      pagination: {
        total: totalMenuItems,
        page,
        pages: Math.ceil(totalMenuItems / limit),
        limit,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch items", error: error.message });
  }
};

// @desc get single menu item
export const getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch item", error: error.message });
  }
};

// desc create a menu item (admin)
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Cloudinary image URL is in req.file.path
    const image = req.file
      ? { url: req.file.path, public_id: req.file.filename }
      : { url: "", public_id: "" };

    const newItem = new MenuItem({
      name,
      description,
      price,
      image,
      category,
    });

    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create item", error: error.message });
  }
};

// @desc    Update a menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.file);
    // find existing branch
    const menu = await MenuItem.findById(id);
    if (!menu) return res.status(404).json({ message: "Menu is not found" });

    // Delete old image from cloudinary
    if (menu.image?.public_id) {
      await cloudinary.uploader.destroy(menu.image.public_id);
    }
    // prepare update payload
    const updatedData = {
      ...req.body,
    };
    if (req.file) {
      updatedData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }
    const updatedMenu = await MenuItem.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json(updatedMenu);
  } catch (error) {
    console.error("Error updating menu", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete item", error: error.message });
  }
};
