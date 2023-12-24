const Product = require('../models/productModel');
const ProductSizeColor = require('../models/productSizeColorModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const Subcategory = require('../models/subcategoryModel');
const Image = require('../models/imageProductModel');
const fs = require('fs');
const path = require('path');

const multer = require('multer');
const Category = require('../models/categoryModel');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/product');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategory_id',
                    foreignField: '_id',
                    as: 'subcategory',
                },
            },
            {
                $unwind: '$subcategory',
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'subcategory.category_id',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: '$category',
            },
            {
                $project: {
                    _id: '$_id',
                    product_name: '$name',
                    price: 1,
                    description: 1,
                    url_image1: '$url_image1',
                    url_image2: '$url_image2',
                    category_name: '$category.name',
                    subcategory_name: '$subcategory.name',
                },
            },
        ]);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm' });
    }
};

// Lấy thông tin sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Sử dụng aggregate để nối thông tin sản phẩm, subcategory, và category
        const productWithDetails = await Product.aggregate([
            {
                $match: { _id: product._id }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subcategory_id',
                    foreignField: '_id',
                    as: 'subcategory'
                }
            },
            {
                $unwind: '$subcategory'
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'subcategory.category_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $project: {
                    _id: '$_id',
                    product_name: '$name',
                    price: 1,
                    description: 1,
                    url_image1: '$url_image1',
                    url_image2: '$url_image2',
                    category_id: '$category._id',
                    subcategory_id: '$subcategory._id',
                    category_name: '$category.name',
                    subcategory_name: '$subcategory.name',
                }
            }
        ]);

        if (productWithDetails.length > 0) {
            res.json(productWithDetails[0]);
        } else {
            res.status(404).json({ message: 'Không thể tìm thấy thông tin sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm' });
    }
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        upload.array('images', 5)(req, res, async (err) => {
            if (err) {
                // Xử lý lỗi nếu có
                console.error('Lỗi' + err);
                return res.status(500).json({ message: 'Lỗi khi xử lý tệp tải lên' });
            }
            const name = req.body.name;
            const price = req.body.price;
            const description = req.body.description;
            const subcategory_id = req.body.subcategory_id;
            const color_size = JSON.parse(req.body.color_size);
            const imageUrls = req.files.map((file) => file.filename);

            const url_image1 = `/images/product/${imageUrls[0]}`;
            const url_image2 = `/images/product/${imageUrls[1]}`;

            const newProduct = new Product({
                name,
                price,
                description,
                subcategory_id,
                url_image1,
                url_image2
            });

            const product = await newProduct.save();

            for (const imageUrl of imageUrls) {
                const imageProduct = new Image({
                    product_id: product._id,
                    image_url: `/images/product/${imageUrl}`,
                });
                await imageProduct.save();
            }

            for (const colorSize of color_size) {
                const colorSizeProduct = new ProductSizeColor({
                    product_id: product._id,
                    size_id: colorSize.size,
                    color_id: colorSize.color,
                    quantity: colorSize.quantity,
                });
                await colorSizeProduct.save();
            }
            res.json({ message: 'Sản phẩm đã được tạo thành công' });
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo sản phẩm' });
    }
};

// Cập nhật sản phẩm theo ID
exports.editProduct = async (req, res) => {
    try {
        upload.array('images', 5)(req, res, async (err) => {
            if (err) {
                // Xử lý lỗi nếu có
                console.error('Lỗi' + err);
                return res.status(500).json({ message: 'Lỗi khi xử lý tệp tải lên' });
            }
            const productId = req.params.productId;
            const name = req.body.name;
            const price = req.body.price;
            const description = req.body.description;
            const subcategory_id = req.body.subcategory_id;
            const color_size = JSON.parse(req.body.color_size);

            if (req.files && req.files.length > 0) {
                const imageUrls = req.files.map((file) => file.filename);
                // Thêm hình ảnh mới của sản phẩm
                for (const imageUrl of imageUrls) {
                    const imageProduct = new Image({
                        product_id: productId,
                        image_url: `/images/product/${imageUrl}`,
                    });
                    await imageProduct.save();
                }

                const imageUrlsToDelete = await Image.find({ product_id: productId });

                // Cập nhật thông tin sản phẩm
                await Product.findByIdAndUpdate(productId, {
                    name,
                    price,
                    description,
                    subcategory_id,
                    url_image1: imageUrlsToDelete[0].image_url,
                    url_image2: imageUrlsToDelete[1].image_url
                });

            }
            
            // Cập nhật thông tin sản phẩm
            await Product.findByIdAndUpdate(productId, {
                name,
                price,
                description,
                subcategory_id
            });

            // Xóa thông tin màu sắc và kích thước cũ của sản phẩm
            await ProductSizeColor.deleteMany({ product_id: productId });

            // Thêm thông tin màu sắc và kích thước mới của sản phẩm
            for (const colorSize of color_size) {
                const colorSizeProduct = new ProductSizeColor({
                    product_id: productId,
                    size_id: colorSize.size,
                    color_id: colorSize.color,
                    quantity: colorSize.quantity,
                });
                await colorSizeProduct.save();
            }

            res.json({ message: 'Sản phẩm đã được chỉnh sửa thành công' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi chỉnh sửa sản phẩm' });
    }
};

// Xóa sản phẩm theo ID
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Bước 1: Lấy danh sách hình ảnh, đơn hàng và mục đơn hàng liên quan đến sản phẩm dựa trên product_id
        const orderItems = await OrderItem.find({ product_id: productId });
        const orders = await Order.find({ _id: { $in: orderItems.map(orderItem => orderItem.order_id) } });

        // Bước 2: Xóa tất cả các mục đơn hàng (order items) liên quan đến sản phẩm
        await OrderItem.deleteMany({ product_id: productId });

        // Bước 3: Xóa tất cả đơn hàng (orders) liên quan đến sản phẩm
        await Order.deleteMany({ _id: { $in: orders.map(order => order._id) } });

        // Bước 4: Xóa tất cả hình ảnh liên quan đến sản phẩm
        const imageUrlsToDelete = await Image.find({ product_id: productId });

        // Xóa tệp ảnh từ thư mục public/images/product
        imageUrlsToDelete.forEach((imageUrl) => {
            const imagePath = path.join(__dirname, '..', 'public', imageUrl.image_url);
            fs.unlinkSync(imagePath);
        });
        await Image.deleteMany({ product_id: productId });

        await ProductSizeColor.deleteMany({ product_id: productId });

        // Bước 5: Xóa sản phẩm
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.json({ message: 'Sản phẩm đã bị xóa, cùng với các đơn hàng và hình ảnh liên quan' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm và các liên quan' });
    }
};

// Lấy tất cả sản phẩm theo subcategory_id
exports.getProductsBySubcategory = async (req, res) => {
    try {
        const subcategoryName = req.params.subcategoryName;
        const subcategory = await Subcategory.findOne({ name: subcategoryName });
        const orderBy = req.params.orderby;

        let sortOptions = {};

        if (orderBy === 'manual') {
            sortOptions = { _id: -1 };
        } else if (orderBy === 'price-ascending') {
            sortOptions = { price: 1 };
        } else if (orderBy === 'price-descending') {
            sortOptions = { price: -1 };
        } else if (orderBy === 'title-ascending') {
            sortOptions = { name: 1 };
        } else if (orderBy === 'title-descending') {
            sortOptions = { name: -1 };
        }

        if (!subcategory) {
            return res.status(404).json({ message: 'Danh mục con không tồn tại' });
        }
        if (!subcategory) {
            return res.status(404).json({ message: 'Danh mục con không tồn tại' });
        }
        const products = await Product.find({
            subcategory_id: subcategory._id
        }).sort(sortOptions);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm theo subcategory_id' });
    }
};

// Lấy tất cả sản phẩm theo category_id
exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const orderBy = req.params.orderby;

        let sortOptions = {};

        if (orderBy === 'manual') {
            sortOptions = { _id: -1 };
        } else if (orderBy === 'price-ascending') {
            sortOptions = { price: 1 };
        } else if (orderBy === 'price-descending') {
            sortOptions = { price: -1 };
        } else if (orderBy === 'title-ascending') {
            sortOptions = { name: 1 };
        } else if (orderBy === 'title-descending') {
            sortOptions = { name: -1 };
        }
        const category = await Category.findOne({ name: categoryName });

        if (!category) {
            return res.status(404).json({ message: 'Danh mục con không tồn tại' });
        }

        // Lấy tất cả subcategory_id thuộc category_id
        const subcategories = await Subcategory.find({ category_id: category._id });

        const subcategoryIds = subcategories.map((subcategory) => subcategory._id);

        // Lấy tất cả sản phẩm thuộc các subcategory_id đã tìm được
        const products = await Product.find({ subcategory_id: { $in: subcategoryIds } }).sort(sortOptions);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm theo category_id' });
    }
};

exports.getNewestProducts = async (req, res) => {
    try {
        const newestProducts = await Product
            .find()
            .sort({ _id: -1 })
            .limit(8);

        res.json(newestProducts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm mới nhất' });
    }
};

exports.search = async (req, res) => {
    const keyword = req.params.keyword;

    try {
        const results = await Product.find({
            name: { $regex: new RegExp(keyword, 'i') }
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm kiếm sản phẩm' });
    }
}

exports.checkUserHasPurchased = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const orderItems = await OrderItem.find({ product_id: productId });

        // Extract order_ids from the found orderItems
        const orderIds = orderItems.map(orderItem => orderItem.order_id);

        // Fetch associated Order documents
        const orders = await Order.find({ _id: { $in: orderIds } });

        // Check if there's an order with the specified user_id
        const userHasPurchased = orders.some(order => order.user_id == userId);

        if (userHasPurchased) {
            res.status(200).json({ message: 'Success' });
        } else {
            res.status(201).json({ message: 'Null' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi' });
    }
};
