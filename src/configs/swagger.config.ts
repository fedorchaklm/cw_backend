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
                        "application/json": {
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
                            "application/json": {
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
                            "application/json": {
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
                        "application/json": {
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
                            "application/json": {
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
                            "application/json": {
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
        "/auth/activate/{token}": {
            patch: {
                tags: ["Auth"],
                summary: "Activate account",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "token",
                        in: "path",
                        description: "token",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Get refresh tokens successfully",
                        content: {
                            "application/json": {
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
                            "application/json": {
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
        "/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get current authorized user",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Get current authorized user successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        name: { type: "string" },
                                        surname: { type: "string" },
                                        email: { type: "string" },
                                        role: { type: "string" },
                                        isActive: { type: "boolean" },
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
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
        "/auth/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Refresh tokens",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    refreshToken: { type: "string" },
                                },
                                required: ["refreshToken"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Get refresh tokens successfully",
                        content: {
                            "application/json": {
                                schema: {
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
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
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
        "/auth/recovery": {
            post: {
                tags: ["Auth"],
                summary: "Recovery request",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                },
                                required: ["email"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Made recovery request successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        details: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
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
        "/auth/recovery/{token}": {
            post: {
                tags: ["Auth"],
                summary: "Recovery password",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "token",
                        in: "path",
                        description: "token",
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    password: { type: "string" },
                                },
                                required: ["password"],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Get refresh tokens successfully",
                        content: {
                            "application/json": {
                                schema: {
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
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
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
                            "application/json": {
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
        "/clinics/{id}": {
            get: {
                tags: ["Clinic"],
                summary: "Get clinic by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Get clinic by id",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Successfully get clinic",
                        content: {
                            "application/json": {
                                schema: {
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
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
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
        "/clinics/post": {
            post: {
                tags: ["Clinic"],
                summary: "Create clinic",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    address: { type: "string" },
                                    phone: {
                                        type: "string",
                                    },
                                    email: {
                                        type: "string",
                                        format: "email",
                                    },
                                    description: {
                                        type: "string",
                                    },
                                },
                                required: [
                                    "name",
                                    "address",
                                    "phone",
                                    "email",
                                    "description",
                                ],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Create clinic successfully",
                        content: {
                            "application/json": {
                                schema: {
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
                                            items: { type: "string" },
                                        },
                                        doctors: {
                                            type: "array",
                                            items: { type: "string" },
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
                    "400": {
                        description: "Bad Request",
                        content: {
                            "application/json": {
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
        "/doctors": {
            get: {
                tags: ["Doctor"],
                summary: "Get doctors with pagination and filter",
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
                        description: "doctor name",
                        schema: { type: "string" },
                    },
                    {
                        name: "surname",
                        in: "query",
                        description: "doctor surname",
                        schema: { type: "string" },
                    },
                    {
                        name: "phone",
                        in: "query",
                        description: "doctor phone",
                        schema: { type: "string" },
                    },
                    {
                        name: "email",
                        in: "query",
                        description: "doctor email",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description:
                            "List of doctors with pagination and filter",
                        content: {
                            "application/json": {
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
                                                                    address: {
                                                                        type: "string",
                                                                    },
                                                                    phone: {
                                                                        type: "string",
                                                                    },
                                                                    email: {
                                                                        type: "string",
                                                                    },
                                                                    procedures:
                                                                        {
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
                                                                    description:
                                                                        {
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
        "/doctors/{id}": {
            get: {
                tags: ["Doctor"],
                summary: "Get doctor by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Get doctor by id",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Successfully get doctor",
                        content: {
                            "application/json": {
                                schema: {
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
                                                        address: {
                                                            type: "string",
                                                        },
                                                        phone: {
                                                            type: "string",
                                                        },
                                                        email: {
                                                            type: "string",
                                                        },
                                                        procedures: {
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
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
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
        "/doctors/post": {
            post: {
                tags: ["Doctor"],
                summary: "Create doctor",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    surname: { type: "string" },
                                    email: { type: "string", format: "email" },
                                    phone: { type: "string" },
                                    experience: { type: "string" },
                                    age: { type: "integer" },
                                    procedures: {
                                        type: "array",
                                        items: {
                                            type: "string",
                                        },
                                    },
                                    clinics: {
                                        type: "array",
                                        items: {
                                            type: "string",
                                        },
                                    },
                                },
                                required: [
                                    "name",
                                    "surname",
                                    "email",
                                    "phone",
                                    "experience",
                                    "age",
                                    "procedures",
                                    "clinics",
                                ],
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Create doctor successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        name: { type: "string" },
                                        surname: { type: "string" },
                                        email: {
                                            type: "string",
                                        },
                                        phone: { type: "string" },
                                        experience: { type: "string" },
                                        age: { type: "integer" },
                                        procedures: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                        },
                                        clinics: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                        },
                                        createdAt: { type: "string" },
                                        updatedAt: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Bad Request",
                        content: {
                            "application/json": {
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
                            "application/json": {
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
                summary: "Get procedure by id",
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
                            "application/json": {
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
                            "application/json": {
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
                        "application/json": {
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
                            "application/json": {
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
                            "application/json": {
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
        "/users": {
            get: {
                tags: ["User"],
                summary: "Get all users",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": {
                        description: "Successfully get all users",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            isActive: { type: "boolean" },
                                            _id: { type: "string" },
                                            name: { type: "string" },
                                            email: {
                                                type: "string",
                                            },
                                            surname: { type: "string" },
                                            role: { type: "string" },
                                            isVerified: { type: "boolean" },
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
        "/users/{id}": {
            get: {
                tags: ["User"],
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
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        email: {
                                            type: "string",
                                        },
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
                            },
                        },
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
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
