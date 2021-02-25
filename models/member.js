const Sequelize = require("sequelize");
const db = require("../util/database");

const member = db.define("member", {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    login:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = member;