import ILogRepository, { ILogListConfig } from './ILogRepository';
import { injectable } from 'inversify';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';

import Paginator from '../../../App/Presentation/Shared/Paginator';
import LogFilter from '../../Presentation/Criterias/LogFilter';
import ILogDomain from '../../Domain/Entities/ILogDomain';
import BaseSqlRepository from '../../../App/Infrastructure/Repositories/BaseSqlRepository';
import Log from '../../Domain/Entities/Log';
import LogSchema from '../Schemas/LogSchema';
import CreateFilterHelper from '../../../Shared/Helpers/CreateSqlFilterHelper';

@injectable()
class LogRepository extends BaseSqlRepository<ILogDomain> implements ILogRepository
{
    constructor()
    {
        super(Log.name, LogSchema);
    }

    async list(criteria: ICriteria, config: ILogListConfig = { entity: null, entityId: null }): Promise<IPaginator>
    {
        const { entity, entityId } = config;
        const queryBuilder = this.repository.createQueryBuilder('i');

        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        queryBuilder.where('1 = 1');

        if (entity && entity)
        {
            queryBuilder.andWhere(`i.${LogFilter.ENTITY} = :entity`, { entity });
            queryBuilder.andWhere(`i.${LogFilter.ENTITY_ID} = :entityId`, { entityId });
        }
        else
        {
            filter.multiFilter({
                attribute: LogFilter.ENTITY
            }, 'andWhere', '=');

            filter.multiFilter({
                attribute: LogFilter.ENTITY_ID
            }, 'andWhere', '=');
        }

        filter.multiFilter({
            attribute: LogFilter.ACTION
        }, 'andWhere', '=');

        void await filter.search(LogFilter.SEARCH, {
            partialMatch: true,
            attributesDB: [{
                name: 'description',
                setWeight: 'A',
                coalesce: true
            }]
        }, 'andWhere');

        queryBuilder.innerJoinAndSelect('i.createdBy', 'createdBy');
        queryBuilder.leftJoinAndSelect('createdBy.mainPicture', 'mainPicture');
        queryBuilder.leftJoinAndSelect('i.files', 'files');

        return new Paginator(queryBuilder, criteria);
    }
}

export default LogRepository;
