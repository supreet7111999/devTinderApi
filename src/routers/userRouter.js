const express=require('express');
const { authenticateUser } = require('../middleware/auth');
const Connection = require('../models/Connection');
const { set } = require('mongoose');
const User = require('../models/User');
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

userRouter.get("/user/connections",authenticateUser,async (req,res)=>{
    try{
       const loggedUserId=req.user._id;
       const connectionAll=await Connection.find({
        $or:[
            {form:loggedUserId,status:"accepted"},
            {to:loggedUserId,status:"accepted"}
        ]
       });
       if(connectionAll.length==0)
          throw new Error("No connections");
       const data=connectionAll.map((row)=>{
        if(row.from._id.equals(loggedUserId))
            return row.to;
        return row.from;
       })
        
       res.status(200).json({
          message:"all connections",
          data:data
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

userRouter.get("/feed",authenticateUser,async(req,res)=>{
    try{
       const loggedInUser=req.user;
       const page=parseInt(req?.query?.page);
       const limit=parseInt(req?.query?.limit);
       const skip=(page-1)*limit;

       const allConnections=await Connection.find({
        $or:[
            {from:loggedInUser._id},
            {to:loggedInUser._id}
        ]
       }).select("from to");
 
       console.log(allConnections);


       const hiddenUsers=new Set();
       allConnections.forEach(element => {
        hiddenUsers.add(element.form);
        hiddenUsers.add(element.to)
       });
       
       const allUsers=await User.find({
        $and:[
            {_id:{$ne:loggedInUser._id}},
            {_id:{$nin:Array.from(hiddenUsers)}}
        ]
       }).select(USER_SAFE_DATA);

       console.log(allUsers);

       res.status(200).json({
        message:"All Users",
        data:allUsers
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