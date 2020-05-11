import { typeDefs } from "../typeDefs";
import { graphql } from "graphql";
import {
    makeExecutableSchema,
    addMockFunctionsToSchema,
    mockServer,
} from "graphql-tools";

const mocks = {
    Int: () => 0,
    String: () => "string",
};

const testProfileUser = {
    id: "Test profileUser",
    query: `
        query {
            profileUser(_id:"string"){
                _id
            }
        }
    `,
    variables: {},
    context: {},
    expected: {
        data: {
            profileUser: {
                _id: "string",
            },
        },
    },
};

const testProfileDriver = {
    id: "Test profileDriver",
    query: `
        query {
            profileDriver(_id:"string"){
                _id
            }
        }
    `,
    variables: {},
    context: {},
    expected: {
        data: {
            profileDriver: {
                _id: "string",
            },
        },
    },
};

const testLogin = {
    id: "Test login",
    query: `
        query {
            login(email: "string", password: "string"){
                userId
            }
        }
    `,
    variables: {},
    context: {},
    expected: {
        data: {
            login: {
                userId: "string",
            },
        },
    },
};

const testCreateUser = {
    id: "Test createUser",
    mutation: `
    mutation {
        createUser(input: {
            _id: "string"
            name: "string"
            surname: "string"
            phone: "string"
            email: "string"
            password: "string"
        }){
            _id
        }
    }
    `,
    variables: {},
    context: {},
    expected: {
        data: {
            createUser: {
                _id: "string",
            },
        },
    },
};

const testDeleteUser = {
    id: "Test deleteUser",
    mutation: `
    mutation {
        deleteUser(_id: "string") {
            _id
        }
    }
    `,
    variables: {},
    context: {},
    expected: {
        data: {
            deleteUser: {
                _id: "string",
            },
        },
    },
};

const testUpdateUser = {
    id: "Test updateUser",
    mutation: `
    mutation {
        updateUser(input: {
            _id: "string"
            name: "string"
            surname: "string"
            phone: "string"
        }) {
            _id
        }
    }
    `,
    variables: {},
    context: {},
    expected: {
        data: {
            updateUser: {
                _id: "string",
            },
        },
    },
};

describe("Schema", () => {
    // Array of case types
    const query = [testProfileUser, testProfileDriver, testLogin];
    const mutation = [testCreateUser, testDeleteUser, testUpdateUser];

    const mockSchema = makeExecutableSchema({ typeDefs });

    // Here we specify the return payloads of mocked types
    addMockFunctionsToSchema({
        schema: mockSchema,
        mocks: mocks,
    });

    test("has valid type definitions", async () => {
        expect(async () => {
            const MockServer = mockServer(typeDefs);

            await MockServer.query();
        }).not.toThrow();
    });

    query.forEach((obj) => {
        const { id, query, variables, context: ctx, expected } = obj;

        test(`query: ${id}`, async () => {
            return await expect(
                graphql(mockSchema, query, null, { ctx }, variables)
            ).resolves.toEqual(expected);
        });
    });

    mutation.forEach((obj) => {
        const { id, mutation, variables, context: ctx, expected } = obj;

        test(`mutation: ${id}`, async () => {
            return await expect(
                graphql(mockSchema, mutation, null, { ctx }, variables)
            ).resolves.toEqual(expected);
        });
    });
});
