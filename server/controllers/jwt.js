const jwt=require('jsonwebtoken');
const userathontecation=(req,res,next)=>{
    const token=req.headers.authorization;
    if (!token){
       console.log("token not error"); 
    }
    jwtToken=token.split(' ')[1];
    jwt.verify(jwtToken,'munisekhar',(err,decoded)=>{
        if(err){
            res.status(401)
            res.send('not alowded')
        }
        req.userid=decoded.userid;
        next()
    })
}
module.exports=userathontecation;