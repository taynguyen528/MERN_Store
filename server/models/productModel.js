const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    subcategory_id: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
    name: String,
    price: Number,
    description: String,
    url_image1: String,
    url_image2: String
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
