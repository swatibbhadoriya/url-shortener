const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const URL = sequelize.define('URL', {
  original_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  short_url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  friendly_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  click_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  failed_click_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_access: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

User.hasMany(URL, { foreignKey: 'userId' });
URL.belongsTo(User, { foreignKey: 'userId' });

module.exports = URL;
