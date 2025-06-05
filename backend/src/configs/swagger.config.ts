export const swaggerDocument = {
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
            name: "Users",
            description: "User endpoints",
        },
        {
            name: "Clinics",
            description: "Clinic endpoints",
        },
        {
            name: "Doctors",
            description: "Doctor endpoints",
        },
        {
            name: "Procedures",
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
                                                _id: { type: "string" },
                                                name: { type: "string" },
                                                surname: { type: "string" },
                                                email: { type: "string" },
                                                role: { type: "string" },
                                                isActive: { type: "boolean" },
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
                                                _id: { type: "string" },
                                                name: { type: "string" },
                                                surname: { type: "string" },
                                                email: { type: "string" },
                                                role: { type: "string" },
                                                isActive: { type: "boolean" },
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
                        description: "Activate account successfully",
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
                tags: ["Clinics"],
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
                        description:
                            "firstName, lastName, email or phone of doctor",
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
                                        prevPage: {
                                            type: "boolean",
                                            default: false,
                                        },
                                        nextPage: {
                                            type: "boolean",
                                            default: false,
                                        },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    _id: { type: "string" },
                                                    name: { type: "string" },
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
            post: {
                tags: ["Clinics"],
                summary: "Create clinic",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    doctors: {
                                        type: "array",
                                        items: {
                                            type: "string",
                                        },
                                    },
                                },
                                required: ["name", "doctors"],
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
        "/clinics/{id}": {
            get: {
                tags: ["Clinics"],
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
            patch: {
                tags: ["Clinics"],
                summary: "Update clinic by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Update clinic by id",
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
                                    name: { type: "string" },
                                    doctors: {
                                        type: "array",
                                        items: {
                                            type: "string",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
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
            delete: {
                tags: ["Clinics"],
                summary: "Delete clinic by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Delete clinic by id",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "204": {
                        description: "Successfully delete clinic",
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
        "/doctors": {
            get: {
                tags: ["Doctors"],
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
                        name: "firstName",
                        in: "query",
                        description: "doctor firstname",
                        schema: { type: "string" },
                    },
                    {
                        name: "lastName",
                        in: "query",
                        description: "doctor lastname",
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
                                                    firstName: {
                                                        type: "string",
                                                    },
                                                    lastName: {
                                                        type: "string",
                                                    },
                                                    email: {
                                                        type: "string",
                                                    },
                                                    phone: {
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
                                                    clinics: {
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
            post: {
                tags: ["Doctors"],
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
                                    procedures: {
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
                                    "procedures",
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
                                        _id: {
                                            type: "string",
                                        },
                                        firstName: {
                                            type: "string",
                                        },
                                        lastName: {
                                            type: "string",
                                        },
                                        email: {
                                            type: "string",
                                        },
                                        phone: {
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
                                        clinics: {
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
        "/doctors/{id}": {
            get: {
                tags: ["Doctors"],
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
                                        firstName: {
                                            type: "string",
                                        },
                                        lastName: {
                                            type: "string",
                                        },
                                        email: {
                                            type: "string",
                                        },
                                        phone: {
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
                                        clinics: {
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
            patch: {
                tags: ["Doctors"],
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
                                    procedures: {
                                        type: "array",
                                        items: {
                                            type: "string",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
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
                                        firstName: {
                                            type: "string",
                                        },
                                        lastName: {
                                            type: "string",
                                        },
                                        email: {
                                            type: "string",
                                        },
                                        phone: {
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
                                        clinics: {
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
            delete: {
                tags: ["Doctors"],
                summary: "Delete doctor  by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Delete doctor by id",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "204": {
                        description: "Successfully delete doctor",
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
        "/procedures": {
            get: {
                tags: ["Procedures"],
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
            post: {
                tags: ["Procedures"],
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
        "/procedures/{id}": {
            get: {
                tags: ["Procedures"],
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
            patch: {
                tags: ["Procedures"],
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
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                },
                            },
                        },
                    },
                },
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
            delete: {
                tags: ["Procedures"],
                summary: "Delete procedure by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Delete procedure by id",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "204": {
                        description: "Successfully delete procedure",
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
        "/users": {
            get: {
                tags: ["Users"],
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
                                            _id: { type: "string" },
                                            name: { type: "string" },
                                            surname: { type: "string" },
                                            email: {
                                                type: "string",
                                            },
                                            role: { type: "string" },
                                            isActive: { type: "boolean" },
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
                                        role: { type: "string" },
                                        isActive: { type: "boolean" },
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
