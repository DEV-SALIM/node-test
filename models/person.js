const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const person = sequelize.define("person", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.SMALLINT,
        allowNull: false
    }
});

module.exports = person;

/*const persons = [];

module.exports = class person {
    constructor(name, age){
        this.name = name;
        this.age = age
    }
    save(){
        return persons.push(this);
    }
    static fetchAll(){
        return persons;
    }
    static delete(index){
        delete persons[index];
    }
};*/