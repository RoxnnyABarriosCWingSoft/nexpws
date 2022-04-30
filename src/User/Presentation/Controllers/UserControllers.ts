import { IPaginator, ICriteria } from '@digichanges/shared-experience';

import GetUserUseCase from '../../Domain/UseCases/GetUserUseCase';
import ListUsersUseCase from '../../Domain/UseCases/ListUsersUseCase';
import SaveUserUseCase from '../../Domain/UseCases/SaveUserUseCase';
import AssignRoleUseCase from '../../Domain/UseCases/AssignRoleUseCase';
import RemoveUserUseCase from '../../Domain/UseCases/RemoveUserUseCase';
import ChangeUserPasswordUseCase from '../../Domain/UseCases/ChangeUserPasswordUseCase';
import UpdateUserUseCase from '../../Domain/UseCases/UpdateUserUseCase';

import ValidatorRequest from '../../../App/Presentation/Shared/ValidatorRequest';

import IUserDomain from '../../Domain/Entities/IUserDomain';
import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import UserUpdatePayload from '../../Domain/Payloads/UserUpdatePayload';
import UserAssignRolePayload from '../../Domain/Payloads/UserAssignRolePayload';
import ChangeUserPasswordPayload from '../../Domain/Payloads/ChangeUserPasswordPayload';
import UserSavePayload from '../../Domain/Payloads/UserSavePayload';
import SetMainPictureUserPayload from '../../Domain/Payloads/SetMainPictureUserPayload';
import SetMainPictureUserUseCase from '../../Domain/UseCases/SetMainPictureUserUseCase';


class UserController
{
    public async save(request: UserSavePayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new SaveUserUseCase();
        return await useCase.handle(request, authUser);
    }

    public async list(request: ICriteria): Promise<IPaginator>
    {
        await ValidatorRequest.handle(request);

        const useCase = new ListUsersUseCase();
        return await useCase.handle(request);
    }

    public async getOne(request: IdPayload): Promise<IUserDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new GetUserUseCase();
        return await useCase.handle(request);
    }

    public async update(request: UserUpdatePayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new UpdateUserUseCase();
        return await useCase.handle(request, authUser);
    }

    public async setMainPicture(request: SetMainPictureUserPayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new SetMainPictureUserUseCase();
        return await useCase.handle(request, authUser);
    }

    public async assignRole(request: UserAssignRolePayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new AssignRoleUseCase();
        return await useCase.handle(request, authUser);
    }

    public async remove(request: IdPayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new RemoveUserUseCase();
        return await useCase.handle(request, authUser);
    }

    public async changeUserPassword(request: ChangeUserPasswordPayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new ChangeUserPasswordUseCase();
        return await useCase.handle(request, authUser);
    }
}

export default UserController;
