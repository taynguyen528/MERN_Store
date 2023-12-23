const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            "mongodb://0.0.0.0:27017/MERN_Store",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Kết nối cơ sở dữ liệu thành công");
        return connection.connection.db;
    } catch (error) {
        console.error("Lỗi kết nối cơ sở dữ liệu:", error);
        throw error;
    }
};

module.exports = {
    async up(db) {
        const database = await connectDB();

        const rolesCollection = database.collection("roles");
        const usersCollection = database.collection("users");
        const categorysCollection = database.collection("categories");
        const subcategorysCollection = database.collection("subcategories");
        const productsCollection = database.collection("products");
        const imagesCollection = database.collection("images");
        const sizesCollection = database.collection("sizes");
        const colorsCollection = database.collection("colors");
        const productsizecolorsCollection =
            database.collection("productsizecolors");

        await rolesCollection.insertMany([
            {
                roleName: "admin",
            },
            {
                roleName: "user",
            },
        ]);

        const adminRole = await rolesCollection.findOne({ roleName: "admin" });

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("12345678", saltRounds);

        await usersCollection.insertOne({
            firstname: "Tây",
            lastname: "Nguyên",
            username: "admin",
            password: hashedPassword,
            phone: "0867835779",
            email: "pttnguyen528@gmail.com",
            address: "Gia Lai",
            idRole: adminRole._id,
        });

        await categorysCollection.insertMany([
            {
                name: "Giày Dép",
            },
            {
                name: "Áo Khoác",
            },
            {
                name: "Áo Thun",
            },
            {
                name: "Áo Sơ Mi",
            },
            {
                name: "Quần Dài",
            },
            {
                name: "Quần Short",
            },
            {
                name: "Phụ Kiện",
            },
        ]);

        const catGiayDep = await categorysCollection.findOne({
            name: "Giày Dép",
        });
        const catAoThun = await categorysCollection.findOne({
            name: "Áo Thun",
        });
        const catAoSoMi = await categorysCollection.findOne({
            name: "Áo Sơ Mi",
        });
        const catAoKhoac = await categorysCollection.findOne({
            name: "Áo Khoác",
        });
        const catQuanDai = await categorysCollection.findOne({
            name: "Quần Dài",
        });
        const catQuanShort = await categorysCollection.findOne({
            name: "Quần Short",
        });
        const catPhuKien = await categorysCollection.findOne({
            name: "Phụ Kiện",
        });

        await subcategorysCollection.insertMany([
            {
                category_id: catGiayDep._id,
                name: "Giày Thời Trang",
            },
            {
                category_id: catGiayDep._id,
                name: "Giày Chạy Bộ",
            },
            {
                category_id: catGiayDep._id,
                name: "Giày Bóng Rổ",
            },
            {
                category_id: catGiayDep._id,
                name: "Giày Bóng Đá",
            },
            {
                category_id: catGiayDep._id,
                name: "Dép Quai Ngang",
            },
            {
                category_id: catGiayDep._id,
                name: "Dép Xỏ Ngón",
            },
            {
                category_id: catAoThun._id,
                name: "Áo Ba Lổ & Áo Thun",
            },
            {
                category_id: catAoThun._id,
                name: "Áo Thun Tay Ngắn",
            },
            {
                category_id: catAoThun._id,
                name: "Áo Thun Tay Dài",
            },
            {
                category_id: catAoThun._id,
                name: "Áo Thun Polo",
            },
            {
                category_id: catAoSoMi._id,
                name: "Sơ Mi Tay Ngắn",
            },
            {
                category_id: catAoSoMi._id,
                name: "Sơ Mi Tay Dài",
            },
            {
                category_id: catAoKhoac._id,
                name: "Áo Khoác Nỉ",
            },
            {
                category_id: catAoKhoac._id,
                name: "Áo Khoác Dù",
            },
            {
                category_id: catAoKhoac._id,
                name: "Áo Khoác Kaki",
            },
            {
                category_id: catAoKhoac._id,
                name: "Áo Khoác Blazer",
            },
            {
                category_id: catQuanDai._id,
                name: "Quần Kaki",
            },
            {
                category_id: catQuanDai._id,
                name: "Quần Tây Nam",
            },
            {
                category_id: catQuanDai._id,
                name: "Quần Jean",
            },
            {
                category_id: catQuanDai._id,
                name: "Quần Jogger Thun",
            },
            {
                category_id: catQuanDai._id,
                name: "Quần Jogger Kaki",
            },
            {
                category_id: catQuanShort._id,
                name: "Quần Short Kaki",
            },
            {
                category_id: catQuanShort._id,
                name: "Quần Short Thun",
            },
            {
                category_id: catQuanShort._id,
                name: "Quần Short Jean",
            },
            {
                category_id: catQuanShort._id,
                name: "Quần Short Tây",
            },
            {
                category_id: catQuanShort._id,
                name: "Quần Short Dù",
            },
            {
                category_id: catPhuKien._id,
                name: "Ví Da",
            },
            {
                category_id: catPhuKien._id,
                name: "Dây Nịt",
            },
            {
                category_id: catPhuKien._id,
                name: "Cà Vạt, Nơ",
            },
            {
                category_id: catPhuKien._id,
                name: "Vớ",
            },
        ]);

        const subcatGiayDep = await subcategorysCollection.findOne({
            name: "Giày Thời Trang",
        });

        await productsCollection.insertMany([
            {
                subcategory_id: subcatGiayDep._id,
                name: "Giày Thể Thao Nữ New Balance 574 Classic Wl574Evg Lifestyle",
                price: 2559000,
                description:
                    "574 không chỉ là một đôi giày. Với những đường nét gọn gàng, phối màu độc đáo và kiểu dáng cổ điển và được làm từ chất liệu cải tiến, đôi giày sneaker này là biểu tượng của sự khéo léo và độc đáo - bất kể bạn phối hợp nó với bất kỳ phong cách nào.",
                url_image1: "/images/product/imageProduct_1.webp",
                url_image2: "/images/product/imageProduct_2.webp",
            },
        ]);

        const product = await productsCollection.findOne({
            name: "Giày Thể Thao Nữ New Balance 574 Classic Wl574Evg Lifestyle",
        });

        await imagesCollection.insertMany([
            {
                product_id: product._id,
                image_url: "/images/product/imageProduct_1.webp",
            },
            {
                product_id: product._id,
                image_url: "/images/product/imageProduct_2.webp",
            },
            {
                product_id: product._id,
                image_url: "/images/product/imageProduct_3.webp",
            },
            {
                product_id: product._id,
                image_url: "/images/product/imageProduct_4.webp",
            },
            {
                product_id: product._id,
                image_url: "/images/product/imageProduct_5.webp",
            },
            {
                product_id: product._id,
                image_url: "/images/product/imageProduct_6.webp",
            },
            {
                product_id: product._id,
                image_url: "/images/product/imageProduct_7.webp",
            },
            {
                product_id: product._id,
                image_url: "/images/product/imageProduct_8.webp",
            },
            {
                product_id: product._id,
                image_url: "/images/product/imageProduct_9.webp",
            },
        ]);

        await colorsCollection.insertMany([
            {
                color_name: "Đỏ",
            },
            {
                color_name: "Trắng",
            },
            {
                color_name: "Kem",
            },
            {
                color_name: "Đen",
            },
            {
                color_name: "Xanh Dương",
            },
            {
                color_name: "Xanh Lá",
            },
            {
                color_name: "Xanh Đen",
            },
            {
                color_name: "Vàng",
            },
            {
                color_name: "Xám",
            },
            {
                color_name: "Hồng",
            },
        ]);

        await sizesCollection.insertMany([
            {
                size_name: "NO SIZE",
            },
            {
                size_name: "M",
            },
            {
                size_name: "L",
            },
            {
                size_name: "XL",
            },
            {
                size_name: "XXL",
            },
            {
                size_name: "37",
            },
            {
                size_name: "38",
            },
            {
                size_name: "39",
            },
            {
                size_name: "40",
            },
            {
                size_name: "41",
            },
            {
                size_name: "42",
            },
            {
                size_name: "43",
            },
            {
                size_name: "44",
            },
        ]);

        const color1 = await colorsCollection.findOne({ color_name: "Đỏ" });
        const size1 = await sizesCollection.findOne({ size_name: "42" });
        const color2 = await colorsCollection.findOne({ color_name: "Đen" });
        const size2 = await sizesCollection.findOne({ size_name: "39" });

        await productsizecolorsCollection.insertMany([
            {
                product_id: product._id,
                size_id: size1._id,
                color_id: color1._id,
                quantity: 100,
            },
            {
                product_id: product._id,
                size_id: size2._id,
                color_id: color2._id,
                quantity: 100,
            },
        ]);
    },

    async down(db) {
        const database = await connectDB();

        const rolesCollection = database.collection("roles");
        const usersCollection = database.collection("users");
        const categorysCollection = database.collection("categorys");
        const subcategorysCollection = database.collection("subcategorys");
        const productsCollection = database.collection("products");
        const imagesCollection = database.collection("images");
        const colorsCollection = database.collection("colors");
        const sizesCollection = database.collection("sizes");
        const productsizecolorsCollection =
            database.collection("productsizecolors");

        await subcategorysCollection.deleteMany({});

        await categorysCollection.deleteMany({});

        await usersCollection.deleteMany({});

        await rolesCollection.deleteMany({});

        await productsCollection.deleteMany({});

        await imagesCollection.deleteMany({});

        await colorsCollection.deleteMany({});

        await sizesCollection.deleteMany({});

        await productsizecolorsCollection.deleteMany({});
    },
};
