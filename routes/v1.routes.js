const authRouter = require('./auth.route');
const productRouter = require('./product.route');
const router = require('express').Router();
const userRouter = require('./user.route');

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/users', userRouter);

module.exports = router;
