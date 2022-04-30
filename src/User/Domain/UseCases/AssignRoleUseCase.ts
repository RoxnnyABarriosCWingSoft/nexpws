import UserAssignRolePayload from '../Payloads/UserAssignRolePayload';
import IUserDomain from '../Entities/IUserDomain';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IUserRepository from '../../Infrastructure/Repositories/IUserRepository';
import IRoleRepository from '../../../Role/Infrastructure/Repositories/IRoleRepository';
import Logger from '../../../Log/Domain/Services/Logger';
import User from '../Entities/User';
import LogUserTransformer from '../../../Log/Presentation/Transformers/LogUserTransformer';

class AssignRoleUseCase
{
    private static readonly ASSIGN_USER_ROLES = 'assignUserRoles';

    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    @containerFactory(REPOSITORIES.IRoleRepository)
    private readonly roleRepository: IRoleRepository;

    async handle(payload: UserAssignRolePayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        const { id } = payload;
        let user: IUserDomain = await this.repository.getOne(id);
        const oldUser = Logger.copy<IUserDomain>(user);

        user.clearRoles();

        const roles = await this.roleRepository.getInBy({ _id: payload.rolesId });

        roles.forEach(role => user.setRole(role));

        user = await this.repository.update(user);

        void await Logger.update({
            type: User.name,
            entity: User.name,
            entityId: user.getId(),
            newEntity: user,
            oldEntity: oldUser,
            transformer: new LogUserTransformer(),
            metadata: {
                action: AssignRoleUseCase.ASSIGN_USER_ROLES
            },
            authUser
        });

        return user;
    }
}

export default AssignRoleUseCase;
