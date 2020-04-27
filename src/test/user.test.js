import mongoose from "mongoose";
import User from "../models/User";

const userData = {
    _id: 1234567891,
    name: "Camilo",
    surname: "Sepulveda",
    phone: "3228121951",
    email: "camilo@correo.com",
    password: "password",
};

describe("User Model Test", () => {
    beforeAll(async () => {
        await mongoose.connect(
            global.__MONGO_URI__,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            },
            (err) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            }
        );
    });

    it("create & save user successfully", async () => {
        const validUser = new User(userData);
        const savedUser = await validUser.save();
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedUser._id).toBe(userData._id);
        expect(savedUser.name).toBe(userData.name);
        expect(savedUser.surname).toBe(userData.surname);
        expect(savedUser.phone).toBe(userData.phone);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.password).toBe(userData.password);
    });

    it("insert user successfully, but the field does not defined in schema should be undefined", async () => {
        const userWithInvalidField = new User({
            _id: 1234567890,
            name: "Miguel",
            surname: "Lopez",
            phone: "3228121952",
            email: "miguel@correo.com",
            password: "password",
            nickname: "Handsome TekLoon",
        });
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.nickname).toBeUndefined();
    });

    it("create user without required field should failed", async () => {
        const userWithoutRequiredField = new User({ _id: 1234567890 });
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            error = savedUserWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.name).toBeDefined();
        expect(err.errors.surname).toBeDefined();
        expect(err.errors.phone).toBeDefined();
        expect(err.errors.email).toBeDefined();
        expect(err.errors.password).toBeDefined();
    });
});
