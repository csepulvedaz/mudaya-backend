import express from "express";
import graphqlHTTP from "express-graphql";
import schema from "./schema";
import cors from "cors";
import "./database";

const app = express();
app.use(cors());

app.set("port", process.env.PORT || 4000);

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        graphiql: true,
    })
);

app.listen(app.get("port"), () =>
    console.log(
        `Running a GraphQL API server at http://localhost:${app.get(
            "port"
        )}/graphql;`
    )
);
