import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import IRoleDomain from '../Entities/IRoleDomain';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IRoleRepository from '../../Infrastructure/Repositories/IRoleRepository';

class GetRoleUseCase
{
    @containerFactory(REPOSITORIES.IRoleRepository)
    private readonly repository: IRoleRepository;

    async handle({ id }: IdPayload): Promise<IRoleDomain>
    {
        return await this.repository.getOne(id);
    }
}

export default GetRoleUseCase;
