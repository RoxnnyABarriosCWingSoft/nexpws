import { ITokenRepository } from '@digichanges/shared-experience';
import ILocaleMessage from '../../../App/InterfaceAdapters/ILocaleMessage';
import Locales from '../../../App/Presentation/Shared/Locales';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import ITokenDecode from '../../../Shared/InterfaceAdapters/ITokenDecode';
import ITokenDomain from '../Entities/ITokenDomain';
import RefreshTokenPayload from '../Payloads/RefreshTokenPayload';
import AuthService from '../Services/AuthService';
import SetTokenBlacklistUseCase from './SetTokenBlacklistUseCase';
import Logger from '../../../Log/Domain/Services/Logger';
import User from '../../../User/Domain/Entities/User';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';

class LogoutUseCase
{
    private static readonly LOGOUT = 'logout';

    @containerFactory(REPOSITORIES.ITokenRepository)
    private readonly tokenRepository: ITokenRepository<ITokenDomain>;

    private readonly authService = new AuthService();

    async handle(payload: RefreshTokenPayload, tokenDecode: ITokenDecode, authUser: IUserDomain): Promise<ILocaleMessage>
    {
        const setTokenBlackListUseCase = new SetTokenBlacklistUseCase();

        const tokenId = tokenDecode.id;

        const token: ITokenDomain = await this.tokenRepository.getOne(tokenId);

        await setTokenBlackListUseCase.handle(token);

        if (payload.refreshToken)
        {
            const refreshTokenDecode = this.authService.decodeToken(payload.refreshToken, false);

            const refreshToken: ITokenDomain = await this.tokenRepository.getOne(refreshTokenDecode.id);

            await setTokenBlackListUseCase.handle(refreshToken);
        }

        void await Logger.logout({
            type: User.name,
            entity: User.name,
            entityId: authUser.getId(),
            metadata: {
                action: LogoutUseCase.LOGOUT
            },
            authUser
        });

        const locales = Locales.getInstance().getLocales();
        const key = 'auth.domain.messages.logout';

        return { message: locales.__(key), messageCode: key };
    }
}

export default LogoutUseCase;
