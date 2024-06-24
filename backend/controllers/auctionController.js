const User = require('../models/userModel');
const Product=require('../models/auctionProductModel')
const io=require('../socket');

const startAuction=async(req,res)=>{
    const productId=req.params.productId;
    try{
        let product=await Product.findById(productId).populate('seller',{password:0});
        if(!product)return res.status(400).json({errors:[{msg:'Product not found'}]});
        console.log(product);
        console.log(product.seller.id);
        console.log(req.user);
        if(product.seller.id!=req.user._id)
        return res.status(400).json({ errors: [{ msg: 'Unauthorized to start' }] });
        if(product.auctionEnded)
        return res.status(400).json({ errors: [{ msg: 'Auction has already ended' }] });
        if (product.auctionStarted)
        return res.status(400).json({ errors: [{ msg: 'Already started' }] });
        product.auctionStarted = true;
        await product.save();
        product.timer = parseInt(product.duration);
        product.auctionEnded = false;
        let duration = parseInt(product.duration);
        let timer = parseInt(product.timer);
        let intervalTimer = setInterval(async () => {
          timer -= 1;
          io.getIo().emit(`timerUpdate${product._id}`,{action:'updateTime',timer:timer});
          console.log(timer);
        }, 1000);
    
        // End auction after duration expires
        setTimeout(async () => {
          clearInterval(intervalTimer);
          let auctionEndProduct = await Product.findById(product._id).populate('seller', { password: 0 });
          auctionEndProduct.auctionEnded = true;
          auctionEndProduct.timer = 0;
          if (auctionEndProduct.currentBidder) {
            console.log('Product sold');
            auctionEndProduct.sold = true;
            auctionEndProduct.winner=auctionEndProduct.currentBidder;
            await auctionEndProduct.save();
            // Add product to winner's purchased products
            let winner = await User.findById(auctionEndProduct.currentBidder)
            winner.purchasedProducts.push(auctionEndProduct._id);
            console.log(winner)
            await winner.save();
            // Emit auction end event with winner details
            io.getIo().emit(`auctionEnded${auctionEndProduct._id}`, {product: auctionEndProduct});
          } else {
            console.log("the product has not sold");
            // If no bidder, mark as not sold
            await auctionEndProduct.save();
            // Emit auction end event as not sold
          }
        }, (duration + 1) * 1000);
    
      } catch (err) {
        console.log(err);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
      }

}

module.exports={startAuction};