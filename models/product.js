'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Product.belongsTo(models.User, { foreignKey: "userId" });
      Product.belongsTo(models.Category, { foreignKey: "categoryId" });
      Product.belongsToMany(models.User, { through: 'Cart', foreignKey: 'productId' });
    }
  };
  Product.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Name required"
        }
      }
    },
    image_url: DataTypes.STRING,
    price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Price required"
        },
        isInt: {
          msg: "Price must be an integer"
        },
        minValue(value) {
          if (value < 0) {
            throw new Error("Price mut be more than zero");
          }
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Stock required"
        },
        isInt: {
          msg: "Stock must be an integer"
        },
        minValue(value) {
          if (value < 0) {
            throw new Error("Stock mut be more than zero");
          }
        }
      }
    },
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });

  Product.beforeCreate((product, options) => {
    if (!product.image_url) {
      product.image_url = "https://www.macmillandictionary.com/us/external/slideshow/full/Grey_full.png"
    }
  });

  return Product;
};