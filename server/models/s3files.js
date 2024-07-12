const Sequelize=require('sequelize');
const sequelize=require('../util/dbConection');

const s3file=sequelize.define('s3files',{
    link:{
        type:Sequelize.STRING,
        allowNull:false,
    },
});

module.exports=s3file; 