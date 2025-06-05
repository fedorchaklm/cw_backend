import request from "supertest";
import app, { startServer, stopServer } from "../../main";
import mongoose from "mongoose";
import { User } from "../../models/user.model";
import bcrypt from "bcrypt";
import { IClinicCreateDTO, IClinicUpdateDTO } from "../../interfaces/clinic.interface";
import { RoleEnum } from "../../enums/role.enum";
import { IDoctorCreateDTO } from "../../interfaces/doctor.interface";

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
    isActive: "true",
    role: RoleEnum.ADMIN,
};

const clinic = {
    name: "Lvyv Hospital",
    doctors: [],
};

const mainClinic = {
    name: "Kyiv Hospital",
    doctors: [],
};

// const procedure: IProcedureCreateDTO = {
//     name: "some procedure",
// };

const doctor: IDoctorCreateDTO = {
    firstName: "Doctor",
    lastName: "Smith",
    email: "hgsjdh@gmail.com",
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
    const registerUser = await request(app).post("/auth/sign-up").send(user);
    await User.findByIdAndUpdate(registerUser.body.user._id, { isActive: true });
    const loginRes = await request(app).post("/auth/sign-in").send({
        email: user.email,
        password: user.password,
    });
    return loginRes.body.tokens.accessToken;
};

const createClinic = (clinic: IClinicCreateDTO, adminToken: string) => addToken(request(app).post("/clinics"), adminToken).send(clinic);
const createDoctor = (doctor: IDoctorCreateDTO, adminToken: string) => addToken(request(app).post("/doctors"), adminToken).send(doctor);
// const createProcedure = (procedure: IProcedureCreateDTO, adminToken: string) => addToken(request(app).post("/procedures"), adminToken).send(procedure);
const getClinics = (token: string) => addToken(request(app).get("/clinics"), token);
const getClinicById = (id: string, token: string) => addToken(request(app).get(`/clinics/${id}`).set("Authorization", `Bearer ${token}`), token);
const updateClinicById = (id: string, clinic: IClinicUpdateDTO, adminToken: string) => addToken(request(app).patch(`/clinics/${id}`), adminToken).send(clinic);
const deleteClinicById = (id: string, token: string) => addToken(request(app).delete(`/clinics/${id}`).set("Authorization", `Bearer ${token}`), token);
const deleteDoctorById = (id: string, token: string) => addToken(request(app).delete(`/doctors/${id}`).set("Authorization", `Bearer ${token}`), token);

describe("POST /clinics", () => {

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

    it("should create a new clinic", async () => {
        const adminToken = await getAdminToken();
        const res = await createClinic(clinic, adminToken);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: clinic.name,
            doctors: [],
        }));
    });

    it("should return error when such clinic is already exists", async () => {
        const adminToken = await getAdminToken();
        await createClinic(clinic, adminToken);
        const res = await createClinic(clinic, adminToken);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe(`Clinic ${clinic.name} already exists!`);
    });

    it("should return error not permitted", async () => {
        const userToken = await getUserToken();
        const res = await createClinic(clinic, userToken);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});

describe("GET all /clinics", () => {

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

    it("should return all clinics", async () => {
        const adminToken = await getAdminToken();
        const createdClinic = await createClinic(clinic, adminToken);
        const createdMainClinic = await createClinic(mainClinic, adminToken);
        const res = await getClinics(adminToken);
        expect(res.statusCode).toEqual(200);
        // expect(res.body.data.length).toBe(2);
        expect(res.body.data).toEqual([
            {
                name: mainClinic.name,
                // doctors: [],
                procedures: [],
                _id: createdMainClinic.body._id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            },
            {
                name: clinic.name,
                // doctors: [],
                _id: createdClinic.body._id,
                procedures: [],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            },
        ]);
    });

    it("should return clinic after deleting doctor", async () => {
        const adminToken = await getAdminToken();
        const createdDoctor = await createDoctor(doctor, adminToken);
        const createdClinic = await createClinic({ ...clinic, doctors: [createdDoctor.body._id] }, adminToken);
        await deleteDoctorById(createdDoctor.body._id, adminToken);
        const res = await getClinics(adminToken);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toEqual([
            {
                name: clinic.name,
                // doctors: [],
                procedures: [],
                _id: createdClinic.body._id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            },
        ]);
    });
});

describe("GET by id /clinics/:id", () => {

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

    it("should return clinic by id", async () => {
        const adminToken = await getAdminToken();
        const createdClinic = await createClinic(clinic, adminToken);
        const res = await getClinicById(createdClinic.body._id, adminToken);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            name: clinic.name,
            // doctors: [],
            procedures: [],
            _id: createdClinic.body._id,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should return error when clinic with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const adminToken = await getAdminToken();
        const res = await getClinicById(fakeId, adminToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Clinic with such id ${fakeId} not found!`);
    });
});

describe("PATCH by id /clinics/:id", () => {

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

    it("should return clinic by id", async () => {
        const adminToken = await getAdminToken();
        const createdClinic = await createClinic(clinic, adminToken);
        const res = await updateClinicById(createdClinic.body._id, { name: mainClinic.name }, adminToken);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            name: mainClinic.name,
            // doctors: [],
            procedures: [],
            _id: createdClinic.body._id,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });

    it("should return error when clinic with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const adminToken = await getAdminToken();
        const res = await updateClinicById(fakeId, mainClinic, adminToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Clinic with such id ${fakeId} not found!`);
    });

    it("should return error not permitted", async () => {
        const adminToken = await getAdminToken();
        const createdClinic = await createClinic(clinic, adminToken);
        const userToken = await getUserToken();
        const res = await updateClinicById(createdClinic.body._id, { name: mainClinic.name }, userToken);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});

describe("DELETE by id /clinics/:id", () => {

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

    it("should delete clinic by id", async () => {
        const adminToken = await getAdminToken();
        const createdClinic = await createClinic(clinic, adminToken);
        const res = await deleteClinicById(createdClinic.body._id, adminToken);

        expect(res.statusCode).toBe(204);
    });

    it("should return error when clinic with such id not found", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const adminToken = await getAdminToken();
        const res = await deleteClinicById(fakeId, adminToken);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(`Clinic with such id ${fakeId} not found!`);
    });

    it("should return error not permitted", async () => {
        const adminToken = await getAdminToken();
        const createdClinic = await createClinic(clinic, adminToken);
        const userToken = await getUserToken();
        const res = await deleteClinicById(createdClinic.body._id, userToken);

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toBe("No has permissions");
    });
});