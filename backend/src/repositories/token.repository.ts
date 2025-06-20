import { IToken, ITokenModel, ITokenPair } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
    public create = (dto: ITokenModel): Promise<ITokenPair> => {
        return Token.create(dto);
    };

    public findByParams = (params: Partial<IToken>): Promise<IToken> => {
        return Token.findOne(params);
    };
}

export const tokenRepository = new TokenRepository();
