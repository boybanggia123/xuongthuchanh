const sequelize = require('../config/db');

const { Sequelize } = require('sequelize');

const productModel = sequelize.define('products',{
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: true,
    
  },
  img: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  catalog_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'catalogs',
      key: 'id',
    },
  },
  describe: {
    type: Sequelize.STRING,
      allowNull: true
    },

});
// Xóa sản phẩm theo ID
const deleteById = async (id) => {
  try {
      await Product.destroy({
          where: {
              id: id
          }
      });
  } catch (error) {
      throw error;
  }
};
module.exports = productModel;