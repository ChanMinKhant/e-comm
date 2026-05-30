const router = require('express').Router();

const { createOrder } = require('../controllers/order.controller');
const { verifyJwt, allowTo } = require('../middlewares/auth.middleware');

router.post('/', verifyJwt, allowTo('user'), createOrder);

module.exports = router;
