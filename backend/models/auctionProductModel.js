const mongoose =require('mongoose');
const User=require('./userModel')
const BidData=require('./bidData')

const auctionProductSchema=new mongoose.Schema({
    productName:{type:String,required:true},
    description:{type:String,required:true},
    startingBid:{type:Number,required:true},
    currentBid:{type:Number},
    image:{type:String},
    image_id:{type:String},
    auctionStarted:{type:Boolean,default:false,},
    auctionEnded:{type:Boolean,default:false},
    duration:{type:Number,default:300,required:true},
    timer:{type:Number,default:300},
    seller:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    currentBidder:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    sold:{type:Boolean,default:false},
    winner:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null},
    bids: [
        {
          user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          time: {
            type: Date,
            default: Date.now,
          },
        },
      ],
  
},
{
    timestamps:true,
});
// auctionProductSchema.virtual('timeLeft').get(function(){
//     return Math.max(this.duration-Date.now(),0);
// });

// auctionProductSchema.virtual('highestBid').get(function(){
//     let highestBid = this.startingBid; // Initialize with starting bid
//     let highestBidder=null;
//     // Iterate over bids to find the highest bid amount
//     for (const bid of this.bids) {
//       if (bid.bidAmount > highestBid) {
//         highestBid = bid.bidAmount;
//         highestBidder=bid.bidder;
//       }
//     }
//     return {highestBid,highestBidder};
//   });

// auctionProductSchema.pre('save',async function(next){
//     if(this.timeLeft===0 && this.bids.length>=0)
//     {
//         const { highestBid, highestBidder } = this.highestBid; // Retrieve highest bid details

//         // Update auction details with winner and bid amount
//         this.currentBid = highestBid;
//         // Save bid data to BidData collection
//         const bidData = new BidData({
//             product: this._id,
//             bidAmount: highestBid,
//             winner: highestBidder
//         });
//         await bidData.save();
//     }
//     next();
// })
module.exports=mongoose.model('Product',auctionProductSchema)