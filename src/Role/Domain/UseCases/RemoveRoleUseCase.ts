import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import IRoleDomain from '../Entities/IRoleDomain';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IRoleRepository from '../../Infrastructure/Repositories/IRoleRepository';
import IUserDomain from 'User/Domain/Entities/IUserDomain';
import Logger from '../../../Log/Domain/Services/Logger';
import LogRoleTransformer from '../../../Log/Presentation/Transformers/LogRoleTransformer';
import Role from '../Entities/Role';

class RemoveRoleUseCase
{
    private static readonly REMOVED_ROLE = 'removedRole';

    @containerFactory(REPOSITORIES.IRoleRepository)
    private readonly repository: IRoleRepository;

    async handle({ id }: IdPayload, authUser: IUserDomain): Promise<IRoleDomain>
    {
        const role = await this.repository.delete(id);

        void await Logger.remove({
            type: Role.name,
            entity: Role.name,
            entityId: role.getId(),
            removeEntity: role,
            transformer: new LogRoleTransformer(),
            metadata: {
                action: RemoveRoleUseCase.REMOVED_ROLE
            },
            authUser
        });

        return role;
    }
}

export default RemoveRoleUseCase;
