'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      User.hasMany(models.Product, { foreignKey: "userId" });
      User.hasMany(models.Banner, { foreignKey: "userId" });
      User.belongsToMany(models.Product, { through: 'Cart', foreignKey: 'userId' });
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Email required"
        },
        isEmail: {
          msg: "Invalid email"
        }
      },
      unique: {
        msg: "Email already used"
      }
    },
    password:  {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Password required"
        },
        len: {
          args: [6],
          msg: "Password must be at least 6 characters"
        }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user, options) => {
    user.password = hashPassword(user.password);

    if (!user.role) {
      user.role = "customer"
    }
  });

  return User;
};