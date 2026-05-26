const authRouter = require('./auth.route');
const productRouter = require('./product.route');
const router = require('express').Router();
// const userRouter =

router.use('/auth', authRouter);
router.use('/products', productRouter);

module.exports = router;
