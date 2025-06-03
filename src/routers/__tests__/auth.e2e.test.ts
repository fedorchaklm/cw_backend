import request from "supertest";
import app, { startServer, stopServer } from "../../main";
import mongoose from "mongoose";

const user = {
    email: "sun.jones.2@gmail.com",
    name: "Mary",
    surname: "Smith",
    password: "a2A!abcd",
};

const wrongEmail = "wrong@email.com";

const addToken = (req, token: string) => req.set("Authorization", `Bearer ${token}`);

const getUserTokens = async () => {
    await request(app).post("/auth/sign-up").send(user);
    const loginRes = await request(app).post("/auth/sign-in").send({
        email: user.email,
        password: user.password,
    });
    return loginRes.body.tokens;
};

const registerUser = async () => await request(app).post("/auth/sign-up").send(user);
const loginUser = async (email: string, password: string) => await request(app).post("/auth/sign-in").send({
    email,
    password,
});
const refreshTokens = async (refreshToken: string, token: string) => addToken(request(app).post("/auth/refresh"), token).send({ refreshToken });

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
        const res = await registerUser();
        console.log({ user: res.body });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            user: {
                _id: res.body.user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                isActive: false,
                role: "user",

            },
            tokens: expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            }),
        }));
    });

    it("should return error when email is in use", async () => {
        await registerUser();
        const res = await registerUser();

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
        await registerUser();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should return user with tokens", async () => {
        const res = await loginUser(user.email, user.password);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            user: {
                _id: res.body.user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                isActive: false,
                role: "user",

            },
            tokens: expect.objectContaining({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            }),
        }));
    });

    it("should return error when invalid credentials", async () => {
        const res = await loginUser(wrongEmail, user.password);
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe("Invalid email or password");
    });
});

describe("POST /auth/refresh", () => {
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

    it("should return user with tokens", async () => {
        const tokens = await getUserTokens();
        const res = await refreshTokens(tokens.refreshToken, tokens.accessToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
        }));
    });
});