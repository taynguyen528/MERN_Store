const OrderItem = require('../models/orderItemModel');

// Lấy tất cả các mục đơn hàng của một đơn hàng theo ID đơn hàng
exports.getOrderItemsByOrderId = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Lấy tất cả các mục đơn hàng của đơn hàng dựa trên ID đơn hàng
    const orderItems = await OrderItem.find({ order_id: orderId }).populate('product_id');
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách mục đơn hàng của đơn hàng' });
  }
};