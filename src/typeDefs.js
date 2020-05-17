import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Date

  enum State {
    started
    onHold
    accepted
    cancelled
    finished
  }

  type Subscription {
    serviceAdded(_id: String!): Service
    serviceUpdated(_id: ID!): Service
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
    vehicles(type: String): [Vehicle]
    servicesByDriver(idDriver: String!): [Service]
    servicesByUser(idUser: String!): [Service]
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
    date: Date
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
    idDriver: String!
    date: Date
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
    updateLogoutTimeDriver(_id: String): Driver
    updateLogoutTimeUser(_id: String): User
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
`;
