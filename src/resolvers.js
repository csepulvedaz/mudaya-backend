import jwt from "jsonwebtoken";
import User from "./models/User";
import Driver from "./models/Driver";
import Vehicle from "./models/Vehicle";

export const resolvers = {
    Query: {
        Users: async () => {
            return await User.find();
        },
        profileUser: async (_, { _id }) => {
            return await User.findOne({ _id: _id });
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
            const isEqual = password === currentPassword;
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
        Vehicles: async () => {
            return await Vehicle.find();
        },
    },
    Mutation: {
        //Create User
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
            const newUser = new User(input);
            await newUser.save();
            return newUser;
        },
        async deleteUser(_, { _id }) {
            return await User.findByIdAndDelete(_id);
        },
        async updateUser(_, { _id, input }) {
            return await User.findByIdAndUpdate(_id, input, { new: true });
        },

        //Create Driver
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
            const newDriver = new Driver(input);
            await newDriver.save();
            return newDriver;
        },
        async deleteDriver(_, { _id }) {
            return await Driver.findByIdAndDelete(_id);
        },
        async updateDriver(_, { _id, input }) {
            return await Driver.findByIdAndUpdate(_id, input, { new: true });
        },

        //Create Vehicle
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
    },
};
