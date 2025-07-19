const express=require("express");
const profileRouter=express.Router();
const {authenticateUser}=require('../middleware/auth');
const { validateEditProfileData } = require("../utils/validation");
// const cookies=require('cookie-parser');


profileRouter.post("/profile/view",authenticateUser,async (req,res)=>{
    try{
        // console.log("gggg");
      res.status(200).json({
        message:"User send",
        data:req.user
      });
    }
    catch(err){
        console.log(err);
        res.status(401).json({
            message:"Invalid User",
            data:err
        });
    }
})

profileRouter.patch("/profile/edit",authenticateUser,async(req,res)=>{
  try{
    if(!validateEditProfileData(req))
      throw new Error("Invalid Updation");
    const loggedInUser=req.user;
    Object.keys(req?.body).forEach((key)=>{
      loggedInUser[key]=req.body[key];
    })
    const updatedUser=await loggedInUser.save();
    res.status(200).json({
      message:"User Updated",
      data:updatedUser
    });

  }
  catch(err)
  {
    console.log(err);
    res.status(400).json({
      message:err,
      data:req.body
    });
  }
})
module.exports=profileRouter;