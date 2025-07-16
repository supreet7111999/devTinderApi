const jwt=require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser=async (req,res,next)=>{
  try{
     const {token}=req.cookies;
     const decodedData=jwt.verify(token,process.env.PRIVATE_KEY);
     console.log("decodeddata",decodedData);
     const {_id}=decodedData;
     const user=User.findOne(_id);
     if(!user)
        throw new Error("Invalid Credentials");
     req.user=user;
     next();
  }
  catch(err){
    res.status(400).json({
        data:req.body,
        message:"Invalid Credentials"
    })
  }
}

module.exports={
    authenticateUser,
}