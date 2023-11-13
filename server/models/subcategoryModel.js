const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
    category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
    name: String,
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);
module.exports = Subcategory;
