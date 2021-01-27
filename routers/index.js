const express = require('express');
const router = express.Router();
const authRouter = require('./authRouter');
const errorHandler = require('../middlewares/errorHandler');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');
const bannerRouter = require('./bannerRouter');
const cartRouter = require('./cartRouter');

router.use(authRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter);
router.use('/banners', bannerRouter);
router.use('/carts', cartRouter);

router.use(errorHandler);

module.exports = router;