import Branch from "../models/Branch.js";
import cloudinary from "../config/cloudinary.js";

export const createBranch = async (req, res) => {
  try {
    const { name, address, phone, openHours } = req.body;
    const file = req.file; // Assuming you're using multer or similar middleware

    if (!name || !address || !phone || !openHours || !file) {
      return res
        .status(400)
        .json({ message: "All fields including image are required" });
    }

    // 👇 If you're using a cloud storage (e.g., Cloudinary), get these from the upload result
    const image = {
      url: file.path, // e.g., Cloudinary secure_url or local path
      public_id: file.filename, // or use Cloudinary public_id or multer filename
    };

    const branch = await Branch.create({
      name,
      address,
      phone,
      openHours,
      image,
    });

    res.status(201).json(branch);
  } catch (error) {
    console.error("Create branch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get all branches

export const getBranches = async (req, res) => {
  try {
    // Get page and limit from query params, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Fetch total count for metadata
    const totalBranches = await Branch.countDocuments();

    // Fetch paginated branches
    const branches = await Branch.find().skip(skip).limit(limit).sort({
      createdAt: -1,
    });

    res.status(200).json({
      branches,
      pagination: {
        total: totalBranches,
        page,
        pages: Math.ceil(totalBranches / limit),
        limit,
      },
    });
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

// export const updateBranch = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, address, phone, openHours } = req.body;

//     // Find the existing branch
//     const branch = await Branch.findById(id);
//     if (!branch) {
//       return res.status(404).json({ message: "Branch not found" });
//     }

//     // If a new image is uploaded, use it; otherwise keep existing
//     const image = req.file?.path || branch.image;

//     // ✅ Validation
//     if (!name || !address || !phone || !openHours || !image) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // ✅ Update the branch
//     const updatedBranch = await Branch.findByIdAndUpdate(
//       id,
//       {
//         name,
//         address,
//         phone,
//         openHours,
//         image,
//       },
//       { new: true }
//     );

//     res.status(200).json(updatedBranch);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findById(id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    // delete old image form cloudinary
    if (branch.image?.public_id) {
      await cloudinary.uploader.destroy(branch.image.public_id);
    }
    // prepare update payload
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }
    const updatedBranch = await Branch.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.status(200).json(updatedBranch);
  } catch (error) {
    console.error("Error updating Branch", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
