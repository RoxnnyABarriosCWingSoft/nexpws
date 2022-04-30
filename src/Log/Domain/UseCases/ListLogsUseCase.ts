import { ICriteria, IPaginator } from '@digichanges/shared-experience';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import ILogRepository, { ILogListConfig } from '../../Infrastructure/Repositories/ILogRepository';


class ListLogsUseCase
{
    @containerFactory(REPOSITORIES.ILogRepository)
    private readonly repository: ILogRepository;

    async handle(payload: ICriteria, config?: ILogListConfig): Promise<IPaginator>
    {
        return await this.repository.list(payload, config);
    }
}

export default ListLogsUseCase;
