import RoleUpdatePayload from '../Payloads/RoleUpdatePayload';
import IRoleDomain from '../Entities/IRoleDomain';
import RoleService from '../Services/RoleService';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IRoleRepository from '../../Infrastructure/Repositories/IRoleRepository';
import IUserDomain from 'User/Domain/Entities/IUserDomain';
import Logger from '../../../Log/Domain/Services/Logger';
import Role from '../Entities/Role';
import LogRoleTransformer from '../../../Log/Presentation/Transformers/LogRoleTransformer';

class UpdateRoleUseCase
{
    private static readonly UPDATED_ROLE = 'updatedRole';

    @containerFactory(REPOSITORIES.IRoleRepository)
    private repository: IRoleRepository;

    private roleService = new RoleService();

    async handle(payload: RoleUpdatePayload, authUser: IUserDomain): Promise<IRoleDomain>
    {
        const id = payload.id;
        let role: IRoleDomain = await this.repository.getOne(id);
        const oldRole = Logger.copy<IRoleDomain>(role);

        role.build(payload);

        void await this.roleService.validate(role);

        role = await this.repository.update(role);

        void await Logger.update({
            type: Role.name,
            entity: Role.name,
            entityId: role.getId(),
            newEntity: role,
            oldEntity: oldRole,
            transformer: new LogRoleTransformer(),
            metadata: {
                action: UpdateRoleUseCase.UPDATED_ROLE
            },
            authUser
        });

        return role;
    }
}

export default UpdateRoleUseCase;
