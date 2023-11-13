const ProductSizeColor = require('../models/productSizeColorModel');

// Lấy thông tin mục sản phẩm theo ID sản phẩm
exports.getProductSizeColorById = async (req, res) => {
  try {
    const product_id = req.params.product_id;

    const productSizeColor = await ProductSizeColor.find({ product_id: product_id })
      .populate('size_id', 'size_name')
      .populate('color_id', 'color_name');

    if (!productSizeColor) {
      return res.status(404).json({ message: 'Mục sản phẩm không tồn tại' });
    }
    res.json(productSizeColor);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin mục sản phẩm' });
  }
};
