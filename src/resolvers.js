import User from "./models/User";
import Driver from "./models/Driver";
import Vehicle from "./models/Vehicle";

export const resolvers = {
    Query: {
        async Users() {
            return await User.find();
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
            let createdVehicle;
            return await newVehicle
                .save()
                .then(async (result) => {
                    createdVehicle = {
                        ...result._doc,
                        _id: result._doc._id.toString(),
                    };
                    return await Driver.findById(input.idDriver);
                })
                .then(async (driver) => {
                    driver.idVehicle = newVehicle;
                    return await driver.save();
                })
                .then(() => createdVehicle);
        },
        async deleteVehicle(_, { _id }) {
            return await Vehicle.findByIdAndDelete(_id);
        },
        async updateVehicle(_, { _id, input }) {
            return await Vehicle.findByIdAndUpdate(_id, input, { new: true });
        },
    },
};
