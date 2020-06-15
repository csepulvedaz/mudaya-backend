import mongoose from "mongoose";
import Vehicle from "../models/Vehicle";

const vehicleData = {
    _id: "abc - 333",
    brand: "Mazda",
    model: "Dos",
    year: 2020,
    type: "Camion",
    dimensions: "1m x 1m x 1m",
    capacity: "1m x 1m x 1m",
    department: "Cundinamarca",
    city: "Bogota",
    commentary: "Comentario acerca del vehiculo",
};

describe("Vehicle Model Test", () => {
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

    it("create & save vehicle successfully", async () => {
        const validVehicle = new Vehicle(vehicleData);
        const savedVehicle = await validVehicle.save();
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedVehicle._id).toBe(vehicleData._id);
        expect(savedVehicle.brand).toBe(vehicleData.brand);
        expect(savedVehicle.model).toBe(vehicleData.model);
        expect(savedVehicle.year).toBe(vehicleData.year);
        expect(savedVehicle.type).toBe(vehicleData.type);
        expect(savedVehicle.dimensions).toBe(vehicleData.dimensions);
        expect(savedVehicle.capacity).toBe(vehicleData.capacity);
        expect(savedVehicle.department).toBe(vehicleData.department);
        expect(savedVehicle.city).toBe(vehicleData.city);
        expect(savedVehicle.commentary).toBe(vehicleData.commentary);
    });

    it("insert vehicle successfully, but the field does not defined in schema should be undefined", async () => {
        const vehicleWithInvalidField = new Vehicle({
            _id: "aaa - 444",
            brand: "BMW",
            model: "tres",
            year: 2019,
            type: "Camion Grande",
            dimensions: "1m x 1m x 1m",
            capacity: "1m x 1m x 1m",
            department: "Fucha",
            city: "Fucha",
            nickname: "Tesla",
        });
        const savedVehicleWithInvalidField = await vehicleWithInvalidField.save();
        expect(savedVehicleWithInvalidField._id).toBeDefined();
        expect(savedVehicleWithInvalidField.nickname).toBeUndefined();
    });

    it("create vehicle without required field should failed", async () => {
        const vehicleWithoutRequiredField = new Vehicle({ _id: "bbb - 222" });
        let err;
        try {
            const savedVehicleWithoutRequiredField = await vehicleWithoutRequiredField.save();
            error = savedVehicleWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.brand).toBeDefined();
        expect(err.errors.model).toBeDefined();
        expect(err.errors.year).toBeDefined();
        expect(err.errors.type).toBeDefined();
        expect(err.errors.dimensions).toBeDefined();
        expect(err.errors.capacity).toBeDefined();
    });
    afterAll((done) => {
        // Closing the DB connection allows Jest to exit successfully.
        mongoose.connection.close();
        done();
    });
});
