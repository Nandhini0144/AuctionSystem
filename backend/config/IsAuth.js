const jwt=require('jsonwebtoken');
const User=require('../models/userModel')
const isAuth = async(req, res, next) => {
    const {authorization} = req.headers;
    let token='';
    try{
    token= authorization.split(" ")[1];
    if (authorization) {
      // console.log(token);
      const decode=jwt.verify(token,process.env.SECRET_KEY);
      // console.log("Hey I am a decoded infor:"+decode);
      req.user=await User.findById(decode.payload.user._id);
      // console.log(req.user)
      next();
        }
      }
        catch(error){
          console.log(error.message)
            res.status(401).send({ message: 'Invalid Token' });
     }
     
  }
  module.exports=isAuth;










//   console.log(token);
//   jwt.verify(token,'nandhinikuppuraj', (err, decode) => {
//     if (err) {
//       res.status(401).send({ message: 'Invalid Token' });
//     } else {
//       req.user = decode;
//       next();
//     }
//   });
// } else {
//   res.status(401).send({ message: 'No Token' });
// }