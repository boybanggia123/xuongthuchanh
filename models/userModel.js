const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

const { Sequelize } = require('sequelize');

const userModel = sequelize.define('users', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password:{
        type: DataTypes.STRING,
       
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      role:{
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0 
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
     
});
userModel.beforeCreate(async(user)=>{
    user.password = await bcrypt.hash(user.password,10);
});
module.exports = userModel;