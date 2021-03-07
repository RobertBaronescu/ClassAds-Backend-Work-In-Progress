const { findById } = require("../models/category");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "",
    });
  }
};

exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.categoryId });
    const subcategories = await Subcategory.find({
      _id: { $in: category.subcategoriesIds },
    });
    
    return res.status(200).json(subcategories);
  } catch (error) {
    return res.status(500).json({});
  }
};
