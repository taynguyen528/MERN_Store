const Color = require('../models/colorModel');

// Lấy tất cả màu sắc
exports.getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách màu sắc' });
  }
};