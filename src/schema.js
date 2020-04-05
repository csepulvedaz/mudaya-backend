import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers";

const typeDefs = `

    type Query {
        Users: [User]
    }

    type User {
        _id: Int!
        name: String!
        surname: String!,
        phone: Int!
        email: String!
        password: String!
    }

    type Mutation {
        createUser(input: userInput): User
        deleteUser(_id: Int): User
        updateUser(_id: Int, input: userInput): User
    }

    input userInput {
        _id: Int!
        name: String!
        surname: String!,
        phone: Int!
        email: String!
        password: String!
    }

`;

export default makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});
