const { default: mongoose, mongo } = require("mongoose");

const connectionSchema=mongoose.Schema(
    {
   from:{
    type:mongoose.Schema.Types.ObjectId,
    require:true
   },
   to:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
   },
   status:{
    type:String,
    enum:{
      values: ['electronics', 'clothing', 'books'],
      message: '{VALUE} is not a valid category.'
     }
    }
   },
     { timestamps: true }
)


const Connection=new mongoose.model("Connection",connectionSchema);

module.exports=Connection;