export interface IDoctor {
    _id: string;
    name: string;
    surname: string;
    email: string;
    age: number;
    occupation: string;
    createdAt: Date;
    updatedAt: Date;
}

export type IDoctorDTO = Pick<IDoctor, "name" | "email">;
