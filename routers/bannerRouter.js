const express = require('express');
const bannerRouter = express.Router();
const { authentication, adminAuthorization, bannerAuthorization } = require('../middlewares/auth');
const BannerController = require('../controllers/bannerController');

bannerRouter.get('/all', BannerController.getAllBanner);

bannerRouter.use(authentication);
bannerRouter.use(adminAuthorization);

bannerRouter.post('/', BannerController.postBanner);
bannerRouter.get('/', BannerController.getBanner);

bannerRouter.use('/:bannerId', bannerAuthorization);

bannerRouter.get('/:bannerId', BannerController.getBannerById);
bannerRouter.put('/:bannerId', BannerController.putBanner);
bannerRouter.delete('/:bannerId', BannerController.deleteBanner);

module.exports = bannerRouter;