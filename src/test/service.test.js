import mongoose from "mongoose";
import Service from "../models/Service";

const serviceData = {
    date: new Date("2020-09-11T03:00:00.000Z"),
    origin: "Calle 60 # 61 - 21",
    destination: "Calle 100 # 60 - 21",
    idUser: "1015463821",
};

describe("Service Model Test", () => {
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

    it("create & save service successfully", async () => {
        const validService = new Service(serviceData);
        const savedService = await validService.save();
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedService._id).toBeDefined();
        expect(savedService.date).toBe(serviceData.date);
        expect(savedService.origin).toBe(serviceData.origin);
        expect(savedService.destination).toBe(serviceData.destination);
        expect(savedService.idUser).toBe(serviceData.idUser);
    });

    it("insert service successfully, but the field does not defined in schema should be undefined", async () => {
        const serviceWithInvalidField = new Service({
            date: new Date("2020-09-11T03:00:00.000Z"),
            origin: "Calle 60 # 61 - 21",
            destination: "Calle 100 # 60 - 21",
            idUser: "1015463821",
            nickname: "Nikola",
        });
        const savedServiceWithInvalidField = await serviceWithInvalidField.save();
        expect(savedServiceWithInvalidField._id).toBeDefined();
        expect(savedServiceWithInvalidField.nickname).toBeUndefined();
    });

    it("create service without required field should failed", async () => {
        const serviceWithoutRequiredField = new Service({
            date: new Date("2020-09-11T03:00:00.000Z"),
        });
        let err;
        try {
            const savedServiceWithoutRequiredField = await serviceWithoutRequiredField.save();
            error = savedServiceWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.origin).toBeDefined();
        expect(err.errors.destination).toBeDefined();
        expect(err.errors.idUser).toBeDefined();
    });
});
