// routes/index.js

const express = require('express');
const router = express.Router();

//const User = require('../models/User');
const catalogModel = require('../models/catalogModel');
const productModel = require('../models/productModel');


const getNewProduct = async () => {
    try{
        const newProducts = await productModel.findAll({
            order:[['createdAt', 'DESC']], // Sắp xếp theo thời gian tạo mới nhất
            limit:4 // Giới hạng số lượng hiển thị ra trang chủ
        });
        return newProducts
    }catch (error){
        console.error('Không thể tìm thấy sản phẩm mới',error);
        throw error;
    }
};


router.get('/',async (req, res) => {
    try {
        const catalogs = await catalogModel.findAll();
        const newProducts = await getNewProduct() ;

        res.render('layout/home', {  catalogs,newProducts });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
    
});
module.exports = router;