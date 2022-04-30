import ChangeUserPasswordPayload from '../Payloads/ChangeUserPasswordPayload';
import IUserDomain from '../Entities/IUserDomain';
import Password from '../../../App/Domain/ValueObjects/Password';
import MainConfig from '../../../Config/mainConfig';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IUserRepository from '../../Infrastructure/Repositories/IUserRepository';
import _ from 'lodash';
import Logger from '../../../Log/Domain/Services/Logger';
import User from '../Entities/User';
import LogUserTransformer from '../../../Log/Presentation/Transformers/LogUserTransformer';


class ChangeUserPasswordUseCase
{
    private static readonly CHANGE_USER_PASSWORD = 'changeUserPassword';

    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    private readonly config = MainConfig.getInstance().getConfig();

    async handle(payload: ChangeUserPasswordPayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        const { id } = payload;
        let user: IUserDomain = await this.repository.getOne(id);
        const oldUser: IUserDomain = _.cloneDeep<IUserDomain>(user);

        const { minLength, maxLength } = this.config.validationSettings.password;

        user.password = await (new Password(payload.password, minLength, maxLength)).ready();

        user = await this.repository.update(user);

        void await Logger.update({
            type: User.name,
            entity: User.name,
            entityId: user.getId(),
            newEntity: user,
            oldEntity: oldUser,
            transformer: new LogUserTransformer(),
            ignore: ['password'],
            metadata: {
                action: ChangeUserPasswordUseCase.CHANGE_USER_PASSWORD
            },
            authUser
        });

        return user;
    }
}

export default ChangeUserPasswordUseCase;
