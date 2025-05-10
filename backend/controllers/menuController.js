import MenuItem from "../models/MenuItem";

// desc get all menu Items

export const getMenuItems = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";
    const category = req.query.category || "";
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const query = {
      ...(search && { name: { $regex: search, $options: "i" } }),
      ...(category && category),
    };

    const count = await MenuItem.countDocuments(query);
    const items = await MenuItem.find(query)
      .sort({ [sortBy]: order })
      .skip(limit * (page - 1))
      .limit(limit);

    res.json({ items, page, pages: Math.ceil(count / limit), total: count });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch menu items");
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
    const { name, description, price, imageUrl, category } = req.body;

    const newItem = new MenuItem({
      name,
      description,
      price,
      imageUrl,
      category,
    });

    const saveItem = await newItem.save();
    res.status(201).json(saveItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create item ", error: error.message });
  }
};

// @desc    Update a menu item
export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    Object.assign(item, req.body);
    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update item", error: error.message });
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
