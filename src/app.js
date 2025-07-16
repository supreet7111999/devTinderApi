const express=require("express");
const app=express();
const dotenv = require('dotenv')
const connectDB=require("./config/database")
const {validateSignUpData}=require("./utils/validation");
const User = require("./models/User");
const bcrypt=require("bcrypt");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const cors=require('cors');
dotenv.config();

app.use(cors({
  origin:"http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());

app.post("/signup",async (req,res)=>{
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

app.post("/login",async (req,res)=>{
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
        data:user
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









































connectDB()
    .then(()=>{
        console.log("DB Connected");
        app.listen(7000,()=>{
          console.log("server started")
        })
      }
      
    )
    .catch(
      (err)=>{
        console.log("Error connecting DB",err);
      }
    )

