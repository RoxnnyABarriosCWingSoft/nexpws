import IBaseRepository from '../../../App/InterfaceAdapters/IBaseRepository';
import ILogDomain from '../../Domain/Entities/ILogDomain';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';

export interface ILogListConfig {
    entity: string;
    entityId: string;
}

interface ILogRepository extends IBaseRepository<ILogDomain>
{
    list(criteria: ICriteria, config?: ILogListConfig): Promise<IPaginator>
}

export default ILogRepository;
