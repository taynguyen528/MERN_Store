// db.js
const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Kết nối cơ sở dữ liệu thành công");
        return connection;
    } catch (error) {
        console.error("Lỗi kết nối cơ sở dữ liệu:", error);
        throw error;
    }
};

module.exports = { connectDB };
