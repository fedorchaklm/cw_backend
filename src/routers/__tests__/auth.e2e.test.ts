import request from "supertest";
import app, { startServer, stopServer } from "../../main";
import mongoose from "mongoose";
import { tokenService } from "../../services/token.service";
import { ActionTokenTypeEnum } from "../../enums/action-token-type.enum";
import { User } from "../../models/user.model";

const user = {
    email: "sun.jones.2@gmail.com",
    name: "Mary",
    surname: "Smith",
    password: "a2A!abcd",
};

const wrongEmail = "wrong@email.com";

const addToken = (req, token: string) => req.set("Authorization", `Bearer ${token}`);
const loginUser = (data: { email: string; password: string }) => request(app).post("/auth/sign-in").send(data);
const registerUser = (data: { email: string; password: string }) => request(app).post("/auth/sign-up").send(data);

const getUserTokens = async () => {
    await registerUser(user);
    const loginRes = await loginUser(user);
    return loginRes.body.tokens;
};

const getUser = async () => {
    const registeredUser = await request(app).post("/auth/sign-up").send(user);
    await User.findByIdAndUpdate(registeredUser.body.user._id, { isActive: true });
    return loginUser(user);
};

const refreshTokens = (refreshToken: string, token: string) => addToken(request(app).post("/auth/refresh"), token).send({ refreshToken });
const makeRecoveryRequest = (email: string, token: string) => addToken(request(app).post("/auth/recovery"), token).send({ email });
const recoveryPassword = (password: string, token: string) => request(app).post(`/auth/recovery/${token}`).send({ password });

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
        const res = await registerUser(user);

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
        await registerUser(user);
        const res = await registerUser(user);
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
        await registerUser(user);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should return user with tokens", async () => {
        const res = await loginUser(user);

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
        const res = await loginUser({ email: wrongEmail, password: user.password });
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

describe("POST /auth/recovery", () => {
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

    it("should send letter to email", async () => {
        const tokens = await getUserTokens();
        const res = await makeRecoveryRequest(user.email, tokens.accessToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            details: "Check your email",
        });
    });
});

describe("POST /auth/recovery/:token", () => {
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

    it.only("should change password", async () => {
        const response = await getUser();
        const token = tokenService.generateActionToken(
            {
                userId: response.body.user._id,
                role: response.body.user.role,
            },
            ActionTokenTypeEnum.RECOVERY,
        );
        const res = await recoveryPassword("P@sword123", token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            _id: res.body._id,
            name: res.body.name,
            surname: res.body.surname,
            email: res.body.email,
            isActive: true,
            role: "user",
        });
    });
});