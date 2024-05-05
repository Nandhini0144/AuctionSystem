const mongoose =require('mongoose');
const bidDataSchema=new mongoose.Schema({
     user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
     product:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
     amount:{type:Number,required:true},
})
const BidData=mongoose.model('BidData',bidDataSchema)
module.exports={BidData};