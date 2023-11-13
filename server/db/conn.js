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

// Định nghĩa schema cho collection 'Role'
// const roleSchema = new mongoose.Schema({
//   roleName: String,
// });

// // Định nghĩa schema cho collection 'User' với một trường idRole là khóa ngoại
// const userSchema = new mongoose.Schema({
//   username: String,
//   idRole: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Role",
//   },
// });

// // Tạo model cho các collection
// const Role = mongoose.model("Role", roleSchema);
// const User = mongoose.model("User", userSchema);

// // Tạo dữ liệu mẫu cho collection 'Role'
// Role.create({ roleName: "admin" })
//   .then((role) => {
//     // Tạo dữ liệu mẫu cho collection 'User' với trường idRole tham chiếu đến role
//     return User.create({ username: "user1", idRole: role });
//   })
//   .then((user) => {
//     console.log("Dữ liệu đã được tạo:", user);
//   })
//   .catch((err) => {
//     console.error("Lỗi khi tạo dữ liệu:", err);
//   });
