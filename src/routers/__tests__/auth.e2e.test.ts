import request from "supertest";
import app, { startServer, stopServer } from "../../main";
import mongoose from "mongoose";

const user = {
    email: "sun.jones.2@gmail.com",
    name: "Mary",
    surname: "Smith",
    password: "a2A!abcd",
};

describe("POST /auth/sign-up", () => {
    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should register new user", async () => {
        const res = await request(app).post("/auth/sign-up").send(user);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            user: expect.objectContaining({
                _id: expect.any(String),
                name: user.name,
                surname: user.surname,
                email: user.email,

            }),
            tokens: expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            }),
        }));
    });

    it("should return error when email is in use", async () => {
        await request(app).post("/auth/sign-up").send(user);
        const res = await request(app).post("/auth/sign-up").send(user);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe("User is already exists");
    });
});

describe("POST /auth/sign-in", () => {
    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        await request(app).post("/auth/sign-up").send(user);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should return user with tokens", async () => {
        const res = await request(app).post("/auth/sign-in").send({
            email: user.email,
            password: user.password,
        });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            user: expect.objectContaining({
                _id: expect.any(String),
                name: user.name,
                surname: user.surname,
                email: user.email,

            }),
            tokens: expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            }),
        }));
    });

    it("should return error when email is in use", async () => {
        const res = await request(app).post("/auth/sign-in").send({
            email: "wrong@email.com",
            password: user.password,
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe("Invalid email or password");
    });
});