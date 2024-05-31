// routes/allProductsRouter.js
const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');
const catalogModel = require('../models/catalogModel');

router.get('/:productId', async (req, res) => {
        try{
            const catalog = await catalogModel.findAll();
            const {productId} = req.params;
            const productDetail = await productModel.findByPk(productId);
            if(!productDetail){
                return res.status(404).send('Không tìm thấy sản phẩm');
            }
            res.render('layout/detail', {productDetail,catalog});
        }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
});
module.exports = router;
