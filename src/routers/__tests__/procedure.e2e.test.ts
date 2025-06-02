import request from "supertest";
import app, { startServer, stopServer } from "../../main";
import mongoose from "mongoose";

const user = {
    email: "sun.jones.2@gmail.com",
    name: "Mary",
    surname: "Smith",
    password: "a2A!abcd",
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
        await request(app).post("/auth/sign-up").send(user);
        const loginRes = await request(app).post("/auth/sign-in").send({
            email: user.email,
            password: user.password,
        });
        token = loginRes.body.tokens.accessToken;
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
});

describe("GET /procedures", () => {
    let token: string;

    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        await request(app).post("/auth/sign-up").send(user);
        const loginRes = await request(app).post("/auth/sign-in").send({
            email: user.email,
            password: user.password,
        });
        token = loginRes.body.tokens.accessToken;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should return all procedures", async () => {
        await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedureMain);
        const res = await request(app).get("/procedures").set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data[0]).toHaveProperty("name");
    });

    it("should return all procedures such have word some ", async () => {
        await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedureMain);
        const res = await request(app).get("/procedures?name=some").set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: expect.any(String),
                name: procedure.name,
            })
        ]));
    });
});

describe("GET by id /procedures", () => {
    let token: string;

    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        await request(app).post("/auth/sign-up").send(user);
        const loginRes = await request(app).post("/auth/sign-in").send({
            email: user.email,
            password: user.password,
        });
        token = loginRes.body.tokens.accessToken;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should return procedure by id", async () => {
        const createdProcedure = await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        const res = await request(app).get(`/procedures/${createdProcedure.body._id}`).set("Authorization", `Bearer ${token}`);

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

    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        await request(app).post("/auth/sign-up").send(user);
        const loginRes = await request(app).post("/auth/sign-in").send({
            email: user.email,
            password: user.password,
        });
        token = loginRes.body.tokens.accessToken;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should return procedure by id", async () => {
        const createdProcedure = await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        const res = await request(app).patch(`/procedures/${createdProcedure.body._id}`).set("Authorization", `Bearer ${token}`).send(procedureMain);

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
});

describe("DELETE by id /procedures", () => {
    let token: string;

    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        await request(app).post("/auth/sign-up").send(user);
        const loginRes = await request(app).post("/auth/sign-in").send({
            email: user.email,
            password: user.password,
        });
        token = loginRes.body.tokens.accessToken;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should delete procedure by id", async () => {
        const createdProcedure = await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        const res = await request(app).delete(`/procedures/${createdProcedure.body._id}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(204);
    });

    it("should return error when procedure with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/procedures/${fakeId}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Procedure with such id ${fakeId} not found!`);
    });
});