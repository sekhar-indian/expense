const express=require('express');
const app=express();
const cors=require('cors');
const dotenv=require('dotenv');
dotenv.config();
const bodyParser=require('body-parser');
const sequelize=require('./util/dbConection');
const Userdb=require('./models/signup');
const Expense=require('./models/expense');
const Orders=require('./models/orders');
const s3file=require('./models/s3files');

// const admin=require('./routers/admin');
const user=require('./routers/user');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(admin);
app.use(user);

Expense.belongsTo(Userdb,{constraints:true,onDelete:'CASCADE'});
Userdb.hasMany(Expense)
Orders.belongsTo(Userdb,{constraints:true,onDelete:'CASCADE'});
Userdb.hasMany(Orders)
s3file.belongsTo(Userdb,{constraints:true,onDelete:'CASCADE'});
Userdb.belongsTo(s3file)

sequelize
    .sync()
    .then(res=>{
    app.listen(3000,()=>{
        console.log('server ok')
    })
})
.catch(err=>console.log(err))

