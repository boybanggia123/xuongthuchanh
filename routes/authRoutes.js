// authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Kiểm tra xem người dùng đã tồn tại chưa
        const role = req.body.role || 0 ;
        const existingUser = await userModel.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).send('Email đã tồn tại');
        }
        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, 10);
        // Tạo người dùng mới
        const newUser = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        });
        res.status(201).send(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Đăng ký không thành công');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Tìm kiếm người dùng theo email
        const user = await userModel.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).send('Người dùng không tồn tại');
        }
        // So sánh mật khẩu đã mã hóa với mật khẩu được cung cấp
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Mật khẩu không chính xác');
        }
        res.status(200).send('Đăng nhập thành công');
    } catch (error) {   
        console.error(error);
        res.status(500).send('Đăng nhập không thành công');
    }
});

module.exports = router;
