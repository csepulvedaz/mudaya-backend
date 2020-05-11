import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import dayjs from "dayjs";
import { PubSub, withFilter } from "apollo-server";

import User from "./models/User";
import Driver from "./models/Driver";
import Vehicle from "./models/Vehicle";
import Service from "./models/Service";

const pubsub = new PubSub();

const SERVICE_ADDED = "SERVICE_ADDED";
const SERVICE_UPDATED = "SERVICE_UPDATED";

export const resolvers = {
    Date: new GraphQLScalarType({
        name: "Date",
        description: "Date custom scalar type",
        parseValue(value) {
            return dayjs(value); // value from the client
        },
        serialize(value) {
            return dayjs(value).format("YYYY-MM-DD HH:mm"); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return dayjs(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),

    Subscription: {
        serviceAdded: {
            resolve: (payload) => {
                return payload.serviceAdded;
            },
            subscribe: withFilter(
                () => pubsub.asyncIterator("SERVICE_ADDED"),
                (payload, variables) => {
                    return (
                        payload.serviceAdded.idUser === variables._id ||
                        payload.serviceAdded.idDriver === variables._id
                    );
                }
            ),
        },
        serviceUpdated: {
            resolve: (payload) => {
                return payload.serviceUpdated;
            },
            subscribe: withFilter(
                () => pubsub.asyncIterator("SERVICE_UPDATED"),
                (payload, variables) => {
                    console.log(payload._id, variables._id);

                    return payload._id === variables._id;
                }
            ),
        },
    },

    Query: {
        users: async () => {
            return await User.find();
        },
        profileUser: async (_, { _id }) => {
            return await User.findOne({ _id: _id });
        },
        profileDriver: async (_, { _id }) => {
            return await Driver.findOne({ _id: _id });
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email: email });
            const driver = await Driver.findOne({ email: email });
            let currentPassword;
            let currentId;
            let currentEmail;
            let currentClient;
            if (!user && !driver) {
                throw new Error("El correo no existe!");
            }
            if (user && driver) {
                throw new Error("Error!!");
            }
            if (user) {
                currentId = user._id;
                currentPassword = user.password;
                currentEmail = user.email;
                currentClient = "user";
            }
            if (driver) {
                currentId = driver._id;
                currentPassword = driver.password;
                currentEmail = driver.email;
                currentClient = "driver";
            }
            const isEqual = await bcrypt.compare(password, currentPassword);
            if (!isEqual) {
                throw new Error("Contraseña incorrecta!");
            }
            const token = jwt.sign(
                {
                    userId: currentId,
                    email: currentEmail,
                },
                "somesupersecretkey",
                { expiresIn: "1h" }
            );
            return {
                client: currentClient,
                userId: currentId,
                token: token,
                tokenExpiration: 1,
            };
        },
        vehicle: async (_, { _id }) => {
            return Vehicle.findOne({ _id: _id });
        },
        vehiclesByDriver: async (_, { idDriver }) => {
            return await Vehicle.find({ idDriver: idDriver });
        },
        vehicles: async (_, { type }) => {
            if (type) return await Vehicle.find({ type: type });
            return await Vehicle.find();
        },
        servicesByDriver: async (_, { idDriver }) => {
            return await Service.find({ idDriver: idDriver });
        },
        servicesByUser: async (_, { idUser }) => {
            return await Service.find({ idUser: idUser });
        },
    },

    Mutation: {
        //User
        async createUser(_, { input }) {
            const id = await User.findOne({ _id: input._id });
            const email = await User.findOne({ email: input.email });
            if (id) {
                throw new Error(
                    "Ya existe una cuenta con ese número de identificación!"
                );
            }
            if (email) {
                throw new Error("Ya existe una cuenta con ese correo!");
            }
            input.password = await bcrypt.hash(input.password, 12);
            const newUser = new User(input);
            await newUser.save();
            return newUser;
        },
        async deleteUser(_, { _id }) {
            return await User.findByIdAndDelete(_id);
        },
        async updateUser(_, { input }) {
            return await User.findByIdAndUpdate(input._id, input, {
                new: true,
            });
        },

        //Driver
        async createDriver(_, { input }) {
            const id = await Driver.findOne({ _id: input._id });
            const email = await Driver.findOne({ email: input.email });
            if (id) {
                throw new Error(
                    "Ya existe una cuenta con ese número de identificación!"
                );
            }
            if (email) {
                throw new Error("Ya existe una cuenta con ese correo!");
            }
            input.password = await bcrypt.hash(input.password, 12);
            const newDriver = new Driver(input);
            await newDriver.save();
            return newDriver;
        },
        async deleteDriver(_, { _id }) {
            return await Driver.findByIdAndDelete(_id);
        },
        async updateDriver(_, { input }) {
            return await Driver.findByIdAndUpdate(input._id, input, {
                new: true,
            });
        },

        //Vehicle
        async createVehicle(_, { input }) {
            const id = await Vehicle.findOne({ _id: input._id });
            if (id) {
                throw new Error("Ya existe un vehiculo con esa placa!");
            }
            const newVehicle = new Vehicle(input);
            return await newVehicle
                .save()
                .then(async () => await Driver.findById(input.idDriver))
                .then(async (driver) => {
                    driver.idVehicle = newVehicle;
                    await driver.save();
                    return newVehicle;
                });
        },
        async deleteVehicle(_, { _id }) {
            return await Vehicle.findByIdAndDelete(_id);
        },
        async updateVehicle(_, { _id, input }) {
            return await Vehicle.findByIdAndUpdate(_id, input, { new: true });
        },

        //Service
        async createService(_, { input }) {
            const date = await Service.findOne({ date: input.date });
            if (date) {
                throw new Error("El vehiculo esta reserveado para esa fecha!");
            }
            const newService = new Service(input);
            pubsub.publish(SERVICE_ADDED, { serviceAdded: newService });
            return await newService
                .save()
                .then(async () => await User.findById(input.idUser))
                .then(async (user) => {
                    user.idService.push(newService);
                    return await user.save();
                })
                .then(async () => await Driver.findById(input.idDriver))
                .then(async (driver) => {
                    driver.idService.push(newService);
                    await driver.save();
                    return newService;
                });
        },
        async updateService(_, { _id, input }) {
            const service = await Service.findByIdAndUpdate(_id, input, {
                new: true,
            });
            pubsub.publish(SERVICE_UPDATED, {
                serviceUpdated: service,
                _id: _id,
            });
            return service;
        },
        async acceptService(_, { _id }) {
            const input = {
                state: "accepted",
            };
            return await Service.findByIdAndUpdate(_id, input, { new: true });
        },
        async cancelService(_, { _id }) {
            const input = {
                state: "cancelled",
            };
            return await Service.findByIdAndUpdate(_id, input, { new: true });
        },
    },
};
