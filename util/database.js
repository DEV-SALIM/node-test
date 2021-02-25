/*const { Client, Pool } = require("pg");

const pool = new Pool({
    host: 'localhost',
    database: 'nodejs',
    user: 'postgres',
    password: 'root',
    port: 5432
});

module.exports = pool;*/

const Sequelize = require("sequelize");

const sequelize = new Sequelize("nodejs", "postgres", "root", {dialect: "postgres", "host": "localhost"});

module.exports = sequelize;