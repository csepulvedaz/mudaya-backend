import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import { PubSub, withFilter } from "apollo-server";
import moment from "moment-timezone";
import { authenticate } from "ldap-authentication";
import ldap from "ldapjs";
import dotenv from "dotenv";

import User from "./models/User";
import Driver from "./models/Driver";
import Vehicle from "./models/Vehicle";
import Service from "./models/Service";
import Rating from "./models/Rating";
import Rank from "./models/Rank";

dotenv.config();
const pubsub = new PubSub();

const SERVICE_ADDED = "SERVICE_ADDED";
const SERVICE_UPDATED = "SERVICE_UPDATED";
const BASE = process.env.BASE;
const URL = process.env.URL;

const ldapAuth = async (email) => {
    const exist = await authenticate({
        ldapOpts: { url: URL },
        userDn: `cn=admin,${BASE}`,
        userPassword: "admin",
        userSearchBase: BASE,
        usernameAttribute: "cn",
        username: email,
    })
        .then((res) => {
            return true;
        })
        .catch((e) => {
            return false;
        });
    return exist;
};

const ldapCreate = (name, surname, email, password) => {
    var client = ldap.createClient({
        url: URL,
    });

    var newDN = `cn=${email},ou=sa,${BASE}`;
    var newUser = {
        givenName: name,
        cn: email,
        sn: surname,
        uid: email.substring(0, email.lastIndexOf("@")),
        mail: email,
        objectClass: "inetOrgPerson",
        userPassword: password,
    };

    client.bind(`cn=admin,${BASE}`, "admin", function (err) {
        if (err) {
            console.log(err);
        } else {
            client.add(newDN, newUser, (message) => {
                console.log(message?.lde_message);
            });
        }
    });
};

export const resolvers = {
    Date: new GraphQLScalarType({
        name: "Date",
        description: "Date custom scalar type",
        parseValue(value) {
            return moment(value);
        },
        serialize(value) {
            return moment(value).tz("America/Bogota").format("LLL");
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return moment(ast.value);
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
                    return (
                        payload.serviceUpdated.idUser === variables._id ||
                        payload.serviceUpdated.idDriver === variables._id
                    );
                }
            ),
        },
    },

    Query: {
        users: async () => {
            return await User.find();
        },

        services: async () => {
            return await Service.find();
        },
        servicesByDateUpdated: async (_, { _id, client }) => {
            let servicesReturn = [];
            let dateLogOut;
            let services = [];
            if (client === "user") {
                const user = await User.findOne({ _id: _id });
                services = await Service.find({ idUser: _id });
                dateLogOut = user.lastLogout;
            }
            if (client === "driver") {
                const driver = await Driver.findOne({ _id: _id });
                services = await Service.find({ idDriver: _id });
                dateLogOut = driver.lastLogout;
            }
            services.map((current, i) => {
                if (
                    current.updatedAt >= dateLogOut &&
                    current.state !== "started"
                ) {
                    servicesReturn.push(current);
                }
            });
            return servicesReturn;
        },
        servicesByDateCreated: async (_, { _id }) => {
            let servicesReturn = [];
            let dateLogOut;
            let services = [];
            const driver = await Driver.findOne({ _id: _id });
            services = await Service.find({ idDriver: _id });
            dateLogOut = driver.lastLogout;
            services.map((current, i) => {
                if (current.createdAt > dateLogOut) {
                    servicesReturn.push(current);
                }
            });
            return servicesReturn;
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
            const ldap = await ldapAuth(email);

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
            if (!ldap) {
                throw new Error("El usuario no existe!");
            }
            if (user && ldap) {
                currentId = user._id;
                currentPassword = user.password;
                currentEmail = user.email;
                currentClient = "user";
            }
            if (driver && ldap) {
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
        vehicles: async (_, { type, department, city }) => {
            if (type && !department && !city)
                return await Vehicle.find({ type: type });
            if (!type && department && !city)
                return await Vehicle.find({ department: department });
            if (!type && city) return await Vehicle.find({ city: city });
            if (type && department && !city)
                return await Vehicle.find({
                    type: type,
                    department: department,
                });
            if (type && city)
                return await Vehicle.find({ type: type, city: city });
            return await Vehicle.find();
        },
        servicesByDriver: async (_, { idDriver }) => {
            return await Service.find({ idDriver: idDriver });
        },
        servicesByUser: async (_, { idUser }) => {
            return await Service.find({ idUser: idUser });
        },

        //Rating
        ratingsByDriver: async (_, { idDriver }) => {
            return await Rating.find({ idDriver: idDriver });
        },
        ratingsByVehicle: async (_, { idVehicle }) => {
            return await Rating.find({ idVehicle: idVehicle });
        },
        ratingByService: async (_, { idService }) => {
            return await Rating.findOne({ idService: idService });
        },

        //Rank
        rankByVehicle: async (_, { idVehicle }) => {
            return Rank.findOne({ idVehicle: idVehicle });
        },
    },

    Mutation: {
        //User
        async createUser(_, { input }) {
            const id = await User.findOne({ _id: input._id });
            const email = await User.findOne({ email: input.email });
            input.password = await bcrypt.hash(input.password, 12);
            const ldap = await ldapAuth(input.email);
            if (id) {
                throw new Error(
                    "Ya existe una cuenta con ese número de identificación!"
                );
            }
            if (email || ldap) {
                throw new Error("Ya existe una cuenta con ese correo!");
            }
            ldapCreate(input.name, input.surname, input.email, input.password);
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
            input.password = await bcrypt.hash(input.password, 12);
            const ldap = await ldapAuth(input.email);
            if (id) {
                throw new Error(
                    "Ya existe una cuenta con ese número de identificación!"
                );
            }
            if (email || ldap) {
                throw new Error("Ya existe una cuenta con ese correo!");
            }
            ldapCreate(input.name, input.surname, input.email, input.password);
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
                    driver.idVehicle.push(newVehicle);
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
            pubsub.publish(SERVICE_UPDATED, { serviceUpdated: service });
            return service;
        },
        async acceptService(_, { _id }) {
            const input = {
                state: "accepted",
            };
            const service = await Service.findByIdAndUpdate(_id, input, {
                new: true,
            });
            pubsub.publish(SERVICE_UPDATED, { serviceUpdated: service });

            return service;
        },
        async cancelService(_, { _id }) {
            const input = {
                state: "cancelled",
            };
            const service = await Service.findByIdAndUpdate(_id, input, {
                new: true,
            });
            pubsub.publish(SERVICE_UPDATED, { serviceUpdated: service });

            return service;
        },
        async finishService(_, { _id }) {
            const input = {
                state: "finished",
            };
            const service = await Service.findByIdAndUpdate(_id, input, {
                new: true,
            });
            pubsub.publish(SERVICE_UPDATED, { serviceUpdated: service });

            return service;
        },
        async rateService(_, { _id }) {
            const input = {
                state: "rated",
            };
            const service = await Service.findByIdAndUpdate(_id, input, {
                new: true,
            });
            pubsub.publish(SERVICE_UPDATED, { serviceUpdated: service });

            return service;
        },
        async updateLogoutTimeDriver(_, { _id }) {
            const date = new Date(
                new Date().getTime() - 3600 * 1000 * 5
            ).toISOString();
            return await Driver.findByIdAndUpdate(
                _id,
                { lastLogout: date },
                {
                    new: true,
                }
            );
        },
        async updateLogoutTimeUser(_, { _id }) {
            const date = new Date(
                new Date().getTime() - 3600 * 1000 * 5
            ).toISOString();
            return await User.findByIdAndUpdate(
                _id,
                { lastLogout: date },
                {
                    new: true,
                }
            );
        },

        //Rating && Rank
        async createRating(_, { input }) {
            const newRating = new Rating(input);
            return await newRating
                .save()
                .then(
                    async () =>
                        await Rank.findOne({ idVehicle: input.idVehicle })
                )
                .then(async (rank) => {
                    if (!rank) {
                        rank = new Rank({
                            value: 0.0,
                            totalRatings: 0,
                            idVehicle: input.idVehicle,
                        });
                    }
                    rank.value =
                        rank.value +
                        (input.value - rank.value) / (rank.totalRatings + 1);
                    rank.totalRatings = rank.totalRatings + 1;
                    await rank.save();
                    return newRating;
                });
        },

        async createComplainUser(_, { _id, complain }) {
            return await User.findByIdAndUpdate(_id, {
                $push: { complains: complain },
            });
        },

        async createComplainDriver(_, { _id, complain }) {
            return await Driver.findByIdAndUpdate(_id, {
                $push: { complains: complain },
            });
        },
    },
};
