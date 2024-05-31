const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productModel = require('../models/productModel');
const catalogModel = require('../models/catalogModel');

// thiết lập thư mục lưu trữ hình ảnh
const storage = multer.diskStorage({
    destination:function (req, res,cb) {
        cb(null, 'public/image');
    },
    filename: function (req, file, cb) {
        cb(null,  + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage:storage});



router.get('/', async (req, res) => {
    try{
        //lấy danh sách sản phẩm
        const products = await productModel.findAll();
        res.render('layout/admin',{products});
    }catch{
        console.error('Error creating product',error);
        res.status(500).send('Lỗi ko lấy đc danh sách');
    }
    
});


//thêm mới
router.get('/new', async(req, res )=> {
    const catalog_id = await catalogModel.findAll();
    res.render('layout/addproduct',{catalog_id});
});
 router.post('/create',upload.single('img'), async (req, res) => {
    try{
        const {name,price,catalog_id,describe} = req.body;
        const img = req.file.filename;
        const newProduct = await productModel.create({name,price,img,catalog_id,describe});
        res.redirect('/admin');   
    }catch{
        console.error('Error creating product',error);
        res.status(500).send('Error creating product');
    }
 });
 
 // Xóa sản phẩm
 router.get('/delete/:productId', async (req, res) => {
    try {
        const productId = req.params.productId; 
        // Lấy thông tin sản phẩm
        const product = await productModel.findByPk(productId); 
        const imageName = product.img;
        const imagePath = './public/image/'; 

        console.log(imagePath + imageName);
  
      
  // Kiểm tra sự tồn tại của file hình
        fs.access(imagePath + imageName, fs.constants.F_OK, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error('File không tồn tại');
                    return res.status(404).send('File không tồn tại');
                }
                console.error('Lỗi khi kiểm tra tính tồn tại của file:', err);
                return res.status(500).send('Lỗi khi kiểm tra tính tồn tại của file');
            }
  
            // Nếu file tồn tại, tiến hành xóa
            fs.unlink(imagePath + imageName, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Lỗi khi xóa file hình ảnh:', unlinkErr);
                    return res.status(500).send('Lỗi khi xóa file hình ảnh');
                }
                console.log('File hình ảnh đã được xóa thành công');
                // Xóa sản phẩm trong cơ sở dữ liệu
                productModel.destroy({
                    where: {
                        id: productId
                    }
                })
                .then(() => {
                    console.log('Sản phẩm đã được xóa thành công');
                    // Chuyển hướng sau khi xóa thành công
                    res.redirect('/admin'); 
                })
                .catch((deleteError) => {
                    console.error('Lỗi khi xóa bản ghi:', deleteError);
                    res.status(500).send('Lỗi khi xóa bản ghi');
                });
            });
        });
    } catch (error) {
        console.error('Lỗi khi xóa bản ghi:', error);
        res.status(500).send('Lỗi khi xóa bản ghi');
    }
});
// sửa sản phẩm 

// Route để hiển thị form chỉnh sửa sản phẩm
router.get('/edit/:productId', async (req, res) => {
    try {
        const productId = req.params.productId; 
        // Lấy thông tin sản phẩm từ cơ sở dữ liệu
        const catalog_id = await catalogModel.findAll();
        const product = await productModel.findByPk(productId); 
        const imageName = product.img;
        const imagePath = './public/image/  ' + imageName; 

        console.log(imagePath + imageName);
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(err);
                res.status(404).send('File không tồn tại');
                return;
            }

            console.log(imagePath);
            res.render('layout/editproduct', { product, catalog_id });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
});

// Route để xử lý yêu cầu chỉnh sửa sản phẩm
// Route để xử lý yêu cầu chỉnh sửa sản phẩm
router.post('/edit/:productId', upload.single('img'), async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, price, catalog_id, describe } = req.body;
        let img = ''; 

    
        if (req.file) {
            img = req.file.filename;
            const product = await productModel.findByPk(productId);
            const imagePath = './public/image/' + product.img;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        } else {
            
            const product = await productModel.findByPk(productId);
            img = product.img;
        }

        // Cập nhật thông tin sản phẩm trong cơ sở dữ liệu
        await productModel.update({ name, price, catalog_id, describe, img }, {
            where: {
                id: productId
            }
        });

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
});





 module.exports = router;