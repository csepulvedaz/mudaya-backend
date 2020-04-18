import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers";

const typeDefs = `

    type Query {
        users: [User]
        profileUser(_id:Int!): User
        profileDriver(_id:Int!): Driver
        login(email: String!, password: String!): AuthData
        vehicles(type: String): [Vehicle]
    }

    type AuthData {
        client: String!
        userId: Int!
        token: String!
        tokenExpiration: Int!
    }

    type User {
        _id: Int!
        name: String!
        surname: String!
        phone: String!
        email: String!
        password: String!
    }

    type Driver {
        _id: Int!
        name: String!
        surname: String!
        phone: String!
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
        capacity: String!
        commentary: String!
        idDriver: Int!
    }

    type Mutation {
        createUser(input: userInput): User
        deleteUser(_id: Int): User
        updateUser(input: updateUserInput): User
        createDriver(input: driverInput): Driver
        deleteDriver(_id: Int): Driver
        updateDriver( input: updateDriverInput): Driver
        createVehicle(input: vehicleInput): Vehicle
        deleteVehicle(_id: String): Vehicle
        updateVehicle(_id: String, input: vehicleInput): Vehicle
    }

    input updateUserInput{
        _id: Int!
        name: String!
        surname: String!
        phone: String!
    }
    input updateDriverInput{
        _id: Int!
        name: String!
        surname: String!
        phone: String!
    }

    input userInput {
        _id: Int!
        name: String!
        surname: String!
        phone: String!
        email: String!
        password: String!
    }

    input driverInput {
        _id: Int!
        name: String!
        surname: String!
        phone: String!
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
        capacity: String!
        commentary: String!
        idDriver: Int!
    }

`;

export default makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});
