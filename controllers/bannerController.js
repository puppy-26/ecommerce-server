const { Banner } = require('../models/index');

class BannerController {
  static async postBanner (req, res, next) {
    try {
      let data = {
        title: req.body.title,
        image_url: req.body.image_url,
        status: req.body.status,
        userId: req.headers.payload.id
      };

      data = await Banner.create(data);

      data = {
        id: data.id,
        title: data.title,
        image_url: data.image_url,
        status: data.status,
        userId: data.userId
      };

      return res.status(201).json(data);
    } catch (err) {
      if (err.errors) {
        return next({ code: 400, msg: err.errors });
      }

      return next({ code: 500 });
    }
  }

  static async getAllBanner (req, res, next) {
    try {
      let data = await Banner.findAll({
        attributes: { exclude: ['updatedAt', 'createdAt'] } 
      });

      return res.status(200).json(data);
    } catch (err) {
      return next({ code: 500 });
    }
  }

  static async getBanner (req, res, next) {
    try {
      let data = await Banner.findAll({
        where: { userId: req.headers.payload.id },
        attributes: { exclude: ['updatedAt', 'createdAt'] } 
      });

      return res.status(200).json(data);
    } catch (err) {
      return next({ code: 500 });
    }
  }

  static async getBannerById (req, res, next) {
    try {
      let data = await Banner.findOne({
        where: { id: req.params.bannerId },
        attributes: { exclude: ['updatedAt', 'createdAt'] } 
      });

      return res.status(200).json(data);
    } catch (err) {
      return next({ code: 500 });
    }
  }

  static async putBanner (req, res, next) {
    try {
      let data = {
        title: req.body.title,
        image_url: req.body.image_url,
        status: req.body.status
      };

      await Banner.update(data, { where: { id: req.params.bannerId } });

      data = await Banner.findOne({
        where: { id: req.params.bannerId },
        attributes: { exclude: ['updatedAt', 'createdAt'] } 
      });

      return res.status(201).json(data);
    } catch (err) {
      if (err.errors) {
        return next({ code: 400, msg: err.errors });
      }

      return next({ code: 500 });
    }
  }

  static async deleteBanner (req, res, next) {
    try {
      await Banner.destroy({ where: { id: req.params.bannerId } });

      return res.status(200).json({ msg: "Success delete banner" });
    } catch (err) {
      return next({ code: 500 });
    }
  }
}

module.exports = BannerController;