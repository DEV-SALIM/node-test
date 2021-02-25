const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const city = sequelize.define("city",{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = city;