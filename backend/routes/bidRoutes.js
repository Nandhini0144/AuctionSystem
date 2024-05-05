const express = require('express');
const router=express.Router();
const bidController=require('../controllers/bidController');
const isAuth=require('../config/IsAuth');

router.post('/addBid/:productId',isAuth,bidController.addBid);
router.get('/userHighestBid/:productId',isAuth,bidController.userHighestBid)
router.get('/topBids/:productId',isAuth,bidController.topBids);
module.exports=router;
