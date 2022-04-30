import { ITokenRepository } from '@digichanges/shared-experience';
import RefreshTokenPayload from '../Payloads/RefreshTokenPayload';
import IUserRepository from '../../../User/Infrastructure/Repositories/IUserRepository';
import TokenFactory from '../../../Shared/Factories/TokenFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import SetTokenBlacklistUseCase from './SetTokenBlacklistUseCase';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import ITokenDomain from '../Entities/ITokenDomain';
import IToken from '../Models/IToken';
import AuthService from '../Services/AuthService';

class RefreshTokenUseCase
{
    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    @containerFactory(REPOSITORIES.ITokenRepository)
    private readonly tokenRepository: ITokenRepository<ITokenDomain>;

    private readonly authService = new AuthService();

    private readonly tokenFactory = new TokenFactory();

    async handle(payload: RefreshTokenPayload): Promise<IToken>
    {
        const tokenDecode = this.authService.decodeToken(payload.refreshToken, false);

        const rut = tokenDecode.rut;
        const tokenId = tokenDecode.id;

        const user = await this.repository.getOneByRut(rut);
        const token: ITokenDomain = await this.tokenRepository.getOne(tokenId);

        const useCase = new SetTokenBlacklistUseCase();
        await useCase.handle(token);

        return await this.tokenFactory.createToken(user);
    }
}

export default RefreshTokenUseCase;
