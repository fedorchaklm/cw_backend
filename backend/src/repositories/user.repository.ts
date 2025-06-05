import { IUser, IUserCreateDTO } from "../interfaces/user.interface";
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
        user: Partial<IUser>,
    ): Promise<IUser | null> => {
        return User.findByIdAndUpdate(id, user, { new: true });
    };

    // public partialUpdateById = (
    //     id: string,
    //     user: Partial<IUser>,
    // ): Promise<IUser | null> => {
    //     return User.findByIdAndUpdate(id, user, { new: true });
    // };
    public blockUser = (id: string): Promise<IUser | null> => {
        return User.findByIdAndUpdate(id, { isActive: false }, { new: true });
    };

    public unblockUser = (id: string): Promise<IUser | null> => {
        return User.findByIdAndUpdate(id, { isActive: true }, { new: true });
    };

    public deleteById = (id: string): Promise<IUser | null> => {
        return User.findByIdAndDelete(id);
    };

    public findByEmail = (email: string): Promise<IUser | null> => {
        return User.findOne({ email });
    };
}

export const userRepository = new UserRepository();
