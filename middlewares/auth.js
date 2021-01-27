const { User, Product, Category, Banner, Cart } = require('../models/index');
const { getPayload } = require('../helpers/jwt');

async function authentication (req, res, next) {
  try {
    if (!req.headers.access_token) {
      return next({ code: 401, msg: "Login first" });
    }
  
    let payload = getPayload(req.headers.access_token);
    
    let data = await User.findOne({ where: { email: payload.email } });

    if (data) {
      req.headers.payload = payload;

      next();
    } else {
      return next({ code: 401, msg: "Login first" });
    }
  } catch (err) {
    return next({ code: 500 });
  }
}

function adminAuthorization (req, res, next) {
  if (req.headers.payload.role == 'admin') {
    return next();
  } else {
    return next({ code: 401, msg: "Only admin" });
  }
}

async function productAuthorization (req, res, next) {
  try {
    let data = await Product.findOne({ where: { id: req.params.productId } });

    if (!data) {
      return next({ code: 404, msg: `Product with id ${req.params.productId} not found` });
    }

    if (data.userId == req.headers.payload.id) {
      return next();
    } else {
      return next({ code: 401, msg: "Access denied" });
    }
  } catch (err) {
    return next({ code: 500 });
  }
}

async function categoryAuthorization (req, res, next) {
  try {
    let data = await Category.findOne({ where: { id: req.params.categoryId } });

    if (!data) {
      return next({ code: 404, msg: `Category with id ${req.params.categoryId} not found` });
    }

    next();
  } catch (err) {
    return next({ code: 500 });
  }
}

async function bannerAuthorization (req, res, next) {
  try {
    let data = await Banner.findOne({ where: { id: req.params.bannerId } });

    if (!data) {
      return next({ code: 404, msg: `Banner with id ${req.params.bannerId} not found` });
    }

    if (data.userId == req.headers.payload.id) {
      return next();
    } else {
      return next({ code: 401, msg: "Access denied" });
    }
  } catch (err) {
    return next({ code: 500 });
  }
}

async function cartAuthorization (req, res, next) {
  try {
    let data = await Cart.findOne({ where: { id: req.params.cartId } });

    if (!data) {
      return next({ code: 404, msg: `Cart with id ${req.params.bannerId} not found` });
    }

    if (data.userId == req.headers.payload.id) {
      return next();
    } else {
      return next({ code: 401, msg: "Access denied" });
    }
  } catch (err) {
    return next({ code: 500 });
  }
}

module.exports = {
  authentication,
  adminAuthorization,
  productAuthorization,
  categoryAuthorization,
  bannerAuthorization,
  cartAuthorization
};