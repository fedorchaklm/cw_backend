import { IDoctor, IDoctorDTO } from "../interfaces/doctor.interface";
import { doctorRepository } from "../repositories/doctor.repository";

class DoctorService {
    public getAll(): Promise<Array<IDoctor>> {
        return doctorRepository.getAll();
    }

    public getById(id: string): Promise<IDoctor> {
        return doctorRepository.getById(id);
    }

    public create(doctor: IDoctorDTO): Promise<IDoctor> {
        return doctorRepository.create(doctor);
    }

    public updateById(doctorId: string, doctor: IDoctorDTO): Promise<IDoctor> {
        return doctorRepository.updateById(doctorId, doctor);
    }

    public deleteById(doctorId: string): Promise<IDoctor> {
        return doctorRepository.deleteById(doctorId);
    }
}

export const doctorService = new DoctorService();
