const express=require('express');
const { authenticateUser } = require('../middleware/auth');
const Connection = require('../models/Connection');
const userRouter=express.Router();

const USER_SAFE_DATA="name gender email age photoUrl"

userRouter.get("/user/requests/received",authenticateUser,async (req , res)=>{
    try{
       const user=req.user;
       const connectionAll=await Connection.find({
        to:user._id,
        status:"interested"
       }).populate("from",USER_SAFE_DATA);
       console.log(connectionAll);
       if(connectionAll.length==0)
        throw new Error("No Pending Requests!!!");
       res.status(200).json({
        data:connectionAll,
        message:"All requests"
       })
    }
    catch(err)
    {
        console.log(err);
        res.status(400).json({
            data:"Error",
            message:err.message
        });
    }
})



module.exports=userRouter;