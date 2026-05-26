const router = require('express').Router();
const {
  createProduct,
  getAllProducts,
} = require('../controllers/product.controller');
const { verifyJwt, allowTo } = require('../middlewares/auth.middleware');
// const Product = require('../models/product.model');

router.post('/', verifyJwt, allowTo('user'), createProduct);
router.get('/', verifyJwt, allowTo('user'), getAllProducts);

module.exports = router;
