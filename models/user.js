const  DataTypes = require('sequelize');
const sequelize = require('../config/mysql');

const User = sequelize.define('user', {
  uid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_statusus_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'UserStatus',
      key: 'us_id'
    }
  }
});

User.prototype.generateAuthToken = function () {
  const token = jwt.sign({ uid: this.uid }, '#^NJW5SKJ$Oke&Q=QJAR{hfAt9BH^e');
  return token;
};

module.exports = User;