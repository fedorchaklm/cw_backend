import request from "supertest";
import app, { startServer, stopServer } from "../../main";
import mongoose from "mongoose";
import { RoleEnum } from "../../enums/role.enum";
import { User } from "../../models/user.model";
import bcrypt from "bcrypt";
import { IProcedureCreateDTO } from "../../interfaces/procedure.interface";

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

const addToken = (req, token: string) => req.set("Authorization", `Bearer ${token}`);

const getAdminToken = async () => {
    await User.create({
        ...admin,
        password: await bcrypt.hash(admin.password, 10),
    });
    const res = await request(app).post("/auth/sign-in").send({
        email: admin.email,
        password: admin.password,
    });
    return res.body.tokens.accessToken;
};

const getUserToken = async () => {
    await request(app).post("/auth/sign-up").send(user);
    const loginRes = await request(app).post("/auth/sign-in").send({
        email: user.email,
        password: user.password,
    });
    return loginRes.body.tokens.accessToken;
};

const createProcedure = (procedure: IProcedureCreateDTO, adminToken: string) => addToken(request(app).post("/procedures"), adminToken).send(procedure);
const getProcedures = (token: string) => addToken(request(app).get("/procedures"), token);
const getProceduresByName = (name: string, token: string) => addToken(request(app).get(`/procedures?name=${name}`), token);
const getProcedureById = (id: string, token: string) => addToken(request(app).get(`/procedures/${id}`).set("Authorization", `Bearer ${token}`), token);
const updateProcedureById = (id: string, procedure: IProcedureCreateDTO, adminToken: string) => addToken(request(app).patch(`/procedures/${id}`), adminToken).send(procedure);
const deleteProcedureById = (id: string, token: string) => addToken(request(app).delete(`/procedures/${id}`).set("Authorization", `Bearer ${token}`), token);

describe("POST /procedures", () => {

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

    it("should create a new procedure", async () => {
        const adminToken = await getAdminToken();
        const res = await createProcedure(procedure, adminToken);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: procedure.name,
        }));
    });

    it("should return error when such procedure is already exists", async () => {
        const adminToken = await getAdminToken();
        await createProcedure(procedure, adminToken);
        const res = await createProcedure(procedure, adminToken);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe(`Procedure ${procedure.name} already exists!`);
    });

    it("should return error not permitted", async () => {
        const userToken = await getUserToken();
        const res = await createProcedure(procedure, userToken);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});

describe("GET all /procedures", () => {

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

    it("should return all procedures", async () => {
        const adminToken = await getAdminToken();
        await createProcedure(procedure, adminToken);
        await createProcedure(procedureMain, adminToken);
        const res = await getProcedures(adminToken);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data[0]).toHaveProperty("name");
    });

    it("should return all procedures such have word some ", async () => {
        const adminToken = await getAdminToken();
        await createProcedure(procedure, adminToken);
        await createProcedure(procedureMain, adminToken);
        const res = await getProceduresByName("some", adminToken);

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

    it("should return procedure by id", async () => {
        const adminToken = await getAdminToken();
        const createdProcedure = await createProcedure(procedure, adminToken);
        const res = await getProcedureById(createdProcedure.body._id, adminToken);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            _id: createdProcedure.body._id,
            name: procedure.name,
        }));
    });

    it("should return error when procedure with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const adminToken = await getAdminToken();
        const res = await getProcedureById(fakeId, adminToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Procedure with such id ${fakeId} not found!`);
    });
});

describe("PATCH update by id /procedures", () => {

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

    it("should return updated procedure by id", async () => {
        const adminToken = await getAdminToken();
        const createdProcedure = await createProcedure(procedure, adminToken);
        const res = await updateProcedureById(createdProcedure.body._id, { name: procedureMain.name }, adminToken);
        console.log({ res: res.body });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            _id: createdProcedure.body._id,
            name: procedureMain.name,
        }));
    });

    it("should return error when procedure with such id not found", async () => {
        const adminToken = await getAdminToken();
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res = await updateProcedureById(fakeId, { name: procedureMain.name }, adminToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Procedure with such id ${fakeId} not found!`);
    });

    it("should return error not permitted", async () => {
        const adminToken = await getAdminToken();
        const createdProcedure = await createProcedure(procedure, adminToken);
        const userToken = await getUserToken();
        const res = await updateProcedureById(createdProcedure.body._id, { name: procedureMain.name }, userToken);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});

describe("DELETE by id /procedures", () => {

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

    it("should delete procedure by id", async () => {
        const adminToken = await getAdminToken();
        const createdProcedure = await createProcedure(procedure, adminToken);
        const res = await deleteProcedureById(createdProcedure.body._id, adminToken);

        expect(res.statusCode).toBe(204);
    });

    it("should return error when procedure with such id not found", async () => {
        const adminToken = await getAdminToken();
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res = await deleteProcedureById(fakeId, adminToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Procedure with such id ${fakeId} not found!`);
    });

    it("should return error not permitted", async () => {
        const adminToken = await getAdminToken();
        const createdProcedure = await createProcedure(procedure, adminToken);
        const userToken = await getUserToken();
        const res = await deleteProcedureById(createdProcedure.body._id, userToken);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});