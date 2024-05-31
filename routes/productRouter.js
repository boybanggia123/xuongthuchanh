// routes/allProductsRouter.js
const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');
const catalogModel = require('../models/catalogModel');

router.get('/:catalog_id?', async (req, res) => {
    try {
        const catalog = await catalogModel.findAll();
        // Lấy catalog_id từ tham số đường dẫn
        const { catalog_id } = req.params;
        if(!catalog_id) {
            const products = await productModel.findAll();
            res.render('layout/allproduct', { products, catalog});
        }else{
            const products = await productModel.findAll({ where: { catalog_id } });
            res.render('layout/allproduct', { products, catalog});
        }
        // Lấy danh sách sản phẩm từ CSDL dựa trên catalog_id
        
        
        // Render template EJS và truyền danh sách sản phẩm vào
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
});


module.exports = router;
