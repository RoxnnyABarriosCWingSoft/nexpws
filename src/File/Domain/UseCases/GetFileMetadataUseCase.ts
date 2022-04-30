import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import IFileDomain from '../Entities/IFileDomain';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IFileRepository from '../../Infrastructure/Repositories/IFileRepository';

class GetFileMetadataUserCase
{
    @containerFactory(REPOSITORIES.IFileRepository)
    private readonly repository: IFileRepository;

    async handle({ id }: IdPayload): Promise<IFileDomain>
    {
        return await this.repository.getOne(id);
    }
}

export default GetFileMetadataUserCase;
