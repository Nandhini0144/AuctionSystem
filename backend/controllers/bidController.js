const Product = require('../models/auctionProductModel');
const io = require('../socket');
// const { Mutex } = require('async-mutex');


// // Object to store mutex locks for each product
// const productLocks = {};

const addBid = async (req, res, next) => {
  const { productId } = req.params;
  const { amount } = req.query;
  
  try {
    console.log(productId);
    console.log(amount);
    // Acquire the mutex lock for the specific product
    // if (!productLocks[productId]) {
    //   productLocks[productId] = new Mutex();
    // }
    // const release = await productLocks[productId].acquire();
    const product = await Product.findById(productId).populate('seller', { password: 0 });
    if(product.seller._id==req.user.id)
    {
      // release();
      return res.status(400).json({errors:[{msg:'Seller cannot bid for their product'}]})
    }
    // Find the product by ID and populate the seller field
    if (!product) {
      // release(); // Release the mutex lock if product is not found
      return res.status(404).json({ errors: [{ msg: 'Product not found' }] });
    }
    
    console.log(product.currentBid);
    
   
    // Check auction status
    if (product.sold || product.auctionEnded || !product.auctionStarted) {
      // release(); // Release the mutex lock if auction has ended or has not started
      return res.status(400).json({ errors: [{ msg: 'Auction has ended or has not started' }] });
    }
    
    // Add bid to the product
    const result = await product.findOneAndUpdate(
      {
        _id: productId,
        currentBid: { $lt: amount } // Ensure only higher bids can update the current bid
      },
      {
        $set: {
          currentBid: amount,
          currentBidder: req.user.id,
          auctionEnded: product.auctionEnded, // Maintain auction status if needed
        },
        $push: { bids: { user: req.user.id, amount: amount } } // Push the new bid to the bids array
      },
      {
        returnOriginal: false // Return the updated document after the update
      }
    );

    if (result.value) {
      console.log('Bid updated successfully:', result.value);
      io.getIo().emit(`bidPosted${productId}`, { highestBid: amount, biduserId: req.user.id });
      return res.status(200).json({ msg: 'Bid placed successfully', product: result.value });
    } else {
      return res.status(400).json({ errors: [{ msg: 'Bid was not high enough or product not found' }] });
    }
    // Save the updated product
    
    
    
    // Release the mutex lock
    // release();
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

module.exports = addBid;

const listBids = async (req, res, next) => {
  const { productId } = req.params;
  let { option } = req.query;
  option = option ? option : 'default';

  try {
    const product= await Product.findById(productId);
    if (!product) return res.status(404).json({ errors: [{ msg: 'Ad not found' }] });

    // Populate user details for each bid
    await product.populate('bids.user', { password: 0 }).execPopulate();

    const bidList = product.bids;

    // Return bids based on option
    if (option.toString() === 'highest') {
      res.status(200).json([bidList[bidList.length - 1]]);
    } else {
      res.status(200).json(bidList);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

const userHighestBid=async(req,res,next)=>{
  try{
  const {productId}=req.params;
  console.log(typeof(productId));
  const amount = await Product.aggregate([

    { $match: { _id: productId } },
    
    // Unwind the bids array to deconstruct it into separate documents
    { $unwind: '$bids' },
    
    // Match the bids by the specified user ID
    { $match: { 'bids.user': req.user._id } },
    
    // Group the bids by the user and find the maximum bid amount
    { $group: {
        _id: '$bids.user',
        highestBid: { $max: '$bids.amount' }
    }},
    
    // Optionally, project to shape the output as needed
    { $project: {
        _id: 0,
        highestBid: 1
    }}
  ]);
  
  console.log(amount);
  res.status(200).json(amount);
  }
  catch(error)
  {
    console.log(error);
  }

}

const topBids=(async(req,res,next)=>{
    const productId=req.params.productId;
    const ObjectId = require('mongoose').Types.ObjectId;
    try
    {
    const topBids=await Product.aggregate([
      {
        $match: { _id: new ObjectId(productId) }
      },
      {
        $unwind: "$bids"
      },
      {
        $sort: { "bids.amount": -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          "_id": 0,
          "user": "$bids.user",
          "amount": "$bids.amount"
        }
      }
    ])
  res.status(200).json(topBids);
  }
  catch(err)
  {
    console.log('topBidders error');
  }
})

module.exports={addBid,listBids,userHighestBid,topBids};
