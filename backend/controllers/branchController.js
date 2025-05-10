import Branch from "../models/Branch";

export const createBranch = async (req, res) => {
  try {
    const { name, address, contact, openHours } = req.body;
    if (!name || !address || !contact || !openHours) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const branch = await Branch.create({ name, address, contact, openHours });
    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// get all branches

export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({});
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
