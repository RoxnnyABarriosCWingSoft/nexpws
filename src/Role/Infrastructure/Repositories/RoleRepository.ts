import IRoleRepository from './IRoleRepository';
import { injectable } from 'inversify';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';

import Paginator from '../../../App/Presentation/Shared/Paginator';
import RoleFilter from '../../Presentation/Criterias/RoleFilter';
import IRoleDomain from '../../Domain/Entities/IRoleDomain';
import BaseSqlRepository from '../../../App/Infrastructure/Repositories/BaseSqlRepository';
import Role from '../../Domain/Entities/Role';
import RoleSchema from '../Schemas/RoleSchema';
import RoleOfSystemNotDeletedException from '../../Domain/Exceptions/RoleOfSystemNotDeletedException';
import NotFoundException from '../../../Shared/Exceptions/NotFoundException';
import CreateFilterHelper from '../../../Shared/Helpers/CreateSqlFilterHelper';

@injectable()
class RoleRepository extends BaseSqlRepository<IRoleDomain> implements IRoleRepository
{
    constructor()
    {
        super(Role.name, RoleSchema);
    }

    async getBySlug(slug: string): Promise<IRoleDomain>
    {
        return await this.repository.findOne({ slug });
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder = this.repository.createQueryBuilder('i');

        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        queryBuilder.where('1 = 1');

        filter.filter({
            attribute: RoleFilter.ENABLE,
            isBoolean: true
        }, 'andWhere', '=');

        filter.filter({
            attribute: RoleFilter.IS_ADMIN,
            isBoolean: true
        }, 'andWhere', '=');

        filter.filter({
            attribute: RoleFilter.OF_SYSTEM,
            isBoolean: true
        }, 'andWhere', '=');

        void await filter.search(RoleFilter.SEARCH, {
            partialMatch: true,
            attributesDB: [{
                name: 'name',
                setWeight: 'A'
            }, {
                name: 'slug',
                setWeight: 'B'
            }]
        }, 'andWhere');

        return new Paginator(queryBuilder, criteria);
    }

    async delete(id: string): Promise<IRoleDomain>
    {
        const isOfSystem = !!(await this.exist({ _id: id, ofSystem: true }, ['_id']));

        if (isOfSystem)
        {
            throw new RoleOfSystemNotDeletedException();
        }

        const entity = await this.repository.findOne(id);

        if (!entity)
        {
            throw new NotFoundException(Role.name);
        }

        await this.repository.delete(id);

        return entity;
    }
}

export default RoleRepository;
