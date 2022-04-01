const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("fuelquote", "test", "test", {
    dialect: "sqlite",
    storage: "./dev.sqlite"
})

const connect = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {
    connect,
    sequelize
}