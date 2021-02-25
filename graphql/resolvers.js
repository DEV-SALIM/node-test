const Person = require("../models/person");

module.exports = {
    hello(){
        return {
            text: "HELLO MAN, THAT A GOOD TEST FOR GRAPHQL!",
            views: 1234
        }
    },

    createUser: async ({ inputUser }, req) => {
        const existPeople = await Person.findOne({where: { name: inputUser.name }});

        if(existPeople){
            throw new Error("User already exists!");
        }

        const person = new Person({
            name: inputUser.name,
            age: inputUser.age
        });

        const createdUser = await person.save();

        return {...createdUser._doc, _id: createdUser.id, name: createdUser.name, age: createdUser.age};
    }
};