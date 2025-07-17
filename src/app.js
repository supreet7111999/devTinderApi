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
const authRouter=require('./routers/authRouter');
dotenv.config();

app.use(cors({
  origin:"http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/",authRouter);











































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

