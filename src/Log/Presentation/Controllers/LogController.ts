import { ICriteria, IPaginator } from '@digichanges/shared-experience';
import ListLogsUseCase from '../../Domain/UseCases/ListLogsUseCase';
import ValidatorRequest from '../../../App/Presentation/Shared/ValidatorRequest';
import { ILogListConfig } from '../../Infrastructure/Repositories/ILogRepository';

class LogController
{
    public async list(request: ICriteria, config?: ILogListConfig): Promise<IPaginator>
    {
        await ValidatorRequest.handle(request);

        const useCase = new ListLogsUseCase();
        return await useCase.handle(request, config);
    }
}

export default LogController;
