const User = require('../models/userModel');
const Role = require('../models/roleModel');
const bcrypt = require('bcrypt');

// Thêm mới người dùng
exports.addUser = async (req, res) => {
  try {
    const { firstname, lastname, username, password, phone, email, address, idRole } = req.body;
    let userRole = idRole;

    if (!idRole) {
      const defaultRole = await Role.findOne({ roleName: 'user' });

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

    res.status(201).json({ message: 'Người dùng đã được thêm thành công!' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi thêm người dùng: ' + error.message });
  }
};
// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('idRole', 'roleName');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
  }
};

// Lấy thông tin người dùng bằng ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const role = await Role.findById(user.idRole);

    res.json({
      user: user,
      roleName: role ? role.roleName : '',
      idRole: role ? role._id : ''
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng' });
  }
};

// Cập nhật thông tin người dùng bằng ID
exports.editUser = async (req, res) => {
  try {
    const { firstname, lastname, username, password, phone, email, address, idRole } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatedUser = await User.findByIdAndUpdate(req.params.userId,
      {
        firstname,
        lastname,
        username,
        password: hashedPassword,
        phone,
        email,
        address,
        idRole,
      },
      { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng' });
  }
};

// Xóa người dùng bằng ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    res.json({ message: 'Người dùng đã bị xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa người dùng' });
  }
};

// Lấy thông tin người dùng bằng ID
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Tên người dùng không tồn tại' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }
    const role = await Role.findById(user.idRole);

    res.json({
      user: user,
      roleName: role ? role.roleName : '',
      message: 'Đăng nhập thành công'
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng' });
  }
};
