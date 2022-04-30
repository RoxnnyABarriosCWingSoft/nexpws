import { ICriteria, IPaginator } from '@digichanges/shared-experience';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IFileRepository from '../../Infrastructure/Repositories/IFileRepository';

class ListFilesUseCase
{
    @containerFactory(REPOSITORIES.IFileRepository)
    private readonly repository: IFileRepository;

    async handle(payload: ICriteria): Promise<IPaginator>
    {
        return await this.repository.list(payload);
    }
}

export default ListFilesUseCase;
