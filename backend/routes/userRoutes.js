const express=require("express");
const router=express.Router();
const {registerUser}=require('../controllers/userController')
const {authUser}=require('../controllers/userController')
const {modifyProfile}=require('../controllers/userController');
const {purchasedProducts}=require('../controllers/userController');
const {postedProducts}=require('../controllers/userController');
const {winnerDetails}=require('../controllers/userController');
const {profileDetails}=require('../controllers/userController');
const {emailVerificationHandler}=require('../controllers/userController');
const isAuth=require('../config/IsAuth');
router.route('/').post(registerUser)
console.log("heyy there");
router.post('/login',authUser);
router.get('/profileDetails',isAuth,profileDetails);
router.put('/profile',isAuth,modifyProfile);
router.get('/purchasedProducts',isAuth,purchasedProducts);
router.get('/postedProducts',isAuth,postedProducts);
router.get('/winnerDetails/:winnerId/:productId',isAuth,winnerDetails);
router.get('/verify/:token/:name/:email',emailVerificationHandler);


module.exports=router;