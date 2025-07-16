const mongoose=require("mongoose");
const validator =require("validator");

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required: true,
        minlength:3,
        maxLength:50
    },
    email:{
        type:String,
        minlength:5,
        lowercase:true,
        required:true,
        trim:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Invalid Email");
            }
        }
    },
    age:{
        type: Number,
        min: 12
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        enum:["Male","Female","Other"]
    },
    photoUrl:{
        type:String
    }
})


const User=mongoose.model("User",userSchema);

module.exports=User;