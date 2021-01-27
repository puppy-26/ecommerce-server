const { User, Product, Cart } = require('../models/index');

class CartController {
  static async getCart (req, res, next) {
    try {
      let data = await User.findOne({
        where: { id: req.headers.payload.id },
        attributes: { exclude: ['updatedAt', 'createdAt'] },
        include: { model: Product , attributes: { exclude: ['updatedAt', 'createdAt'] }}
      });

      return res.status(200).json(data);
    } catch (err) {
      return next({ code: 500 });
    }
  }

  static async postCart (req, res, next) {
    try {
      let exist = await Cart.findOne({ where: { userId: req.headers.payload.id, productId: req.body.productId } });
      
      let data = await Product.findOne({ where: { id: req.body.productId } });

      if (exist) {
        if ((data.stock - (exist.amount + Number(req.body.amount))) < 0) {
          return next({ code: 400, msg: [{ message: "Lack of stock" }] });
        } else {
          console.log(exist);
          data = await Cart.update({ amount: exist.amount + Number(req.body.amount) }, { where: { userId: req.headers.payload.id, productId: req.body.productId } });

          data = await Cart.findOne({ where: { userId: req.headers.payload.id, productId: req.body.productId } });

          return res.status(200).json({
            userId: data.userId,
            productId: data.productId,
            amount: data.amount
          });
        }
      }

      if (data.stock - req.body.amount < 0) {
        return next({ code: 400, msg: [{ message: "Lack of stock" }] });
      }

      data = {
        userId: req.headers.payload.id,
        productId: req.body.productId,
        amount: req.body.amount
      }

      data = await Cart.create(data);

      data = {
        id: data.id,
        userId: data.userId,
        productId: data.productId
      };

      return res.status(201).json(data);
    } catch (err) {
      if (err.errors) {
        return next({ code: 400, msg: err.errors });
      }
      console.log(err);
      return next({ code: 500 });
    }
  }

  static async putCart (req, res, next) {
    try {
      let data = await Cart.findOne({ where: { id: req.params.cartId } })

      data = await Product.findOne({ where: { id: data.productId } });

      if (data.stock - req.body.amount < 0) {
        return next({ code: 400, msg: [{ message: "Lack of stock" }] });
      }

      data = {
        amount: req.body.amount
      };

      data = await Cart.update(data, { where: { id: req.params.cartId } });

      data = await Cart.findOne({
        where: { id: req.params.cartId },
        attributes: { exclude: ['updatedId', 'createdId', 'productId'] },
        include: Product
      });

      return res.status(200).json(data);
    } catch (err) {
      return next({ code: 500 });
    }
  }

  static async deleteCart (req, res, next) {
    try {
      await Cart.destroy({ where: { id: req.params.cartId } });

      return res.status(200).json({ msg: "Cart delete success" });
    } catch (err) {
      return next({ code: 500 });
    }
  }
}

module.exports = CartController;