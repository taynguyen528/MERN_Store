const Size = require('../models/sizeModel');

// Lấy tất cả các size
exports.getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.find();
    res.json(sizes);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách size' });
  }
};
