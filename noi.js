const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require('fs');
const mysql = require('mysql2/promise'); // Di chuyển import này lên đầu file

app.use(bodyParser.urlencoded({ extended: true }));

// Khai báo sử dụng template ejs
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));

async function ConnectDB() {
    const pool = await mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'lab3',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    return pool;
}

async function CreateHomeJsonFile() {
    try {
        const pool = await ConnectDB();
        const connection = await pool.getConnection();
        const [newRows, newFields] = await pool.query('SELECT * FROM products ORDER BY create_at DESC LIMIT 2');
        const [bestSellerRows, bestSellerFields] = await pool.query('SELECT *,  CASE  WHEN price > 400 THEN price * 0.9  ELSE price END AS discounted_price FROM products WHERE price > 400');
        const [categoryRows, categoryFields] = await pool.query('SELECT * FROM categories');
        const homeData = {
            newProducts: newRows,
            bestSellerProducts: bestSellerRows,
            popularProducts: categoryRows
        };
        const jsonData = JSON.stringify(homeData, null, 2);
        await fs.writeFile('models/home.json', jsonData, { flag: 'w' }); // Ghi đè nội dung cũ
        console.log('Home JSON file updated successfully');
        pool.end(); // Đóng pool khi không cần nữa
    } catch (error) {
        console.log('Error creating Home JSON FILE: ', error);
    }
}

CreateHomeJsonFile()
    .then(() => console.log('Json file created successfully'))
    .catch(error => console.error('Error creating file:', error));

// Route để hiển thị tất cả sản phẩm
app.get("/allproduct", (req, res) => {
    // Cần khai báo và gán giá trị cho listproducts trước khi sử dụng
    const listproducts = []; // Ví dụ: Danh sách sản phẩm trống
    res.render('allproduct', { products: listproducts });
});

// Route trang chủ
app.get('/', (req, res) => {
    fs.readFile('models/home.json', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const jsonData = JSON.parse(data);
        res.render('home', { popularProducts: jsonData.popularProducts });
    });
});

app.listen(port, () => {
    console.log(`Ứng dụng đang chạy với cổng: ${port}`);
});
