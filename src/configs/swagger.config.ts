import { OpenAPIV3 } from "openapi-types";

export const swaggerDocument: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
        title: "Clinic API Documentation",
        version: "1.0.0",
        description: "Api documentation for clinic",
    },
    servers: [
        {
            url: "http://localhost:5000",
            description: "local server",
        },
    ],
    tags: [
        {
            name: "Auth",
            description: "Authentication endpoints",
        },
        {
            name: "User",
            description: "User endpoints",
        },
        {
            name: "Clinic",
            description: "Clinic endpoints",
        },
        {
            name: "Doctor",
            description: "Doctor endpoints",
        },
        {
            name: "Procedure",
            description: "Procedure endpoints",
        },
    ],
    paths: {
        "/auth/sign-up": {
            post: {
                tags: ["Auth"],
                summary: "Register new user",
                requestBody: {
                    required: true,
                    content: {
                        "aplication/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: {
                                        type: "string",
                                        format: "password",
                                    },
                                    name: { type: "string" },
                                    surname: { type: "string" },
                                },
                                required: [
                                    "email",
                                    "password",
                                    "name",
                                    "surname",
                                ],
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "User registered successfully",
                        content: {
                            "aplication/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        user: {
                                            type: "object",
                                            properties: {
                                                email: { type: "string" },
                                                role: { type: "string" },
                                                name: { type: "string" },
                                                surname: { type: "string" },
                                                isActive: { type: "boolean" },
                                                isVerified: { type: "boolean" },
                                                _id: { type: "string" },
                                                createdAt: { type: "string" },
                                                updatedAt: { type: "string" },
                                            },
                                        },
                                        tokens: {
                                            type: "object",
                                            properties: {
                                                accessToken: { type: "string" },
                                                refreshToken: {
                                                    type: "string",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Bad Request",
                        content: {
                            "aplication/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        status: {
                                            type: "string",
                                            default: 400,
                                        },
                                        message: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/auth/sign-in": {
            post: {
                tags: ["Auth"],
                summary: "Login user",
                requestBody: {
                    required: true,
                    content: {
                        "aplication/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: {
                                        type: "string",
                                        format: "password",
                                    },
                                },
                                required: ["email", "password"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "User sign in in successfully",
                        content: {
                            "aplication/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        user: {
                                            type: "object",
                                            properties: {
                                                email: { type: "string" },
                                                role: { type: "string" },
                                                name: { type: "string" },
                                                surname: { type: "string" },
                                                isActive: { type: "boolean" },
                                                isDeleted: { type: "boolean" },
                                                isVerified: { type: "boolean" },
                                                _id: { type: "string" },
                                                createdAt: { type: "string" },
                                                updatedAt: { type: "string" },
                                            },
                                        },
                                        tokens: {
                                            type: "object",
                                            properties: {
                                                accessToken: { type: "string" },
                                                refreshToken: {
                                                    type: "string",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "aplication/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        status: {
                                            type: "string",
                                            default: 401,
                                        },
                                        message: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/clinics": {
            get: {
                tags: ["Clinic"],
                summary: "Get clinics with pagination and filter",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "pageSize",
                        in: "query",
                        description: "number of size per page",
                        schema: { type: "integer", default: 10 },
                    },
                    {
                        name: "page",
                        in: "query",
                        description: "page number",
                        schema: { type: "integer", default: 1 },
                    },
                    {
                        name: "name",
                        in: "query",
                        description: "clinic name",
                        schema: { type: "string" },
                    },
                    {
                        name: "procedures",
                        in: "query",
                        description: "name of procedure",
                        schema: { type: "string" },
                    },
                    {
                        name: "doctors",
                        in: "query",
                        description: "name of doctor",
                        schema: { type: "integer" },
                    },
                ],
                responses: {
                    "200": {
                        description:
                            "List of clinics with pagination and filter",
                        content: {
                            "aplication/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        totalItems: { type: "integer" },
                                        totalPages: { type: "integer" },
                                        prevPage: { type: "boolean" },
                                        nextPage: { type: "boolean" },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    name: { type: "string" },
                                                    address: { type: "string" },
                                                    phone: {
                                                        type: "string",
                                                    },
                                                    email: {
                                                        type: "string",
                                                    },
                                                    procedures: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                _id: {
                                                                    type: "string",
                                                                },
                                                                name: {
                                                                    type: "string",
                                                                },
                                                            },
                                                        },
                                                    },
                                                    doctors: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                _id: {
                                                                    type: "string",
                                                                },
                                                                name: {
                                                                    type: "string",
                                                                },
                                                                surname: {
                                                                    type: "string",
                                                                },
                                                                age: {
                                                                    type: "number",
                                                                },
                                                                phone: {
                                                                    type: "string",
                                                                },
                                                                email: {
                                                                    type: "string",
                                                                },
                                                                experience: {
                                                                    type: "number",
                                                                },
                                                                clinics: {
                                                                    type: "array",
                                                                    items: {
                                                                        type: "string",
                                                                    },
                                                                },
                                                                doctors: {
                                                                    type: "array",
                                                                    items: {
                                                                        type: "string",
                                                                    },
                                                                },
                                                                createdAt: {
                                                                    type: "string",
                                                                },
                                                                updatedAt: {
                                                                    type: "string",
                                                                },
                                                            },
                                                        },
                                                    },
                                                    description: {
                                                        type: "string",
                                                    },
                                                    createdAt: {
                                                        type: "string",
                                                    },
                                                    updatedAt: {
                                                        type: "string",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/procedures": {
            get: {
                tags: ["Procedure"],
                summary: "Get procedures with pagination and filter",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "pageSize",
                        in: "query",
                        description: "number of size per procedure",
                        schema: { type: "integer", default: 10 },
                    },
                    {
                        name: "page",
                        in: "query",
                        description: "page number",
                        schema: { type: "integer", default: 1 },
                    },
                    {
                        name: "name",
                        in: "query",
                        description: "procedure name",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description:
                            "List of procedures with pagination and filter",
                        content: {
                            "aplication/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        totalItems: { type: "integer" },
                                        totalPages: { type: "integer" },
                                        prevPage: { type: "boolean" },
                                        nextPage: { type: "boolean" },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    name: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/procedures/{id}": {
            get: {
                tags: ["Procedure"],
                summary: "Get procedures with pagination and filter",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Get procedure by id",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Successfully get procedure",
                        content: {
                            "aplication/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        name: { type: "string" },
                                        createdAt: { type: "string" },
                                        updatedAt: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "aplication/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        status: {
                                            type: "string",
                                            default: 404,
                                        },
                                        message: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/procedures/post": {
            post: {
                tags: ["Procedure"],
                summary: "Create procedure",
                requestBody: {
                    required: true,
                    content: {
                        "aplication/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                },
                                required: ["name"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Create procedure successfully",
                        content: {
                            "aplication/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        name: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Bad Request",
                        content: {
                            "aplication/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        status: {
                                            type: "string",
                                            default: 400,
                                        },
                                        message: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/users/{id}": {
            get: {
                tags: ["Users"],
                summary: "Get user by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Get user by id",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Successfully get user",
                        content: {
                            "aplication/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        email: { type: "string" },
                                        role: { type: "string" },
                                        name: { type: "string" },
                                        surname: { type: "string" },
                                        age: { type: "integer" },
                                        avatar: { type: "string" },
                                        isActive: { type: "boolean" },
                                        isDeleted: { type: "boolean" },
                                        isVerified: { type: "boolean" },
                                        _id: { type: "string" },
                                        createdAt: { type: "string" },
                                        updatedAt: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
};
