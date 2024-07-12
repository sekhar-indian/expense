const Orders=require('../models/orders');//database table
const squelize=require('../models/signup');//database table
const Expense=require('../models/expense');//database table
const S3file=require('../models/s3files');
const { where } = require('sequelize');//database pakage
require('dotenv').config();//.env file
const Razorpay=require('razorpay');//Razorpay
const jwt=require('jsonwebtoken')//jsonWebToken
const bcrypt=require('bcrypt');//bcrypt
const AWS=require('aws-sdk')




//singupformdata
 const singupformdata= async (req,res,next)=>{
    const {name,phone,email,password}=req.body;  
    const bcryptPassword=await bcrypt.hash(password,10)
    try{
        const databace=squelize.create({
            name:name,
            phone:phone,
            email:email,
            password:bcryptPassword
        })
        res.status(200).send("Databace ok")
    }catch(err){
        console.log(err)
    }
}

//loginformdata
const loginformdata=async (req,res,next)=>{
    const {email,password}=req.body;
    console.log(password)
    try{
      const user= await squelize.findOne({where:{email:email}})
      if(user){
        console.log(password);
        console.log(user.password)
        const validPassword=await bcrypt.compare(password,user.password);
        console.log(validPassword)
         if(validPassword){  
            const jwtToken=jwt.sign({userid:user.id,premium:user.premium},'munisekhar',{expiresIn:'10m'});
            res.status(200)
            res.json(jwtToken);
         }else{
            res.status(401).json({status:401,masage:"password not mach"})
         }
      }else{
        res.status(404).json({status:404,masage:"Email not found"})
      }
    }catch(err){
    }
}

// expensepost
const expensepost=async(req,res,next)=>{
    const {expense,dicription,expenses}=req.body;
    try{ 
        const expensAsddingDb=Expense.create({
            expense:expense,
            dicription:dicription,
            expenses:expenses,
            userId:req.userid 
        })
        const userRecord = await squelize.findOne({ where: { id: req.userid } });
        if (userRecord) {
            const updatedTotalAmount = userRecord.totalamount + Number(dicription); 
            await userRecord.update({ totalamount: updatedTotalAmount });
        }
        res.status(200).send({masage:"ok"})
    }catch(err){
        res.status(404).send({masage:"err"})
    }
}

//getDataExpenses
const getDataExpenses=async (req,res,next)=>{
    const page=req.params.page
    const userid=req.userid;
    
   const start=(page-1)*4;
  
   try{
    const data= await Expense.findAll({where:{userId:userid},attributes:['id','expense','dicription','expenses'],offset:start ,limit:4});//get data start=4, limit=8
    res.status(200).json(data);
   }catch(err){
    res.status(404).send(err)
   }
}

//expenseDelete
const expenseDelete=async (req,res,next)=>{
    const id=req.params.id;
    const userid=req.userid;
    try{
        const expense=await Expense.findOne({where:{id:id}});
        expenseAmount=await  expense.dicription
        const user=await squelize.findOne({where:{id:userid}});
        const userAmount= await user.totalamount-expenseAmount;
        console.log(userAmount,'gfdgfdnpm')
        const update=await user.update({totalamount:userAmount})
        const deleteexpens = await Expense.destroy({where:{id:id}});
        res.send(200)
    }catch(err){
        res.send(404)
    }
    
}

//premium Razorpay
const premium= async (req,res,next)=>{
    var instance = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret:process.env.KEY_SECRET,
      });
    const amount=400*100;
   try{
    const order= await instance.orders.create ({amount,currency:"INR"})
    const orderTable = await Orders.create({
                orderId:order.id,
                status:"pending",
                userId:req.userid
            })
    res.status(201).json({ orderId: order.id, amount: order.amount, currency: order.currency })
   }catch(err){
    res.status(500).json({ message: 'Something went wrong', error: err.message });
   }
}


//premiumok
const premiumUpdate=async (req,res,next)=>{
    const userid=req.userid;
    const {orderId,paymentId}=req.body;
    try{
        const order= await Orders.findOne({where:{orderId:orderId}})
        const up= await order.update({paymentId:paymentId,status:'succuss'});
        const user=await squelize.findOne({where:{id:userid}});
        const updateUser= await user.update({premium:true});
        const jwtToken=jwt.sign({id:req.userid,premium:true},'munisekhar',{expiresIn:'1m'})
        res.status(201).json(jwtToken);
    }catch(err){
        res.status(404).json(err);
    }
} 


//leader board
const leaderboard=async (req,res,next)=>{
    try{
        let users= await squelize.findAll({
            attributes:['name','totalamount'],
            order:[['totalamount','DESC']]});
            res.status(200).json(users);
    }catch(err){
      res.status(404).send(err)
    }
}

// expence download button
const downloadButton=async(req,res,next)=>{
    const userid=req.userid;
    console.log(userid)
    try{
     const data= await Expense.findAll({where:{userId:userid},attributes:['expense','dicription','expenses']});
     const stringifiExpence=await JSON.stringify(data);
     const feeldname=`${userid}expense.txt`;
     const fildUrl= await uploadS3Bucket(stringifiExpence,feeldname);
     const aploadUrlDatabace= await S3file.create({link:fildUrl.Location,userId:userid})
     console.log(fildUrl,'sdcdsd')
    }catch(err){
        console.log(err)
     res.status(404).send(err);
    }
}


function uploadS3Bucket(data,filename){
    const BUKET_NAME='expence-app';
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const BUKET_SECRET_KEY=process.env.BUCKET_SECRET_KEY;
    let s3buket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:BUKET_SECRET_KEY,
    })

    return new Promise((resolve,reject)=>{
        var params={
            Bucket:BUKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }

    s3buket.upload(params,(err,data)=>{
            if(err){
                console.log('error getin',err)
                reject(err)
            }else{
                console.log(data);
               resolve(data)
            }
        })
    })
}


const s3filekink=async (req,res,next)=>{
     const  userid=req.userid
     try{
        data= await S3file.findAll({where:{userId:userid},attributes:['link']});
        res.status(200).send(data)
     }catch(err){
        res.status(404).send(err)
     }
}

module.exports={
    singupformdata,
    loginformdata,
    expensepost,
    getDataExpenses,
    expenseDelete,
    premium,
    premiumUpdate,
    leaderboard,
    downloadButton,
    s3filekink
}