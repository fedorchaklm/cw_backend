import request from "supertest";
import app, { startServer, stopServer } from "../../main";
import mongoose from "mongoose";
import { RoleEnum } from "../../enums/role.enum";
import { User } from "../../models/user.model";
import bcrypt from "bcrypt";
import { IProcedureCreateDTO } from "../../interfaces/procedure.interface";
import { IDoctorCreateDTO, IDoctorUpdateDTO } from "../../interfaces/doctor.interface";

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

const procedure: IProcedureCreateDTO = {
    name: "some procedure",
};

const doctor: IDoctorCreateDTO = {
    firstName: "Doctor",
    lastName: "Smith",
    email: "hgsjdh@gmail.com",
    phone: "0661245782",
    procedures: [],
};

const doctorDen: IDoctorCreateDTO = {
    firstName: "Doen",
    lastName: "Browm",
    email: "brown@gmail.com",
    phone: "0661245782",
    procedures: [],
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

const createDoctor = (doctor: IDoctorCreateDTO, adminToken: string) => addToken(request(app).post("/doctors"), adminToken).send(doctor);
const createProcedure = (procedure: IProcedureCreateDTO, adminToken: string) => addToken(request(app).post("/procedures"), adminToken).send(procedure);
const getDoctors = (token: string) => addToken(request(app).get("/doctors"), token);
const getDoctorById = (id: string, token: string) => addToken(request(app).get(`/doctors/${id}`).set("Authorization", `Bearer ${token}`), token);
const updateDoctorById = (id: string, doctor: IDoctorUpdateDTO, adminToken: string) => addToken(request(app).patch(`/doctors/${id}`), adminToken).send(doctor);
const deleteDoctorById = (id: string, token: string) => addToken(request(app).delete(`/doctors/${id}`).set("Authorization", `Bearer ${token}`), token);

describe("POST /doctors", () => {

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

    it("should create a new doctor", async () => {
        const adminToken = await getAdminToken();
        const res = await createDoctor(doctor, adminToken);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            _id: expect.any(String),
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            email: doctor.email,
            phone: doctor.phone,
            procedures: [],
        });
    });

    it("should return error when doctor with such email is already exists", async () => {
        const adminToken = await getAdminToken();
        await createDoctor(doctor, adminToken);
        const res = await createDoctor(doctor, adminToken);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe("Doctor is already exists");
    });

    it("should return error not permitted", async () => {
        const userToken = await getUserToken();
        const res = await createDoctor(doctor, userToken);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});

describe("GET all /doctors", () => {

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

    it("should return two doctors", async () => {
        const adminToken = await getAdminToken();
        const createdDoctor = await createDoctor(doctor, adminToken);
        const createdDoctorDen = await createDoctor(doctorDen, adminToken);
        const createdProcedure = await createProcedure(procedure, adminToken);
        await updateDoctorById(createdDoctor.body._id, { procedures: [createdProcedure.body._id] }, adminToken);
        const res = await getDoctors(adminToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toEqual([
            {
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                email: doctor.email,
                phone: doctor.phone,
                procedures: [expect.objectContaining({
                    _id: createdProcedure.body._id,
                    name: createdProcedure.body.name,
                })],
                _id: createdDoctor.body._id,
            },
            {
                firstName: doctorDen.firstName,
                lastName: doctorDen.lastName,
                email: doctorDen.email,
                phone: doctorDen.phone,
                procedures: [],
                _id: createdDoctorDen.body._id,
            },
        ]);
    });
});

describe("GET by id /doctors", () => {

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

    it("should return doctor by id", async () => {
        const adminToken = await getAdminToken();
        const createdDoctor = await createDoctor(doctor, adminToken);
        const createdProcedure = await createProcedure(procedure, adminToken);
        await updateDoctorById(createdDoctor.body._id, { procedures: [createdProcedure.body._id] }, adminToken);
        const res = await getDoctorById(createdDoctor.body._id, adminToken);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            _id: createdDoctor.body._id,
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            email: doctor.email,
            phone: doctor.phone,
            procedures: [expect.objectContaining({
                _id: createdProcedure.body._id,
                name: createdProcedure.body.name,
            })],
        });
    });

    it("should return error when doctor with such id not found", async () => {
        const adminToken = await getAdminToken();
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res = await getDoctorById(fakeId, adminToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Doctor with such id ${fakeId} not found!`);
    });
});

describe("PATCH by id /doctors", () => {

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

    it("should update doctor by id", async () => {
        const adminToken = await getAdminToken();
        const createdDoctor = await createDoctor(doctor, adminToken);
        const res = await updateDoctorById(createdDoctor.body._id, { firstName: doctorDen.firstName }, adminToken);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            _id: createdDoctor.body._id,
            firstName: doctorDen.firstName,
            lastName: doctor.lastName,
            email: doctor.email,
            phone: doctor.phone,
            procedures: [],
        });
    });

    it("should return error when doctor with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const adminToken = await getAdminToken();
        const res = await updateDoctorById(fakeId, doctor, adminToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Doctor with such id ${fakeId} not found!`);
    });

    it("should return error not permitted", async () => {
        const adminToken = await getAdminToken();
        const createdDoctor = await createDoctor(doctor, adminToken);
        const userToken = await getUserToken();
        const res = await updateDoctorById(createdDoctor.body._id, { firstName: doctorDen.firstName }, userToken);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});

describe("DELETE by id /doctors", () => {

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

    it("should delete doctor by id", async () => {
        const adminToken = await getAdminToken();
        const createdDoctor = await createDoctor(doctor, adminToken);
        const res = await deleteDoctorById(createdDoctor.body._id, adminToken);

        expect(res.statusCode).toBe(204);
    });

    it("should return error when doctor with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const adminToken = await getAdminToken();
        const res = await deleteDoctorById(fakeId, adminToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Doctor with such id ${fakeId} not found!`);
    });

    it("should return error not permitted", async () => {
        const adminToken = await getAdminToken();
        const createdDoctor = await createDoctor(doctor, adminToken);
        const userToken = await getUserToken();
        const res = await deleteDoctorById(createdDoctor.body._id, userToken);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});