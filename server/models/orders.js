const Sequelize=require('sequelize');
const sequelize=require('../util/dbConection');

const orders=sequelize.define('orders',{
  
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        unique:true,
        primaryKey:true
    },
    orderId:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    paymentId:{
        type:Sequelize.STRING
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false,
    },
});

module.exports=orders;