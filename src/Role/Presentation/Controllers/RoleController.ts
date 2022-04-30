import { ICriteria, IPaginator } from '@digichanges/shared-experience';

import SaveRoleUseCase from '../../Domain/UseCases/SaveRoleUseCase';
import ListRolesUseCase from '../../Domain/UseCases/ListRolesUseCase';
import GetRoleUseCase from '../../Domain/UseCases/GetRoleUseCase';
import RemoveRoleUseCase from '../../Domain/UseCases/RemoveRoleUseCase';
import IRoleDomain from '../../Domain/Entities/IRoleDomain';
import UpdateRoleUseCase from '../../Domain/UseCases/UpdateRoleUseCase';
import ValidatorRequest from '../../../App/Presentation/Shared/ValidatorRequest';
import RoleRepPayload from '../../Domain/Payloads/RoleRepPayload';
import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import RoleUpdatePayload from '../../Domain/Payloads/RoleUpdatePayload';
import IUserDomain from 'User/Domain/Entities/IUserDomain';

class RoleController
{
    public async save(request: RoleRepPayload, authUser: IUserDomain): Promise<IRoleDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new SaveRoleUseCase();
        return await useCase.handle(request, authUser);
    }

    public async list(request: ICriteria): Promise<IPaginator>
    {
        await ValidatorRequest.handle(request);

        const useCase = new ListRolesUseCase();
        return await useCase.handle(request);
    }

    public async getOne(request: IdPayload): Promise<IRoleDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new GetRoleUseCase();
        return await useCase.handle(request);
    }

    public async update(request: RoleUpdatePayload, authUser: IUserDomain): Promise<IRoleDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new UpdateRoleUseCase();
        return await useCase.handle(request, authUser);
    }

    public async remove(request: IdPayload, authUser: IUserDomain): Promise<IRoleDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new RemoveRoleUseCase();
        return await useCase.handle(request, authUser);
    }
}

export default RoleController;
