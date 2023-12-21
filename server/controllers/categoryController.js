const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const ProductSizeColor = require('../models/productSizeColorModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const Subcategory = require('../models/subcategoryModel');
const Image = require('../models/imageProductModel');

// Lấy tất cả danh mục sản phẩm
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh mục sản phẩm' });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const existingCategory = await Category.findOne({ name: categoryName });
    if (existingCategory) {
      return res.status(401).json({ message: 'Danh mục đã tồn tại!' });
    }

    const newCategory = new Category({
      name: categoryName
    });

    await newCategory.save();

    res.status(201).json({ message: 'Danh mục đã được thêm thành công!' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi thêm danh mục' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.CategoryId);
    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }

    res.json({
      category: category,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin Danh mục' });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const updateFields = {
      name: categoryName
    };

    // Thực hiện cập nhật thông tin Danh mục
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.CategoryId,
      updateFields,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }

    res.json(updatedCategory);

  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin Danh mục' + error });
  }
};

// Xóa Danh mục bằng ID
exports.deleteCategory = async (req, res) => {
  try {
    const CategoryId = req.params.CategoryId;
    const category = await Category.findByIdAndDelete(CategoryId);
    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }

    const subcategories = await Subcategory.find({ category_id: CategoryId });
    await Promise.all(
      subcategories.map(async (sub) => {
        const products = await Product.find({ subcategory_id: sub._id });
        await Promise.all(
          products.map(async (product) => {
            await deleteProduct(product._id);
          })
        );
      })
    );

    await Subcategory.deleteMany({ category_id: CategoryId });

    res.json({ message: 'Danh mục đã bị xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa Danh mục' + error });
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
