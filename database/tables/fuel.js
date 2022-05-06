const { DataTypes} = require("sequelize")
const { sequelize } = require("../connect")
const user = require("./user")

const fuel = sequelize.define('Fuels', {
  gallons: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false
  },
  deliveryDate: {
      type: DataTypes.DATE,
      allowNull: false
  },
  price: {
      type: DataTypes.DECIMAL,
      allowNull: false
  },
  total: {
      type: DataTypes.DECIMAL,
      allowNull: false
  }
})

user.user.hasMany(fuel)
fuel.belongsTo(user.user)

const addTable = async () => {
    await fuel.sync()
}

addTable()



module.exports = {
    fuel
}