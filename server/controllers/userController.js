const User = require("../models/userModel");
const Role = require("../models/roleModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Thêm mới người dùng
exports.addUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      username,
      password,
      phone,
      email,
      address,
      idRole,
    } = req.body;
    const existingUser = await User.findOne({ username });
    const existingUser1 = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ message: "Người dùng đã tồn tại!" });
    }
    if (existingUser1) {
      return res.status(401).json({ message: "Email đã tồn tại!" });
    }
    let userRole = idRole;

    if (!idRole) {
      const defaultRole = await Role.findOne({ roleName: "user" });

      if (defaultRole) {
        userRole = defaultRole._id;
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstname,
      lastname,
      username,
      password: hashedPassword,
      phone,
      email,
      address,
      idRole: userRole,
    });

    await newUser.save();

    res.status(201).json({ message: "Người dùng đã được thêm thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Lỗi khi thêm người dùng: " + error.message });
  }
};
// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("idRole", "roleName");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng" });
  }
};

// Lấy thông tin người dùng bằng ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const role = await Role.findById(user.idRole);

    res.json({
      user: user,
      roleName: role ? role.roleName : "",
      idRole: role ? role._id : "",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
  }
};

// Cập nhật thông tin người dùng bằng ID
exports.editUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      username,
      password,
      phone,
      email,
      address,
      idRole,
      flgEmail,
      flgUserName,
    } = req.body;
    if (flgEmail) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(401).json({ message: "Email đã tồn tại!" });
      }
    }

    if (flgUserName) {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(401).json({ message: "Người dùng đã tồn tại!" });
      }
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Kiểm tra xem idRole đã tồn tại và mật khẩu có thay đổi hay không
    const updateFields = {
      firstname,
      lastname,
      username,
      phone,
      email,
      address,
    };

    // Nếu mật khẩu có thay đổi, thêm trường password vào danh sách cần cập nhật
    if (password) {
      updateFields.password = hashedPassword;
    }

    // Nếu idRole tồn tại, thêm trường idRole vào danh sách cần cập nhật
    if (idRole !== undefined) {
      updateFields.idRole = idRole;
    }

    // Thực hiện cập nhật thông tin người dùng
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật thông tin người dùng" + error });
  }
};

// Xóa người dùng bằng ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    // const orders = await Order.find({ user_id: userId });
    // await Promise.all(
    //   orders.map(async (order) => {
    //     await OrderItem.deleteMany({ order_id: order._id });
    //     await Order.findByIdAndDelete(order._id);
    //   })
    // );
    res.json({ message: "Người dùng đã bị xóa" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa người dùng" });
  }
};

// Lấy thông tin người dùng bằng ID
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Tên người dùng không tồn tại" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }
    const role = await Role.findById(user.idRole);

    res.json({
      user: user,
      roleName: role ? role.roleName : "",
      message: "Đăng nhập thành công",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
  }
};

// verify the Username exist
exports.checkUserName = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      res.status(200).send({ email: user.email });
    } else {
      res.status(404).send({ message: "Tên người dùng không tồn tại" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Lỗi trong quá trình kiểm tra tên người dùng" });
  }
};

exports.updatePassword = async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while updating the password" });
  }
};

exports.sendEmail = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: "pttnguyen528@gmail.com",
      pass: "mljbsomaufoasgpc",
    },
  });
  const { recipient_email, OTP } = req.body;
  const mailOptions = {
    from: "pttnguyen528@gmail.com",
    to: recipient_email,
    subject: "PASSWORD RESET",
    html: `<html>
             <body>
               <h2>Password Recovery</h2>
               <p>Use this OTP to reset your password. OTP is valid for 1 minute</p>
               <h3>${OTP}</h3>
             </body>
           </html>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send({ message: "Lỗi trong quá trình gửi email" });
    } else {
      res.status(200).send({ message: "Email được gửi thành công" });
    }
  });
};
