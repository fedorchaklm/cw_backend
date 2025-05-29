import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";

class DoctorRepository {
    public getAll(): Promise<Array<IDoctor>> {
        return Doctor.find();
    }

    public getById(id: string): Promise<IDoctor> {
        return Doctor.findById(id);
    }

    public create(doctor: IDoctorDTO): Promise<IDoctor> {
        return Doctor.create(doctor);
    }

    public updateById(doctorId: string, doctor: IDoctorDTO): Promise<IDoctor> {
        return Doctor.findByIdAndUpdate(doctorId, doctor, { new: true });
    }

    public deleteById(doctorId: string): Promise<IDoctor> {
        return Doctor.findByIdAndDelete(doctorId);
    }
}

export const doctorRepository = new DoctorRepository();
