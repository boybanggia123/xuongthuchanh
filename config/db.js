const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('asmnode', 'root', '', {
  host: 'localhost',
  port:3308,
  dialect: 'mysql', // Loại CSDL bạn đang sử dụng
});
module.exports = sequelize;
