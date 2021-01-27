const express = require('express');
const cartRouter = express.Router();
const CartController = require('../controllers/cartController');
const { authentication, cartAuthorization } = require('../middlewares/auth');

cartRouter.use(authentication);

cartRouter.get('/', CartController.getCart);
cartRouter.post('/', CartController.postCart);

cartRouter.use('/:cartId', cartAuthorization);

cartRouter.put('/:cartId', CartController.putCart);
cartRouter.delete('/:cartId', CartController.deleteCart);

module.exports = cartRouter;