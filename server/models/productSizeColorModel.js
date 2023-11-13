const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSizeColorSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    size_id: { type: Schema.Types.ObjectId, ref: 'Size' },
    color_id: { type: Schema.Types.ObjectId, ref: 'Color' },
    quantity: Number,
});

const ProductSizeColor = mongoose.model('ProductSizeColor', productSizeColorSchema);
module.exports = ProductSizeColor;
