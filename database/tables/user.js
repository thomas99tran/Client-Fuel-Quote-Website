const { DataTypes} = require("sequelize")
const { sequelize } = require("../connect")
const { hash, compare } = require("bcryptjs")

const user = sequelize.define('Users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const addTable = async () => {
    await user.sync()
}
addTable()

const hashPassword = async (password) => {
    return await hash(password, 12)
}

const matchesPassword = async (current_password, entered_password) => {
    return await compare(entered_password, current_password)
}

module.exports = {
    user,
    matchesPassword,
    hashPassword
}