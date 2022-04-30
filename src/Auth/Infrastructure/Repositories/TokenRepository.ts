import { ICriteria, IPaginator, ITokenRepository } from '@digichanges/shared-experience';
import { injectable } from 'inversify';
import BaseSqlRepository from '../../../App/Infrastructure/Repositories/BaseSqlRepository';
import Token from '../../Domain/Entities/Token';
import ITokenDomain from '../../Domain/Entities/ITokenDomain';
import TokenSchema from '../Schemas/TokenSchema';
import Paginator from '../../../App/Presentation/Shared/Paginator';

@injectable()
class TokenSqlRepository extends BaseSqlRepository<ITokenDomain> implements ITokenRepository<ITokenDomain>
{
    constructor()
    {
        super(Token.name, TokenSchema);
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder = this.repository.createQueryBuilder('i');

        queryBuilder.where('1 = 1');

        return new Paginator(queryBuilder, criteria);
    }
}

export default TokenSqlRepository;
