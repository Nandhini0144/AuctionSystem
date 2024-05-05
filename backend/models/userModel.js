const mongoose =require('mongoose');
const bcrypt=require('bcryptjs');
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified:{type:Boolean,default:false},
    propic:{type:String,default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
    purchasedProducts:[{
      type:mongoose.Types.ObjectId,
      ref:'Product',
    },],
    posetdProducts:[{
      type:mongoose.Types.ObjectId,
      ref:'Product'
    },],
    bids:[
      {
        type:mongoose.Types.ObjectId,
        ref:'Product'
      }
    ]
},
{
  timestamps: true, // for logging timestamp for create and update of records
}
);
const User = mongoose.model('User', userSchema);
module.exports=User;
