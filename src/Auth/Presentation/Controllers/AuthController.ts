import LoginUseCase from '../../Domain/UseCases/LoginUseCase';
import ChangeForgotPasswordUseCase from '../../Domain/UseCases/ChangeForgotPasswordUseCase';
import ForgotPasswordUseCase from '../../Domain/UseCases/ForgotPasswordUseCase';
import RefreshTokenUseCase from '../../Domain/UseCases/RefreshTokenUseCase';
import PermissionUseCase from '../../Domain/UseCases/PermissionUseCase';
import SyncRolesPermissionUseCase from '../../Domain/UseCases/SyncRolesPermissionUseCase';

import ValidatorRequest from '../../../App/Presentation/Shared/ValidatorRequest';
import ChangeForgotPasswordPayload from '../../Domain/Payloads/ChangeForgotPasswordPayload';
import AuthPayload from '../../Domain/Payloads/AuthPayload';
import RefreshTokenPayload from '../../Domain/Payloads/RefreshTokenPayload';
import ForgotPasswordPayload from '../../Domain/Payloads/ForgotPasswordPayload';
import LogoutUseCase from '../../Domain/UseCases/LogoutUseCase';
import ITokenDecode from '../../../Shared/InterfaceAdapters/ITokenDecode';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import UpdateMeUseCase from '../../Domain/UseCases/UpdateMeUseCase';
import VerifyYourAccountPayload from '../../Domain/Payloads/VerifyYourAccountPayload';
import VerifyYourAccountUseCase from '../../Domain/UseCases/VerifyYourAccountUseCase';
import IToken from '../../Domain/Models/IToken';
import ILocaleMessage from '../../../App/InterfaceAdapters/ILocaleMessage';
import IGroupPermission from '../../../Config/IGroupPermission';
import UpdateMePayload from '../../Domain/Payloads/UpdateMePayload';
import ChangeMyPasswordPayload from '../../Domain/Payloads/ChangeMyPasswordPayload';
import ChangeMyPasswordUseCase from '../../Domain/UseCases/ChangeMyPasswordUseCase';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';
import { ILogListConfig } from '../../../Log/Infrastructure/Repositories/ILogRepository';
import ListLogsUseCase from '../../../Log/Domain/UseCases/ListLogsUseCase';
import SetMainPicturePayload from '../../../User/Domain/Payloads/SetMainPicturePayload';
import SetMainPictureUseCase from '../../Domain/UseCases/SetMainPictureUseCase';

class AuthController
{
    public async login(request: AuthPayload): Promise<IToken>
    {
        await ValidatorRequest.handle(request);

        const useCase = new LoginUseCase();
        return await useCase.handle(request);
    }

    public async updateMe(request: UpdateMePayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new UpdateMeUseCase();
        return await useCase.handle(request, authUser);
    }

    public async setMyMainPicture(request: SetMainPicturePayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new SetMainPictureUseCase();
        return await useCase.handle(request, authUser);
    }

    public async logout(refreshTokenRequest: RefreshTokenPayload, tokenDecode: ITokenDecode,  authUser: IUserDomain): Promise<ILocaleMessage>
    {
        const useCase = new LogoutUseCase();
        return await useCase.handle(refreshTokenRequest, tokenDecode, authUser);
    }

    public async refreshToken(request: RefreshTokenPayload): Promise<IToken>
    {
        await ValidatorRequest.handle(request);

        const useCase = new RefreshTokenUseCase();
        return await useCase.handle(request);
    }

    public async changeMyPassword(request: ChangeMyPasswordPayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new ChangeMyPasswordUseCase();
        return await useCase.handle(request, authUser);
    }

    public async forgotPassword(request: ForgotPasswordPayload): Promise<ILocaleMessage>
    {
        await ValidatorRequest.handle(request);

        const useCase = new ForgotPasswordUseCase();
        return await useCase.handle(request);
    }

    public async changeForgotPassword(request: ChangeForgotPasswordPayload)
    {
        await ValidatorRequest.handle(request);

        const useCase = new ChangeForgotPasswordUseCase();
        return await useCase.handle(request);
    }

    public async verifyYourAccount(request: VerifyYourAccountPayload): Promise<ILocaleMessage>
    {
        await ValidatorRequest.handle(request);

        const useCase = new VerifyYourAccountUseCase();
        return await useCase.handle(request);
    }

    public permissions(): IGroupPermission[]
    {
        const useCase = new PermissionUseCase();
        return useCase.handle();
    }

    public syncRolesPermissions(): string[]
    {
        const useCase = new SyncRolesPermissionUseCase();
        return useCase.handle();
    }

    public async logs(request: ICriteria, config: ILogListConfig): Promise<IPaginator>
    {
        await ValidatorRequest.handle(request);

        const useCase = new ListLogsUseCase();
        return await useCase.handle(request, config);
    }
}

export default AuthController;
