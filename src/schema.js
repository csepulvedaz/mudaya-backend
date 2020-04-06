import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers";

const typeDefs = `

    type Query {
        Users: [User]
    }

    type User {
        _id: Int!
        name: String!
        surname: String!
        phone: Int!
        email: String!
        password: String!
    }

    type Driver {
        _id: Int!
        name: String!
        surname: String!
        phone: Int!
        email: String!
        password: String!
    }

    type Vehicle {
        _id: String!
        brand: String!
        model: String!
        year: Int!
        type: String!
        dimensions: String!
        capacity: Int!
        commentary: String!
        idDriver: Int!
    }

    type Mutation {
        createUser(input: userInput): User
        deleteUser(_id: Int): User
        updateUser(_id: Int, input: userInput): User
        createDriver(input: driverInput): Driver
        deleteDriver(_id: Int): Driver
        updateDriver(_id: Int, input: driverInput): Driver
        createVehicle(input: vehicleInput): Vehicle
        deleteVehicle(_id: String): Vehicle
        updateVehicle(_id: String, input: vehicleInput): Vehicle
    }

    input userInput {
        _id: Int!
        name: String!
        surname: String!
        phone: Int!
        email: String!
        password: String!
    }

    input driverInput {
        _id: Int!
        name: String!
        surname: String!
        phone: Int!
        email: String!
        password: String!
    }

    input vehicleInput {
        _id: String!
        brand: String!
        model: String!
        year: Int!
        type: String!
        dimensions: String!
        capacity: Int!
        commentary: String!
        idDriver: Int!
    }

`;

export default makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});
