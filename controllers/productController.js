const { Product, Category } = require('../models/index');

class ProductController {
  static async postProduct (req, res, next) {
    try {
      let data = null;

      if (req.body.categoryId) {
        data = await Category.findOne({ where: { id: req.body.categoryId } });

        if (!data) {
          return next({ code: 404, msg: `Category with id ${req.body.categoryId} not found` });
        }
      } else {
        req.body.categoryId = null;
      }

      data = {
        name: req.body.name,
        image_url: req.body.image_url,
        price: req.body.price,
        stock: req.body.stock,
        userId: req.headers.payload.id,
        categoryId: req.body.categoryId
      };

      data = await Product.create(data);

      data = await Product.findOne({ 
        where: { id: data.id }, 
        include: {
          model: Category,
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }, 
        attributes: { exclude: ['updatedAt', 'createdAt'] } });

      return res.status(201).json(data);
    } catch (err) {
      if (err.errors) {
        return next({ code: 400, msg: err.errors });
      }
      
      return next({ code: 500 });
    }
  }

  static async getProduct (req, res, next) {
    try {
      let data = await Product.findAll({ 
        where: { userId: req.headers.payload.id }, 
        include: {
          model: Category,
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }, 
        attributes: { exclude: ['updatedAt', 'createdAt'] } 
      });

      return res.status(200).json(data);
    } catch (err) {
      return next({ code: 500 });
    }
  }

  static async getAllProduct (req, res, next) {
    try {
      let data = await Product.findAll({ 
        include: {
          model: Category,
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }, 
        attributes: { exclude: ['updatedAt', 'createdAt'] } 
      });

      return res.status(200).json(data);
    } catch (err) {
      return next({ code: 500 });
    }
  }

  static async getProductById (req, res, next) {
    try {
      let data = await Product.findOne({
        where: { id: req.params.productId }, 
        include: {
          model: Category,
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }, 
        attributes: { exclude: ['updatedAt', 'createdAt'] } 
      });

      return res.status(200).json(data);
    } catch (err) {
      return next({ code: 500 });
    }
  }

  static async putProduct (req, res, next) {
    try {
      let data = null;

      if (req.body.categoryId) {
        data = await Category.findOne({ where: { id: req.body.categoryId } });

        if (!data) {
          return next({ code: 404, msg: `Category with id ${req.body.categoryId} not found` });
        }
      } else {
        req.body.categoryId = null;
      }

      data = {
        name: req.body.name,
        image_url: req.body.image_url,
        price: req.body.price,
        stock: req.body.stock,
        categoryId: req.body.categoryId
      };
    
      data = await Product.update(data, { where: { id: req.params.productId } });

      data = await Product.findOne({ 
        where: { id: req.params.productId }, 
        include: {
          model: Category,
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }, 
        attributes: { exclude: ['updatedAt', 'createdAt'] } });

      return res.status(200).json(data);
    } catch (err) {
      if (err.errors) {
        return next({ code: 400, msg: err.errors });
      }
      
      return next({ code: 500 });
    }
  }

  static async patchProduct (req, res, next) {
    try {
      let data = await Product.findOne({ where: { id: req.params.productId } });

      if (data.stock - req.body.stock < 0) {
        return next({ code: 400, msg: [{ message: "Lack of stock" }] });
      }

      data = {
        stock: data.stock - req.body.stock
      };
    
      data = await Product.update(data, { where: { id: req.params.productId } });

      data = await Product.findOne({ 
        where: { id: req.params.productId }, 
        include: {
          model: Category,
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }, 
        attributes: { exclude: ['updatedAt', 'createdAt'] } });

      return res.status(200).json(data);
    } catch (err) {
      if (err.errors) {
        return next({ code: 400, msg: err.errors });
      }
      
      return next({ code: 500 });
    }
  }

  static async deleteProduct (req, res, next) {
    try {
      await Product.destroy({ where: { id: req.params.productId } });

      return res.status(200).json({ msg: "Success delete product" });
    } catch (err) {
      return next({ code: 500 });
    }
  }
}

module.exports = ProductController;