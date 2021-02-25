const { buildSchema } = require("graphql");


module.exports = buildSchema(`
    type People {
        _id: ID!
        name: String!
        age: Int!
    }
    input InputData {
        name: String!
        age: Int!
    }
    type RootMutation {
        createUser(inputUser: InputData): People!
    }
    
    type TestData {
        text: String!
        views: Int!
    }
    type RootQuery {
        hello: TestData!
    }
    schema {
        mutation: RootMutation
        query: RootQuery
    }
`);


/*module.exports = buildSchema(`
    type TestData {
        text: String!
        views: Int!
    }
    type RootQuery {
        hello: TestData!
    }
    schema {
        query: RootQuery
    }
`);*/