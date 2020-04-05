import User from "./models/User";

export const resolvers = {
    Query: {
        async Users() {
            return await User.find();
        },
    },
    Mutation: {
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
    },
};
