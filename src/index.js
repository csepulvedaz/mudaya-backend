import express from "express";
import graphqlHTTP from "express-graphql";
import schema from "./schema";
import "./database";

const app = express();

app.set("port", process.env.PORT || 3000);

let root = { hello: () => "Hello world!" };

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
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
