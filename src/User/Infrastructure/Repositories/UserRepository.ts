import IUserRepository from './IUserRepository';
import User from '../../Domain/Entities/User';
import { injectable } from 'inversify';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';

import Paginator from '../../../App/Presentation/Shared/Paginator';
import UserFilter from '../../Presentation/Criterias/UserFilter';
import IUserDomain from '../../Domain/Entities/IUserDomain';
import UserSchema from '../Schemas/UserSchema';

import NotFoundException from '../../../Shared/Exceptions/NotFoundException';
import BaseSqlRepository from '../../../App/Infrastructure/Repositories/BaseSqlRepository';
import CreateFilterHelper from '../../../Shared/Helpers/CreateSqlFilterHelper';

@injectable()
class UserRepository extends BaseSqlRepository<IUserDomain> implements IUserRepository
{
    constructor()
    {
        super(User.name, UserSchema);
    }

    async getOneByRut(rut: string): Promise<IUserDomain>
    {
        const user = await this.repository.findOne({ rut });

        if (!user)
        {
            throw new NotFoundException('User');
        }

        return user;
    }

    async getOneByEmail(email: string): Promise<IUserDomain>
    {
        const user = await this.repository.findOne({ email });

        if (!user)
        {
            throw new NotFoundException(User.name);
        }

        return user;
    }

    async getOneByConfirmationToken(confirmationToken: string): Promise<IUserDomain>
    {
        const user = await this.repository.findOne({ confirmationToken });

        if (!user)
        {
            throw new NotFoundException(User.name);
        }

        return user;
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder = this.repository.createQueryBuilder('i');

        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        queryBuilder.where('1 = 1');

        filter.filter({
            attribute: UserFilter.ENABLE,
            isBoolean: true
        }, 'andWhere', '=');

        filter.filter({
            attribute: UserFilter.IS_SUPER_ADMIN,
            isBoolean: true
        }, 'andWhere', '=');

        filter.filter({
            attribute: UserFilter.VERIFY,
            isBoolean: true
        }, 'andWhere', '=');

        void await filter.search(UserFilter.SEARCH, {
            partialMatch: true,
            attributesDB: [
                {
                    name: 'firstName',
                    setWeight: 'C'
                },
                {
                    name: 'lastName',
                    setWeight: 'C'
                },
                {
                    name: 'rut',
                    setWeight: 'A'
                },
                {
                    name: 'email',
                    setWeight: 'A',
                    coalesce: true
                },
                {
                    name: 'phoneNumber',
                    setWeight: 'B'
                },
                {
                    name: 'localPhoneNumber',
                    setWeight: 'B',
                    coalesce: true
                }
            ]
        }, 'andWhere');

        queryBuilder.leftJoinAndSelect('i.roles', 'role');
        queryBuilder.leftJoinAndSelect('i.mainPicture', 'mainPicture');

        return new Paginator(queryBuilder, criteria);
    }
}

export default UserRepository;
