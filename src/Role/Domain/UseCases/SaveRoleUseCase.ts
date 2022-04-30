import RoleRepPayload from '../Payloads/RoleRepPayload';
import IRoleDomain from '../Entities/IRoleDomain';
import RoleService from '../Services/RoleService';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IRoleRepository from '../../Infrastructure/Repositories/IRoleRepository';
import Role from '../Entities/Role';
import IUserDomain from 'User/Domain/Entities/IUserDomain';
import Logger from '../../../Log/Domain/Services/Logger';

class SaveRoleUseCase
{
    private static readonly CREATED_ROLE = 'createdRole';

    @containerFactory(REPOSITORIES.IRoleRepository)
    private readonly repository: IRoleRepository;

    private readonly roleService = new RoleService();

    async handle(payload: RoleRepPayload, authUser: IUserDomain): Promise<IRoleDomain>
    {
        let role: IRoleDomain = new Role(payload);

        await this.roleService.validate(role);

        role = await this.repository.save(role);

        void await Logger.save({
            type: Role.name,
            entity: Role.name,
            entityId: role.getId(),
            metadata: {
                action: SaveRoleUseCase.CREATED_ROLE
            },
            authUser
        });

        return role;
    }
}

export default SaveRoleUseCase;
