import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers";

const typeDefs = `

    scalar Date

    enum State {
        started
        onHold
        accepted
        cancelled
        finished
      }

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

    type Service {
        date:  Date!
        origin: String!
        destination: String!
        commentaryUser: String
        commentaryDriver: String
        state: State!
        price: Int
        idUser: Int!
        idDriver: Int!
        idVehicle: String!
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
        createService(input: serviceInput): Service
        updateService(_id: ID, input: serviceDriverResponseInput): Service
        acceptService(_id: ID): Service
        cancelService(_id: ID): Service
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

    input serviceInput {
        date:  Date!
        origin: String!
        destination: String!
        commentaryUser: String
        commentaryDriver: String
        state: State!
        price: Int
        idUser: Int!
        idDriver: Int!
        idVehicle: String!
    }

    input serviceDriverResponseInput {
        client: String!
        commentary: String
        state: State!
        price: Int!
    }

`;

export default makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});
