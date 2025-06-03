import request from "supertest";
import app, { startServer, stopServer } from "../../main";
import mongoose from "mongoose";
import { RoleEnum } from "../../enums/role.enum";
import { User } from "../../models/user.model";
import bcrypt from "bcrypt";
// import { tokenService } from "../../services/token.service";
// import { tokenRepository } from "../../repositories/token.repository";

const user = {
    email: "sun.jones.2@gmail.com",
    name: "Mary",
    surname: "Smith",
    password: "a2A!abcd",
};

const admin = {
    email: "admin@gmail.com",
    name: "admin",
    surname: "Admin",
    password: "P@ssword123",
    role: RoleEnum.ADMIN,
};

const procedure = {
    name: "some procedure",
};

const procedureMain = {
    name: "main procedure",
};

describe("POST /procedures", () => {
    let token: string;

    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        await User.create({
            ...admin,
            password: await bcrypt.hash(admin.password, 10),
        });
        // const tokens = tokenService.generateTokens({
        //     userId: createdAdmin._id,
        //     role: createdAdmin.role as RoleEnum,
        // });
        // await tokenRepository.create({ ...tokens, _userId: createdAdmin._id });
        const res = await request(app).post("/auth/sign-in").send({
            email: admin.email,
            password: admin.password,
        });
        token = res.body.tokens.accessToken;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should create a new procedure", async () => {
        const res = await request(app).post("/procedures").send(procedure).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: procedure.name,
        }));
    });

    it("should return error when such procedure is already exists", async () => {
        await request(app).post("/procedures").send(procedure).set("Authorization", `Bearer ${token}`);
        const res = await request(app).post("/procedures").send(procedure).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe(`Procedure ${procedure.name} already exists!`);
    });

    it("should return error not permitted", async () => {
        await request(app).post("/auth/sign-up").send(user);
        const loginRes = await request(app).post("/auth/sign-in").send({
            email: user.email,
            password: user.password,
        });
        const userToken = loginRes.body.tokens.accessToken;
        const res = await request(app).post("/procedures").send(procedure).set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});

describe("GET all /procedures", () => {
    let token: string;
    let userToken: string;

    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        await User.create({
            ...admin,
            password: await bcrypt.hash(admin.password, 10),
        });
        const res = await request(app).post("/auth/sign-in").send({
            email: admin.email,
            password: admin.password,
        });
        token = res.body.tokens.accessToken;
        await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedureMain);
        await request(app).post("/auth/sign-up").send(user);
        const loginRes = await request(app).post("/auth/sign-in").send({
            email: user.email,
            password: user.password,
        });
        userToken = loginRes.body.tokens.accessToken;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should return all procedures", async () => {
        const res = await request(app).get("/procedures").set("Authorization", `Bearer ${userToken}`);
        console.log({ procedures: res.body.procedures });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data[0]).toHaveProperty("name");
    });

    it("should return all procedures such have word some ", async () => {
        const res = await request(app).get("/procedures?name=some").set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: expect.any(String),
                name: procedure.name,
            }),
        ]));
    });
});

describe("GET by id /procedures", () => {
    let token: string;
    let userToken: string;
    let createdProcedure;

    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        await User.create({
            ...admin,
            password: await bcrypt.hash(admin.password, 10),
        });
        const res = await request(app).post("/auth/sign-in").send({
            email: admin.email,
            password: admin.password,
        });
        token = res.body.tokens.accessToken;
        createdProcedure = await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        await request(app).post("/auth/sign-up").send(user);
        const loginRes = await request(app).post("/auth/sign-in").send({
            email: user.email,
            password: user.password,
        });
        userToken = loginRes.body.tokens.accessToken;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should return procedure by id", async () => {
        const res = await request(app).get(`/procedures/${createdProcedure.body._id}`).set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            _id: createdProcedure.body._id,
            name: procedure.name,
        }));
    });

    it("should return error when procedure with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/procedures/${fakeId}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Procedure with such id ${fakeId} not found!`);
    });
});

describe("PATCH update by id /procedures", () => {
    let token: string;
    let createdProcedure;

    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        await User.create({
            ...admin,
            password: await bcrypt.hash(admin.password, 10),
        });
        const res = await request(app).post("/auth/sign-in").send({
            email: admin.email,
            password: admin.password,
        });
        token = res.body.tokens.accessToken;
        console.log({ token });
        createdProcedure = await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        console.log({ createdProcedure: createdProcedure.body });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should return updated procedure by id", async () => {
        const res = await request(app).patch(`/procedures/${createdProcedure.body._id}`).set("Authorization", `Bearer ${token}`).send(procedureMain);
        console.log({ res: res.body });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            _id: createdProcedure.body._id,
            name: procedureMain.name,
        }));
    });

    it("should return error when procedure with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).patch(`/procedures/${fakeId}`).set("Authorization", `Bearer ${token}`).send(procedureMain);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Procedure with such id ${fakeId} not found!`);
    });

    it("should return error not permitted", async () => {
        await request(app).post("/auth/sign-up").send(user);
        const loginRes = await request(app).post("/auth/sign-in").send({
            email: user.email,
            password: user.password,
        });
        const userToken = loginRes.body.tokens.accessToken;
        const res = await request(app).patch(`/procedures/${createdProcedure.body._id}`).set("Authorization", `Bearer ${userToken}`).send(procedureMain);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});

describe("DELETE by id /procedures", () => {
    let token: string;
    let createdProcedure;

    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        await User.create({
            ...admin,
            password: await bcrypt.hash(admin.password, 10),
        });
        const res = await request(app).post("/auth/sign-in").send({
            email: admin.email,
            password: admin.password,
        });
        token = res.body.tokens.accessToken;
        console.log({ token });
        createdProcedure = await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        console.log({ createdProcedure: createdProcedure.body });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should delete procedure by id", async () => {
        const res = await request(app).delete(`/procedures/${createdProcedure.body._id}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(204);
    });

    it("should return error when procedure with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/procedures/${fakeId}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Procedure with such id ${fakeId} not found!`);
    });

    it("should return error not permitted", async () => {
        await request(app).post("/auth/sign-up").send(user);
        const loginRes = await request(app).post("/auth/sign-in").send({
            email: user.email,
            password: user.password,
        });
        const userToken = loginRes.body.tokens.accessToken;
        const res = await request(app).delete(`/procedures/${createdProcedure.body._id}`).set("Authorization", `Bearer ${userToken}`).send(procedureMain);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});