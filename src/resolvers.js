import User from "./models/User";
import Driver from "./models/Driver";
import Vehicle from "./models/Vehicle";

export const resolvers = {
    Query: {
        async Users() {
            return await User.find();
        },

        async profileUser(_,{_id}){
            return await User.findOne({_id : _id});
        }
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
