import {
    IUser,
    IUserCreateDTO,
    IUserUpdateDTO,
} from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
    public getAll = (): Promise<Array<IUser>> => {
        return User.find();
    };

    public getById = (id: string): Promise<IUser | null> => {
        return User.findById(id);
    };

    public create = (user: IUserCreateDTO): Promise<IUser> => {
        return User.create(user);
    };

    public updateById = (
        id: string,
        user: IUserUpdateDTO,
    ): Promise<IUser | null> => {
        return User.findByIdAndUpdate(id, user, { new: true });
    };

    public deleteById = (id: string): Promise<IUser | null> => {
        return User.findByIdAndDelete(id);
    };

    public findByEmail = (email: string): Promise<IUser | null> => {
        return User.findOne({ email });
    };
}

export const userRepository = new UserRepository();
