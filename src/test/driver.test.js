import mongoose from "mongoose";
import Driver from "../models/Driver";

const driverData = {
    _id: "1234567291",
    name: "Thomas",
    surname: "Edison",
    phone: "3141592653",
    email: "wa@sa.co",
    password: "1234",
};

describe("Driver Model Test", () => {
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

    it("create & save driver successfully", async () => {
        const validDriver = new Driver(driverData);
        const savedDriver = await validDriver.save();
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedDriver._id).toBe(driverData._id);
        expect(savedDriver.name).toBe(driverData.name);
        expect(savedDriver.surname).toBe(driverData.surname);
        expect(savedDriver.phone).toBe(driverData.phone);
        expect(savedDriver.email).toBe(driverData.email);
        expect(savedDriver.password).toBe(driverData.password);
    });

    it("insert driver successfully, but the field does not defined in schema should be undefined", async () => {
        const driverWithInvalidField = new Driver({
            _id: "0987654399",
            name: "Miguel",
            surname: "Jose",
            phone: "2718281828",
            email: "amarillo@color.com",
            password: "incorrecto",
            nickname: "Lord Josejose",
        });
        const savedDriverWithInvalidField = await driverWithInvalidField.save();
        expect(savedDriverWithInvalidField._id).toBeDefined();
        expect(savedDriverWithInvalidField.nickname).toBeUndefined();
    });

    it("create driver without required field should failed", async () => {
        const driverWithoutRequiredField = new Driver({ _id: "1234567890" });
        let err;
        try {
            const savedDriverWithoutRequiredField = await driverWithoutRequiredField.save();
            error = savedDriverWithoutRequiredField;
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
    afterAll((done) => {
        // Closing the DB connection allows Jest to exit successfully.
        mongoose.connection.close();
        done();
    });
});
