const validator=require("validator");

const validateSignUpData =(req)=>{
   const {name,email,password}=req.body;
   if(!name)
    throw new Error("Name is not valid");
   else if(!validator.isEmail(email))
    throw new Error("Invalid Email");
//    else if(!validator.isStrongPassword(password))
//     throw new Error("Weak Password");
}

const validateEditProfileData=(req)=>{
    const allowedField=["name","age","gender","photoUrl"];
    const isValid=Object.keys(req.body).every((key)=>{
    return allowedField.includes(key)
    });
    return isValid;
}

module.exports ={
    validateSignUpData,
    validateEditProfileData
}