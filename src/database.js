import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;

mongoose
    .connect(
        `mongodb+srv://${user}:${password}@mudayacluster-j9osa.gcp.mongodb.net/mudayaDB`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }
    )
    .then((db) => console.log("Database is conected"))
    .catch((err) => console.log(err));
