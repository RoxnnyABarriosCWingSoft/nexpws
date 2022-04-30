import ChangeMyPasswordPayload from '../Payloads/ChangeMyPasswordPayload';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import PasswordWrongException from '../Exceptions/PasswordWrongException';
import EncryptionFactory from '../../../Shared/Factories/EncryptionFactory';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IUserRepository from '../../../User/Infrastructure/Repositories/IUserRepository';
import MainConfig from '../../../Config/mainConfig';
import Password from '../../../App/Domain/ValueObjects/Password';
import Logger from '../../../Log/Domain/Services/Logger';
import User from '../../../User/Domain/Entities/User';
import LogUserTransformer from '../../../Log/Presentation/Transformers/LogUserTransformer';

class ChangeMyPasswordUseCase
{
    private static readonly CHANGED_MY_PASSWORD = 'changedMyPassword';

    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    private readonly encryption = EncryptionFactory.create();

    private readonly config = MainConfig.getInstance().getConfig();

    async handle(payload: ChangeMyPasswordPayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        const oldAuthUser = Logger.copy<IUserDomain>(authUser);

        if (! await this.encryption.compare(payload.currentPassword, authUser.password.toString()))
        {
            throw new PasswordWrongException();
        }

        const { minLength, maxLength } = this.config.validationSettings.password;

        authUser.password = await (new Password(payload.password, minLength, maxLength)).ready();

        authUser = await this.repository.update(authUser);

        void await Logger.update({
            type: User.name,
            entity: User.name,
            entityId: authUser.getId(),
            newEntity: authUser,
            oldEntity: oldAuthUser,
            transformer: new LogUserTransformer(),
            metadata: {
                action: ChangeMyPasswordUseCase.CHANGED_MY_PASSWORD
            },
            ignore: ['password'],
            authUser
        });

        return authUser;
    }
}

export default ChangeMyPasswordUseCase;
