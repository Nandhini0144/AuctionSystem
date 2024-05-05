const{validationResult}=require('express-validator');
const asyncHandler=require("express-async-handler");
const User = require('../models/userModel');
const io=require('../socket');
const Product=require('../models/auctionProductModel')
const path = require('path');
const cloudinary=require('cloudinary');
const fs=require('fs')
cloudinary.config({
  cloud_name:'dabgtv3vx',
  api_key:"939792233256476",
  api_secret:"6sW6msp3x6AfS93AKj5C1M1IIWU"
});
const addProduct=async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  // Check if image is provided
  if (!req.file) {
    return res.status(400).json({ errors: [{ msg: 'Image is required' }] });
  } 
  let{ productName, startingBid, duration, description} = req.body;
  if (duration === null || duration > 5*24*60*60) duration =5*24*60*60;
  const timer = duration; 
  try{
  const result=await cloudinary.v2.uploader.upload(req.file.path);
    let product=new Product({
    productName,
    description,
    startingBid,
    currentBid: startingBid,
    duration,
     timer,
    image:result.url, 
    image_id:result.public_id,
    seller:req.user._id,
  });
   product=await product.save();

   const user=await User.findById(product.seller);
   if (!user.postedProducts) {
    user.postedProducts = []; 
  }

   user.postedProducts.push(product._id);
   await user.save();
   fs.unlink(req.file.path ,(err) => {
    if (err) {
      console.error('Error unlinking file:', err);
      return}});
   io.getIo().emit('addProduct',{action:'add',product:product});
   
   res.status(200).json({product});
}catch(error){
    console.log(error);
    res.status(500).json({errors:[{msg:'Server error'}]});
}
}

const retriveProducts=async(req,res)=>{
    let productList=[];
    try{
      productList=await Product.find().sort({createdAt:-1});
      res.status(200).json(productList);
    }
    catch(err)
    {
      console.log('retriveproduct err');
      res.status(500).json({errors:[{msg:'Retrival err'}]})
    }
}
const retrieveProductsByUserId = async (req, res) => {
  try {
      const seller = req.user._id; 

      const productList = await Product.find({ seller }).sort({ createdAt: -1 });
      console.log(productList);
      res.status(200).json(productList);
  } catch (err) {
      console.error('retrieveProductsByUserId error:', err);
      res.status(500).json({ errors: [{ msg: 'Retrieval error' }] });
  }
};
const findProduct= async (req, res) => {
  const productId = req.params.id; 
  try {
    const product= await Product.findById(productId).populate('bids').populate('seller');
    if (!product) return res.status(404).json({ errors: [{ msg: 'product not found' }] });
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
}

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    let product = await Product.findById(productId);
    if (!product) return res.status(404).json({ errors: [{ msg: 'Product not found' }] });
    if (product.seller != req.user.id)
      return res.status(401).json({ errors: [{ msg: 'Unauthorized to update this product' }] });
    
    // Update other fields if necessary
    product.productName = req.body.productName || product.productName;
    product.description = req.body.description || product.description;
    product.startingBid = req.body.startingBid || product.startingBid;
    product.duration = req.body.duration || product.duration;

    // Save the updated product
    await product.save();

    // Retrieve the updated product
    const updatedProduct = await Product.findById(productId);

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};


const deleteProduct= async (req, res) => {
  const productId = req.params.id;
  console.log(productId);
  try {
    let product = await Product.findById(productId);
    console.log(product);
    await cloudinary.uploader.destroy(product.image_id);
    const del=await Product.deleteOne(product);
    console.log(del);
    res.status(200).json({ msg: 'Deleted' });
  } catch (err) {
    console.log('unable to delete product');
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};


module.exports={addProduct,retriveProducts,findProduct,updateProduct,deleteProduct,retrieveProductsByUserId}