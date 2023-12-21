const Rating = require('../models/ratingModel');

exports.getAllRating = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    let query = {};
    
    if (userId !== "All") {
      query.user_id = userId;
    }

    if (productId !== "All") {
      query.product_id = productId;
    }

    const ratings = await Rating.find(query).populate('user_id');
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy đánh giá' });
  }
};
exports.getRatingByProductId = async (req, res) => {
  try {
    const ratings = await Rating.find({ product_id: req.params.product_id }).populate('user_id');
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy đánh giá' });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { product_id, user_id, rating, comment, created_at } = req.body;

    const newRating = new Rating({
      product_id,
      user_id,
      rating,
      comment,
      created_at
    });

    await newRating.save();

    res.status(201).json({ message: 'Đánh giá đã được thêm thành công!' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi thêm đánh giá' });
  }
};
exports.deleteRating = async (req, res) => {
  try {
    const RatingId = req.params.RatingId;
    const category = await Rating.findByIdAndDelete(RatingId);
    if (!category) {
      return res.status(404).json({ message: 'Đánh giá không tồn tại' });
    }
    res.json({ message: 'Đánh giá đã bị xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa Đánh giá' + error });
  }
};  