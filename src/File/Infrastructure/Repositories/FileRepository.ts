import IFileRepository from './IFileRepository';
import { injectable } from 'inversify';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';

import Paginator from '../../../App/Presentation/Shared/Paginator';
import FileFilter from '../../Presentation/Criterias/FileFilter';
import FileSchema from '../Schemas/FileSchema';
import File from '../../Domain/Entities/File';
import IFileDomain from '../../Domain/Entities/IFileDomain';

import BaseSqlRepository from '../../../App/Infrastructure/Repositories/BaseSqlRepository';
import CreateFilterHelper from '../../../Shared/Helpers/CreateSqlFilterHelper';

@injectable()
class FileRepository extends BaseSqlRepository<IFileDomain> implements IFileRepository
{
    constructor()
    {
        super(File.name, FileSchema);
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder = this.repository.createQueryBuilder('i');

        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        queryBuilder.where('1 = 1');

        void await filter.search(FileFilter.SEARCH, {
            partialMatch: true,
            attributesDB: [{
                name: 'name',
                setWeight: 'A'
            }]
        }, 'andWhere');

        return new Paginator(queryBuilder, criteria);
    }
}

export default FileRepository;
