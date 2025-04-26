const CategoryBoisson = require("../models/CategoryBoisson");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = new CategoryBoisson({ name, description });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryBoisson.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await CategoryBoisson.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await CategoryBoisson.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await CategoryBoisson.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
