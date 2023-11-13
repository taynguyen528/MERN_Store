const Image = require('../models/imageProductModel');

// Lấy tất cả hình ảnh của một sản phẩm theo ID sản phẩm
exports.getImagesByProductId = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Lấy tất cả hình ảnh của sản phẩm dựa trên ID sản phẩm
    const images = await Image.find({ product_id: productId });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách hình ảnh sản phẩm' });
  }
};
