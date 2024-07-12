const express=require('express');
const router=express.Router();
const maincon=require('../controllers/maincon');
const userAuthentication=require('../controllers/jwt');
const Password=require('../controllers/emailsend');//forgetpassword

router.get('/getExpenses/:page',userAuthentication,maincon.getDataExpenses);
router.post('/singupformdata',maincon.singupformdata);
router.post('/loginformdata',maincon.loginformdata);
router.post('/expense',userAuthentication,maincon.expensepost);
router.get('/expenseDelete/:id',userAuthentication,maincon.expenseDelete);
router.get('/premium',userAuthentication,maincon.premium);
router.post('/premiumUpdate',userAuthentication,maincon.premiumUpdate);
router.get('/leaderboard', userAuthentication,maincon.leaderboard);
router.get('/s3filekink',userAuthentication,maincon.s3filekink);

//password update
router.post('/forget/password',Password.forget);
router.get('/forgetPasswordLink/:token',Password.forgetPasswordLink);
router.post('/resetPassword',Password.resetPassword);

//expence devload button
router.get('/downloadButton', userAuthentication,maincon.downloadButton);

module.exports=router;

