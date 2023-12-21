const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const User = require('../models/userModel');
const ProductSizeColor = require('../models/productSizeColorModel');
const Color = require('../models/colorModel');
const Size = require('../models/sizeModel');

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
  }
};

// Lấy thông tin đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin đơn hàng' });
  }
};

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {

  try {
    const newOrder = new Order({
      user_id: req.body.user_id,
      receiver: req.body.receiver,
      phone: req.body.phone,
      address: req.body.address,
      order_date: req.body.order_date,
      total_price: req.body.total_price,
      status: req.body.status,
      note: req.body.note
    });
    const order = await newOrder.save();

    for (const order_item of req.body.order_items) {
      const item = new OrderItem({
        order_id: order._id,
        product_id: order_item.product_id,
        color: order_item.color,
        size: order_item.size,
        quantity: order_item.quantity,
      });

      await item.save();

      const color = await Color.findOne({ color_name: order_item.color });
      const size = await Size.findOne({ size_name: order_item.size });
      await ProductSizeColor.findOneAndUpdate(
        {
          product_id: order_item.product_id,
          color_id: color._id,
          size_id: size._id,
        },
        {
          $inc: { quantity: -order_item.quantity },
        },
        { new: true }
      );
    }
    res.json({ message: 'Tạo mới đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo đơn hàng' });
  }
};

// Cập nhật đơn hàng theo ID
exports.editOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật đơn hàng' });
  }
};

// Xóa đơn hàng theo ID
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Xóa đơn hàng
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }

    // Xóa tất cả các mục đơn hàng (order items) liên quan đến đơn hàng
    await OrderItem.deleteMany({ order_id: orderId });

    res.json({ message: 'Đơn hàng và các mục đơn hàng đã bị xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa đơn hàng và các mục đơn hàng' });
  }
};

// Lấy tất cả đơn hàng của một người dùng theo ID người dùng
exports.getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Kiểm tra xem người dùng có tồn tại hay không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Lấy tất cả đơn hàng của người dùng dựa trên ID người dùng
    const orders = await Order.find({ user_id: userId }).populate('user_id');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng của người dùng' });
  }
};

exports.changeStatusOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const newStatus = req.params.newStatus;

    // Tìm và cập nhật trạng thái của đơn hàng
    const updatedOrder = await Order.findOne(
      { _id: orderId }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }

    // Nếu trạng thái mới là "Hủy đơn", thực hiện tăng số lượng sản phẩm trong orderdetail
    if (newStatus === "Hủy đơn") {
      // Lấy danh sách orderdetail của đơn hàng
      const orderDetails = await OrderItem.find({ order_id: orderId });

      // Duyệt qua từng orderdetail và tăng số lượng sản phẩm
      for (const orderDetail of orderDetails) {
        const color = await Color.findOne({ color_name: orderDetail.color });
        const size = await Size.findOne({ size_name: orderDetail.size });
        await ProductSizeColor.findOneAndUpdate(
          {
            product_id: orderDetail.product_id,
            color_id: color._id,
            size_id: size._id,
          },
          {
            $inc: { quantity: +orderDetail.quantity },
          },
          { new: true }
        );
      }
    }
    if (updatedOrder.status === "Hủy đơn" && newStatus !== "Hủy đơn") {
      // Lấy danh sách orderdetail của đơn hàng
      const orderDetails = await OrderItem.find({ order_id: orderId });

      // Duyệt qua từng orderdetail và giảm số lượng sản phẩm
      for (const orderDetail of orderDetails) {
        const color = await Color.findOne({ color_name: orderDetail.color });
        const size = await Size.findOne({ size_name: orderDetail.size });
        await ProductSizeColor.findOneAndUpdate(
          {
            product_id: orderDetail.product_id,
            color_id: color._id,
            size_id: size._id,
          },
          {
            $inc: { quantity: -orderDetail.quantity },
          },
          { new: true }
        );
      }
    }
    // Tìm và cập nhật trạng thái của đơn hàng
    await Order.findOneAndUpdate(
      { _id: orderId },
      { status: newStatus },
      { new: true }
    );

    return res.status(200).json({
      message: `Đơn đặt hàng #${orderId} đã được cập nhật thành trạng thái "${newStatus}"`,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi khi thay đổi trạng thái đơn đặt hàng',
      error: error.message,
    });
  }
};
