import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.error";
import {
    IUser,
    IUserCreateDTO,
    IUserUpdateDTO,
} from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
    public getAll = async (): Promise<Array<IUser> | null> => {
        return await userRepository.getAll();
    };

    public getById = async (id: string): Promise<IUser> => {
        const user = await userRepository.getById(id);
        if (user === null) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }
        return user;
    };

    public create = (user: IUserCreateDTO): Promise<IUser> => {
        return userRepository.create(user);
    };

    public updateById = async (
        id: string,
        user: IUserUpdateDTO,
    ): Promise<IUser | null> => {
        const data = await userRepository.getById(id);
        if (data === null) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }
        return await userRepository.updateById(id, user);
    };

    public deleteById = async (id: string): Promise<IUser | null> => {
        const user = await userRepository.getById(id);
        if (user === null) {
            throw new ApiError("User not found", StatusCodesEnum.NOT_FOUND);
        }
        return await userRepository.deleteById(id);
    };

    public isEmailUnique = async (email: string) => {
        const user = await userRepository.findByEmail(email);

        if (user !== null) {
            throw new ApiError(
                "User is already exists",
                StatusCodesEnum.BAD_REQUEST,
            );
        }
    };
}

export const userService = new UserService();
