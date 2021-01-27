const { User } = require('../models/index');
const { checkPassword } = require('../helpers/bcrypt');
const { getToken } = require('../helpers/jwt');

class AuthController {
  static async register (req, res, next) {
    try {
      let data = {
        email: req.body.email,
        password: req.body.password
      };

      data = await User.create(data);

      data = {
        id: data.id,
        email: data.email,
        role: data.role
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

  static async login (req, res, next) {
    try {
      let data = await User.findOne({ where: { email: req.body.email } });
      
      if (data) {
        if (checkPassword(req.body.password, data.password)) {
          let payload = {
            id: data.id,
            email: data.email,
            role: data.role
          };

          return res.status(200).json({ access_token: getToken(payload) });
        } else {
          return next({ code: 400, msg: [{ message: "Invalid email or password" }] });
        }
      } else {
        return next({ code: 400, msg: [{ message: "Invalid email or password" }] });
      }
    } catch (err) {
      return next({ code: 500 });
    }
  }
}

module.exports = AuthController;