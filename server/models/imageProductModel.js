const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    image_url: String,
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
