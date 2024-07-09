const Sequelize=require('sequelize');
const sequelize=require('../util/dbConection');

const signupdata=sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        unique:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    phone:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    premium:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    totalamount:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }


});

module.exports=signupdata;