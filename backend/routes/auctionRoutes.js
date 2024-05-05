const express = require('express');
const router=express.Router();
const auctionController = require('../controllers/auctionController');
const isAuth=require('../config/IsAuth');

router.post('/startAuction/:productId',isAuth,auctionController.startAuction);

module.exports=router;
