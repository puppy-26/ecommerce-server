const express = require('express');
const productRouter = express.Router();
const { authentication, adminAuthorization, productAuthorization } = require('../middlewares/auth');
const ProductController = require('../controllers/productController');

productRouter.get('/all', ProductController.getAllProduct);

productRouter.use(authentication);
productRouter.use(adminAuthorization);

productRouter.post('/', ProductController.postProduct);
productRouter.get('/', ProductController.getProduct);

productRouter.use('/:productId', productAuthorization);

productRouter.get('/:productId', ProductController.getProductById);
productRouter.put('/:productId', ProductController.putProduct);
productRouter.delete('/:productId', ProductController.deleteProduct);

module.exports = productRouter;