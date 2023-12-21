const Category = require('../models/categoryModel');
const Subcategory = require('../models/subcategoryModel');
const Product = require('../models/productModel');
const ProductSizeColor = require('../models/productSizeColorModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const Image = require('../models/imageProductModel');

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

exports.addSubCategory = async (req, res) => {
  try {
    const { subCategoryName, category_id } = req.body;
    const existingSubCategory = await Subcategory.findOne({ name: subCategoryName });
    if (existingSubCategory) {
      return res.status(401).json({ message: 'Danh mục con đã tồn tại!' });
    }

    const newSubCategory = new Subcategory({
      category_id,
      name: subCategoryName
    });

    await newSubCategory.save();

    res.status(201).json({ message: 'Danh mục con đã được thêm thành công!' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi thêm danh mục con' });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.SubCategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: 'Danh mục con không tồn tại' });
    }

    res.json({
      subcategory: subcategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin danh mục con' });
  }
};

exports.editSubCategory = async (req, res) => {
  try {
    const { subCategoryName } = req.body;

    const updateFields = {
      name: subCategoryName
    };

    // Thực hiện cập nhật thông tin Danh mục
    const updatedSubCategory = await Subcategory.findByIdAndUpdate(
      req.params.SubCategoryId,
      updateFields,
      { new: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ message: 'Danh mục con không tồn tại' });
    }

    res.json(updatedSubCategory);

  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin Danh mục con' + error });
  }
};

// Xóa Danh mục bằng ID
exports.deleteSubCategory = async (req, res) => {
  try {
    const SubCategoryId = req.params.SubCategoryId;
    const subcategory = await Subcategory.findByIdAndDelete(SubCategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: 'Danh mục con không tồn tại' });
    }

    const products = await Product.find({ subcategory_id: SubCategoryId });
    await Promise.all(
      products.map(async (product) => {
        await deleteProduct(product._id);
      })
    );

    res.json({ message: 'Danh mục con đã bị xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa Danh mục con' + error });
  }
};

const deleteProduct = async (productId) => {
  try {

    // Bước 1: Lấy danh sách hình ảnh, đơn hàng và mục đơn hàng liên quan đến sản phẩm dựa trên product_id
    const orderItems = await OrderItem.find({ product_id: productId });
    const orders = await Order.find({ _id: { $in: orderItems.map(orderItem => orderItem.order_id) } });

    // Bước 2: Xóa tất cả các mục đơn hàng (order items) liên quan đến sản phẩm
    await OrderItem.deleteMany({ product_id: productId });

    // Bước 3: Xóa tất cả đơn hàng (orders) liên quan đến sản phẩm
    await Order.deleteMany({ _id: { $in: orders.map(order => order._id) } });

    // Bước 4: Xóa tất cả hình ảnh liên quan đến sản phẩm
    const imageUrlsToDelete = await Image.find({ product_id: productId });

    // Xóa tệp ảnh từ thư mục public/images/product
    imageUrlsToDelete.forEach((imageUrl) => {
      const imagePath = path.join(__dirname, '..', 'public', imageUrl.image_url);
      fs.unlinkSync(imagePath);
    });
    await Image.deleteMany({ product_id: productId });

    await ProductSizeColor.deleteMany({ product_id: productId });

    // Bước 5: Xóa sản phẩm
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    return { message: 'Sản phẩm đã bị xóa, cùng với các đơn hàng và hình ảnh liên quan' };
  } catch (error) {
    throw new Error('Lỗi khi xóa sản phẩm và các liên quan');
  }
};
