const Category = require('../models/categoryModel');
const Subcategory = require('../models/subcategoryModel');

// Lấy tất cả danh mục con theo category_id
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    if (categoryId == 0) {
      const categories = await Category.find().sort({ _id: 1 }).limit(1);
      if (categories.length > 0) {
        const firstCategoryId = categories[0]._id;
        const subcategories = await Subcategory.find({ category_id: firstCategoryId });
        res.json(subcategories);
      } else {
        res.json([]);
      }
    } else {
      const subcategories = await Subcategory.find({ category_id: categoryId });
      res.json(subcategories);
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục con' });
  }
};

exports.getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    // Lấy tất cả các category
    const categories = await Category.find();

    // Mảng chứa thông tin categories và subcategories
    const categoriesWithSubcategories = [];

    for (const category of categories) {
      // Lấy danh sách subcategories của category hiện tại
      const subcategories = await Subcategory.find({ category_id: category._id });

      // Tạo một đối tượng chứa thông tin category và subcategories của nó
      const categoryData = {
        category: category,
        subcategories: subcategories,
      };

      // Thêm đối tượng categoryData vào mảng categoriesWithSubcategories
      categoriesWithSubcategories.push(categoryData);
    }

    res.json(categoriesWithSubcategories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách category và subcategory' });
  }
};
