const express=require('express');
const router=express.Router();
const {body}=require('express-validator');
const productController=require('../controllers/productController');
const multer = require('multer');
const isAuth=require('../config/IsAuth');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null,Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/',
isAuth,
upload.single('image'),
productController.addProduct
);

router.get('/allProducts',productController.retriveProducts);

router.get('/displayProduct/:id',isAuth,productController.findProduct);

router.put('/:id',isAuth,productController.updateProduct);

router.delete('/:id',isAuth,productController.deleteProduct);

router.get('/retriveByUserId',isAuth,productController.retrieveProductsByUserId);
module.exports=router;