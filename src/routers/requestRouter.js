const express =require('express');
const { authenticateUser } = require('../middleware/auth');
const User = require('../models/User');
const requestRouter=express.Router();
const Connection =require("../models/Connection");

requestRouter.post("/request/send/:status/:toUserId",authenticateUser,async (req,res)=>{
   try{
    console.log("nn");
    const {status,toUserId}=req.params;
    const from=req.user._id;
    console.log(from); 
    const allowedStatus=["ignored","interested"];
    console.log('kkkkkkk');
    if(!allowedStatus.includes(status))
    {
        throw new Error("Status is invalid");
    }
    const toUser=await User.findOne({_id:toUserId});
    console.log("toUser",toUser);
    if(!toUser)
        throw new Error("To user doesn't exist");
    if(from.equals(toUserId))
        throw new Error("You can't send request to yourself");
    const existingConnection=await Connection.findOne({
        $or:[
            {from,to:toUserId},
            {from:toUserId,to:from}
        ]
    });
    console.log("hjbhb",existingConnection);
    if(existingConnection)
        throw new Error("Request Pending");
    const newConn=new Connection({
        from:from,
        to:toUserId,
        status:status
    });
    const coonStatus=await newConn.save();
    res.status(200).json({
        message:"New Connection Request sent",
        data:coonStatus
    });
    
   }
   catch(err)
   {
      console.log(err);
      res.status(400).json({
        message:err,
        data:"Error"
      })
   }
})

requestRouter.post("/request/review/:status/:fromUserId",authenticateUser,async (req,res)=>{
    try{
       const {status,fromUserId}=req.params;
       const toUserId=req.user._id;
       const allowedStatus=["accepted","rejected"];
       if(!allowedStatus.includes(status))
         throw new Error("Invalid status");
       const existingConnection=await Connection.findOne({
        from:fromUserId,
        to:toUserId,
        status:"interested"
       });
       if(!existingConnection)
        throw new Error("Not connection request");
       existingConnection.status=status;
       const updatedConnection=await existingConnection.save();
       res.status(200).json({
        message:"Connection Updated",
        data:updatedConnection
       })
    }
    catch(err)
    {
        console.log(err);
        res.status(400).json({
            data:"Error",
            message:err
        });
    }
})


module.exports=requestRouter;