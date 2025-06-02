import request from "supertest";
import app, { startServer, stopServer } from "../../main";
import mongoose from "mongoose";

const user = {
    email: "sun.jones.2@gmail.com",
    name: "Mary",
    surname: "Smith",
    password: "a2A!abcd",
};

const clinic = {
    name: "Lvyv Hospital",
    address: "ghsdkhn 3",
    phone: "0661245782",
    email: "hgsjdh@gmail.com",
    description: "fjgkhj fghbr fgfhfh",
};

const mainClinic = {
    name: "Kyiv Hospital",
    address: "ghsdkhn 3",
    phone: "0661245742",
    email: "main_kyivh@gmail.com",
    description: "fjgkhj fghbr fgfhfh",
};

describe("POST /clinics", () => {
    let token: string;

    beforeAll(async () => {
        await startServer();
    });

    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
        await request(app).post("/auth/sign-up").send(user);
        // await request(app).patch(`/users/${createdUser.body._id}/unblock`);
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

    it("should create a new clinic", async () => {
        const res = await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: clinic.name,
            address: clinic.address,
            phone: clinic.phone,
            email: clinic.email,
            description: clinic.description,
        }));
    });

    it("should return error when such clinic is already exists", async () => {
        await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);
        const res = await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe(`Clinic ${clinic.name} already exists!`);
    });
});

describe("GET /clinics", () => {
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

    it("should return all clinics", async () => {
        await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);
        await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(mainClinic);
        const res = await request(app).get("/clinics").set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.data).toEqual(expect.arrayContaining([
            {
                name: clinic.name,
                address: clinic.address,
                phone: clinic.phone,
                email: clinic.email,
                procedures: [],
                doctors: [],
                description: clinic.description,
                _id: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            },
            {
                name: mainClinic.name,
                address: mainClinic.address,
                phone: mainClinic.phone,
                email: mainClinic.email,
                procedures: [],
                doctors: [],
                description: mainClinic.description,
                _id: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }
        ]));
    });
});

describe("GET by id /clinics", () => {
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

    it("should return clinic by id", async () => {
        const createdClinic = await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);
        const res = await request(app).get(`/clinics/${createdClinic.body._id}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            name: clinic.name,
            address: clinic.address,
            phone: clinic.phone,
            email: clinic.email,
            procedures: [],
            doctors: [],
            description: clinic.description,
            _id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should return error when clinic with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/clinics/${fakeId}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Clinic with such id ${fakeId} not found!`);
    });
});

describe("PATCH /clinics", () => {
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

    it("should return clinic by id", async () => {
        const createdClinic = await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);
        const res = await request(app).patch(`/clinics/${createdClinic.body._id}`).set("Authorization", `Bearer ${token}`).send(mainClinic);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            name: mainClinic.name,
            address: mainClinic.address,
            phone: mainClinic.phone,
            email: mainClinic.email,
            procedures: [],
            doctors: [],
            description: mainClinic.description,
            _id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should return error when clinic with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).patch(`/clinics/${fakeId}`).set("Authorization", `Bearer ${token}`).send(mainClinic);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Clinic with such id ${fakeId} not found!`);
    });
});

describe("DELETE /clinics", () => {
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

    it("should delete clinic by id", async () => {
        const createdClinic = await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);
        const res = await request(app).delete(`/clinics/${createdClinic.body._id}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(204);
    });

    it("should return error when clinic with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/clinics/${fakeId}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Clinic with such id ${fakeId} not found!`);
    });
});