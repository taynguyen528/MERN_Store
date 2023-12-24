const Image = require('../models/imageProductModel');
const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');

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

exports.deleteImages = async (req, res) => {
  try {
    const imageId = req.params.imageId;

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Hình ảnh không tồn tại' });
    }
    const productId = image.product_id;

    // Xóa tệp ảnh từ thư mục public/images/product
    const imagePath = path.join(__dirname, '..', 'public', image.image_url);
    fs.unlinkSync(imagePath);

    await Image.findByIdAndDelete(imageId);

    const imageUrlsToDelete = await Image.find({ product_id: productId });

    // Cập nhật thông tin sản phẩm
    await Product.findByIdAndUpdate(productId, {
      url_image1: imageUrlsToDelete[0].image_url,
      url_image2: imageUrlsToDelete[1].image_url
    });
    res.json({ message: 'Xóa hình ảnh thành công', images: imageUrlsToDelete });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Lỗi khi xóa hình ảnh sản phẩm' });
  }
};