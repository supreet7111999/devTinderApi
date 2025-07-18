const express=require("express");
const profileRouter=express.Router();
const {authenticateUser}=require('../middleware/auth');
// const cookies=require('cookie-parser');


profileRouter.get("/profile/view",authenticateUser,async (req,res)=>{
    try{
        console.log("gggg");
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


module.exports=profileRouter;