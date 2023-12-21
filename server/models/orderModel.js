const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: String,
    phone: String,
    address: String,
    order_date: Date,
    total_price: Number,
    status: String,
    note: String
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
