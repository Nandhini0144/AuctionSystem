const jwt=require('jsonwebtoken');
require('dotenv/config.js')

const generateToken=(user)=>{
  try{
  const payload={
    user:{
    _id:user._id,
    name:user.name,
  email:user.email
    }
  }
    return jwt.sign({
    payload},process.env.SECRET_KEY,{expiresIn:"30d"});
  }
  catch(error)
  {
    console.log(error);
  }
}

module.exports=generateToken;


