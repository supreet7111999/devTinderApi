const express=require('express');
const authRouter=express.Router();
const dotenv = require('dotenv')
const {validateSignUpData}=require('../utils/validation');
const User = require("../models/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
dotenv.config();

authRouter.post("/signup",async (req,res)=>{
  try{
    // console.log("hbh");
    console.log(req.body);
    validateSignUpData(req);
    const {name,email,password,gender}=req.body;
    const passwordHash=await bcrypt.hash(password,10);
    const user=new User({
        name,
        email,
        gender,
        password:passwordHash
    });
    console.log(user);
    const savedUser = await user.save();
    console.log(savedUser);
    res.status(201).json({
        message: "User created successfully",
        data: {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email
        }
    });
    // res.send();
  }
  catch(err){
    console.log(err)
    res.status(400).json({
        data:req.body,
        message:err
    })
    
  }
})

authRouter.post("/login",async (req,res)=>{
    // res.send("Done")
    try{
      const {email,password}=req.body;
      const user=await User.findOne({email:email});
      if(!user)
        throw new Error("EmailId or Password is Invalid");
      const isPasswordValid=await bcrypt.compare(password,user.password);
      if(!isPasswordValid)
        throw new Error("EmailId or Password is Invalid");
      const key=process.env.PRIVATE_KEY;
      const token=await jwt.sign({_id:user._id},key);
      res.cookie("token",token,{maxAge:60*60*1000});
      res.status(200).json({
        message:"Logged In",
        data:{
          user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          gender:user.gender,
          photoUrl:user.photoUrl,
          age:user.age
        }}
      })

    }
    catch(err)
    {
      console.log(err);
      res.status(400).json({
        message:err,
        data:req.body,
      })
    }
})

authRouter.post("/logout",async (req,res)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now())
    })
    res.send();
})


module.exports=authRouter;