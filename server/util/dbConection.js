const Sequelize=require('sequelize');
const sequelize= new Sequelize('expense','root','1122',{
 host:'localhost',
 dialect:'mysql'
})
module.exports=sequelize;

