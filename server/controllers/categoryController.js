const Category = require('../models/categoryModel');

// Lấy tất cả danh mục sản phẩm
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh mục sản phẩm' });
  }
};
