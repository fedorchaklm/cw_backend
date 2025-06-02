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

const clinic = {
    name: "Lvyv Hospital",
    address: "ghsdkhn 3",
    phone: "0661245782",
    email: "hgsjdh@gmail.com",
    description: "fjgkhj fghbr fgfhfh",
};

const doctor = {
    name: "Doctor",
    surname: "Smith",
    email: "hgsjdh@gmail.com",
    phone: "0661245782",
    age: 45,
    experience: 5,
    procedures: [],
    clinics: [],
};

describe("POST /doctors", () => {
    let token: string;
    let createdProcedure;
    let createdClinic;

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

        doctor.procedures = [];
        doctor.clinics = [];

        createdProcedure = await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        doctor.procedures.push(createdProcedure.body._id);
        createdClinic = await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);
        doctor.clinics.push(createdClinic.body._id);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should create a new doctor", async () => {
        const res = await request(app).post("/doctors").set("Authorization", `Bearer ${token}`).send(doctor);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            _id: expect.any(String),
            name: doctor.name,
            surname: doctor.surname,
            email: doctor.email,
            phone: doctor.phone,
            age: doctor.age,
            experience: doctor.experience,
            clinics: expect.arrayContaining([createdClinic.body._id]),
            procedures: expect.arrayContaining([createdProcedure.body._id]),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should return error when doctor with such email is already exists", async () => {
        await request(app).post("/doctors").set("Authorization", `Bearer ${token}`).send(doctor);
        const res = await request(app).post("/doctors").set("Authorization", `Bearer ${token}`).send(doctor);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Doctor is already exists');
    });
});

describe("GET /doctors", () => {
    let token: string;
    let createdProcedure;
    let createdClinic;

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

        doctor.procedures = [];
        doctor.clinics = [];

        createdProcedure = await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        doctor.procedures.push(createdProcedure.body._id);
        createdClinic = await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);
        doctor.clinics.push(createdClinic.body._id);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should return all doctors", async () => {
        const createdDoctor = await request(app).post("/doctors").set("Authorization", `Bearer ${token}`).send(doctor);
        console.log({doctor: createdDoctor.body});
        const res = await request(app).get("/doctors").set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toEqual([
            {
                name: doctor.name,
                surname: doctor.surname,
                email: doctor.email,
                phone: doctor.phone,
                age: doctor.age,
                experience: doctor.experience,
                procedures: expect.arrayContaining([expect.objectContaining({
                    _id: createdProcedure.body._id,
                    name: createdProcedure.body.name,
                })]),
                clinics: expect.arrayContaining([expect.objectContaining({
                    name: createdClinic.body.name,
                    address: createdClinic.body.address,
                    phone:  createdClinic.body.phone,
                    email:  createdClinic.body.email,
                    procedures: expect.arrayContaining([createdProcedure.body._id]),
                    doctors: expect.arrayContaining([createdDoctor.body._id]),
                    description:  createdClinic.body.description,
                    _id: createdClinic.body._id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                })]),
                _id: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }
        ]);
    });
});

describe("GET by id /doctors", () => {
    let token: string;
    let createdProcedure;
    let createdClinic;

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

        doctor.procedures = [];
        doctor.clinics = [];

        createdProcedure = await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        doctor.procedures.push(createdProcedure.body._id);
        createdClinic = await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);
        doctor.clinics.push(createdClinic.body._id);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should return doctor by id", async () => {
        const createdDoctor = await request(app).post("/doctors").set("Authorization", `Bearer ${token}`).send(doctor);
        const res = await request(app).get(`/doctors/${createdDoctor.body._id}`).set("Authorization", `Bearer ${token}`).send(doctor);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            _id: createdDoctor.body._id,
            name: doctor.name,
            surname: doctor.surname,
            email: doctor.email,
            phone: doctor.phone,
            age: doctor.age,
            experience: doctor.experience,
            clinics: expect.arrayContaining([expect.objectContaining({
                name: createdClinic.body.name,
                address: createdClinic.body.address,
                phone:  createdClinic.body.phone,
                email:  createdClinic.body.email,
                procedures: expect.arrayContaining([createdProcedure.body._id]),
                doctors: expect.arrayContaining([createdDoctor.body._id]),
                description:  createdClinic.body.description,
                _id: createdClinic.body._id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })]),
            procedures: expect.arrayContaining([expect.objectContaining({
                _id: createdProcedure.body._id,
                name: createdProcedure.body.name,
            })]),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should return error when clinic with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/doctors/${fakeId}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Doctor with such id ${fakeId} not found!`);
    });
});

describe("PATCH by id /doctors", () => {
    let token: string;
    let createdProcedure;
    let createdClinic;

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

        doctor.procedures = [];
        doctor.clinics = [];

        createdProcedure = await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        doctor.procedures.push(createdProcedure.body._id);
        createdClinic = await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);
        doctor.clinics.push(createdClinic.body._id);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should update doctor by id", async () => {
        const createdDoctor = await request(app).post("/doctors").set("Authorization", `Bearer ${token}`).send(doctor);
        const res = await request(app).patch(`/doctors/${createdDoctor.body._id}`).set("Authorization", `Bearer ${token}`).send({name: "Another name" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            _id: createdDoctor.body._id,
            name: "Another name",
            surname: doctor.surname,
            email: doctor.email,
            phone: doctor.phone,
            age: doctor.age,
            experience: doctor.experience,
            clinics: expect.arrayContaining([expect.objectContaining({
                name: createdClinic.body.name,
                address: createdClinic.body.address,
                phone:  createdClinic.body.phone,
                email:  createdClinic.body.email,
                procedures: expect.arrayContaining([createdProcedure.body._id]),
                doctors: expect.arrayContaining([createdDoctor.body._id]),
                description:  createdClinic.body.description,
                _id: createdClinic.body._id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })]),
            procedures: expect.arrayContaining([expect.objectContaining({
                _id: createdProcedure.body._id,
                name: createdProcedure.body.name,
            })]),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should return error when doctor with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).patch(`/doctors/${fakeId}`).set("Authorization", `Bearer ${token}`).send(doctor);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Doctor with such id ${fakeId} not found!`);
    });
});

describe("DELETE by id /doctors", () => {
    let token: string;
    let createdProcedure;
    let createdClinic;

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

        doctor.procedures = [];
        doctor.clinics = [];

        createdProcedure = await request(app).post("/procedures").set("Authorization", `Bearer ${token}`).send(procedure);
        doctor.procedures.push(createdProcedure.body._id);
        createdClinic = await request(app).post("/clinics").set("Authorization", `Bearer ${token}`).send(clinic);
        doctor.clinics.push(createdClinic.body._id);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await stopServer();
    });

    it("should delete doctor by id", async () => {
        const createdDoctor = await request(app).post("/doctors").set("Authorization", `Bearer ${token}`).send(doctor);
        const res = await request(app).delete(`/doctors/${createdDoctor.body._id}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(204);
    });

    it("should return error when doctor with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/doctors/${fakeId}`).set("Authorization", `Bearer ${token}`).send(doctor);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Doctor with such id ${fakeId} not found!`);
    });
});