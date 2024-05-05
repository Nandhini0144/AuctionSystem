const mongoose=require("mongoose");
const express=require("express");
const userRouter=require('./routes/userRoutes');
const auctionRouter=require('./routes/auctionRoutes');
const productRouter=require('./routes/productRoutes');
const bidRouter=require('./routes/bidRoutes')
const app=express();
mongoose.connect("mongodb+srv://nandhinikuppuraj:Nand%400144@cluster1.lwgfisv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1");
mongoose.connection.on('connected',()=>console.log('connected'));
const {createServer}=require('http');
const multer=require('multer');
const socketio=require('./socket');
const server=createServer(app);
const io=socketio.init(server);


app.use(express.json());
app.use(express.urlencoded({extended:true}));
const cors = require('cors');

// CORS
app.use(cors());
app.use((req, res, next) => {

  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
     
  
  if (req.method === 'OPTIONS') {
    console.log(`Preflight request detected`);
    return next()

  } else {
    next();
  }
  });


app.use("/api/user",userRouter);
app.use("/api/product",productRouter);
app.use('/api/bid',bidRouter);
app.use('/api/auction', auctionRouter);


server.listen(5000);