const { DataTypes} = require("sequelize")
const { sequelize } = require("../connect")
const user = require("./user")

const account = sequelize.define('Accounts', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Address1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Address2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  City: {
      type: DataTypes.STRING,
      allowNull: false
  },
  states: {
      type: DataTypes.STRING,
      allowNull: false
  },
  Zipcode: {
      type: DataTypes.STRING
  }
})

user.user.hasOne(account)
account.belongsTo(user.user)

const addTable = async () => {
    await account.sync()
}
addTable()



module.exports = {
    account
}