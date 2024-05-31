const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const userModel = require('../models/userModel');

// Đăng ký người dùng mới
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await userModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Tạo người dùng mới
    const newUser = await userModel.create({ name, email, password });
    
    res.status(201).json({ message: 'userModel registered successfully' });
    
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Đăng nhập người dùng
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await userModel.findOne({ where: { email } });
   
    if (!user) {
      return res.status(400).json({ message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await  bcrypt.compare(password, user.password);
    console.log('Password after compare:', isPasswordValid);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Mật khẩu không đúng' });
    }

    // Tạo và gửi token JWT
    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};
