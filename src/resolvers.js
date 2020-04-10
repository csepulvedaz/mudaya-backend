import jwt from "jsonwebtoken";
import User from "./models/User";
import Driver from "./models/Driver";
import Vehicle from "./models/Vehicle";

export const resolvers = {
    Query: {
        Users: async () => {
            return await User.find();
        },
        profileUser: async (_,{_id}) => {
            return await User.findOne({_id : _id});
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email: email });
            if (!user) {
                throw new Error("El correo no existe!");
            }
            const isEqual = password === user.password;
            if (!isEqual) {
                throw new Error("Contraseña incorrecta!");
            }
            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                },
                "somesupersecretkey",
                { expiresIn: "1h" }
            );
            return {
                userId: user._id,
                token: token,
                tokenExpiration: 1,
            };
        },
    },
    Mutation: {
        //Create User
        async createUser(_, { input }) {
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
