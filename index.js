// app.js

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const path = require('path'); 
// mới thêm 
const indexRouter = require('./routes/index');
const detailRouter = require('./routes/detailRouter');
const productRouter = require('./routes/productRouter');
const  formproductRouter = require('./routes/formproductRouter');
const authRoutes = require('./routes/authRoutes');
const loginRoutes = require('./routes/loginRouter');
const reginsterRoutes = require('./routes/reginsterRouter');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


// Kết nối CSDL
sequelize
  .authenticate()
  .then(() => {
    console.log('Kết nối CSDL thành công.');
  })
  .catch(err => {
    console.error('Không thể kết nối CSDL:', err);
  });


app.use('/reginster',reginsterRoutes);
app.use('/login',loginRoutes);
app.use('/api/auth', authRoutes);

app.use('/admin',formproductRouter);
app.use('/', indexRouter);
app.use('/allproduct',productRouter);
app.use('/detail', detailRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  console.log(`http://localhost:${PORT}/admin`);
  // console.log(`http://localhost:${PORT}/users`);
});

