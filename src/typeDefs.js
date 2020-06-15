import {gql} from "apollo-server";

export const typeDefs = gql`
    scalar Date

    enum State {
        started
        onHold
        accepted
        cancelled
        finished
        rated
    }

    type Subscription {
        serviceAdded(_id: String!): Service
        serviceUpdated(_id: String!): Service
    }

    type Query {
        users: [User]
        services: [Service]
        servicesByDateUpdated(_id: String!, client: String): [Service]
        servicesByDateCreated(_id: String!): [Service]
        profileUser(_id: String!): User
        profileDriver(_id: String!): Driver
        login(email: String!, password: String!): AuthData
        vehicle(_id: String!): Vehicle
        vehiclesByDriver(idDriver: String!): [Vehicle]
        vehicles(type: String, department: String, city: String): [Vehicle]
        servicesByDriver(idDriver: String!): [Service]
        servicesByUser(idUser: String!): [Service]
        ratingsByDriver(idDriver: String!): [Rating]
        ratingsByVehicle(idVehicle: String!): [Rating]
        ratingByService(idService: String!): Rating
        rankByVehicle(idVehicle: String!): Rank
    }

    type AuthData {
        client: String!
        userId: String!
        token: String!
        tokenExpiration: Int!
    }

    type User {
        _id: String!
        name: String!
        surname: String!
        phone: String!
        email: String!
        password: String!
    }

    type Driver {
        _id: String!
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
        department: String
        city: String
        commentary: String!
        idDriver: String!
    }

    type Service {
        _id: ID
        date: Date!
        origin: String!
        destination: String!
        commentaryUser: String
        commentaryDriver: String
        state: State!
        price: String
        idUser: String!
        idDriver: String!
        idVehicle: String!
    }
    
    type Rating {
        _id: ID
        value: Float!
        commentary: String
        idDriver: String!
        idVehicle: String!
        idService: ID!
    }
    
    type Rank {
        _id: ID
        value: Float!
        totalRatings: Int!
        idVehicle: String!
    }

    type Mutation {
        createUser(input: userInput): User
        deleteUser(_id: String): User
        updateUser(input: updateUserInput): User
        createDriver(input: driverInput): Driver
        deleteDriver(_id: String): Driver
        updateDriver(input: updateDriverInput): Driver
        createVehicle(input: vehicleInput): Vehicle
        deleteVehicle(_id: String): Vehicle
        updateVehicle(_id: String, input: vehicleInput): Vehicle
        createService(input: serviceInput): Service
        updateService(_id: ID, input: serviceDriverResponseInput): Service
        acceptService(_id: ID): Service
        cancelService(_id: ID): Service
        finishService(_id: ID): Service
        rateService(_id: ID): Service
        updateLogoutTimeDriver(_id: String): Driver
        updateLogoutTimeUser(_id: String): User
        createRating(input: ratingInput): Rating
        createComplainUser(_id: String, complain: String): User
        createComplainDriver(_id: String, complain: String): Driver
    }

    input updateUserInput {
        _id: String!
        name: String!
        surname: String!
        phone: String!
    }
    input updateDriverInput {
        _id: String!
        name: String!
        surname: String!
        phone: String!
    }

    input userInput {
        _id: String!
        name: String!
        surname: String!
        phone: String!
        email: String!
        password: String!
    }

    input driverInput {
        _id: String!
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
        department: String
        city: String
        commentary: String!
        idDriver: String!
    }

    input serviceInput {
        date: Date!
        origin: String!
        destination: String!
        commentaryUser: String
        state: State!
        idUser: String!
        idDriver: String!
        idVehicle: String!
    }

    input serviceDriverResponseInput {
        commentaryDriver: String
        state: State!
        price: String!
    }
    
    input ratingInput {
        value: Float!
        commentary: String
        idDriver: String!
        idVehicle: String!
        idService: ID!
    }
`;
