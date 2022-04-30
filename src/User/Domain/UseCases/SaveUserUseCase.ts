import IUserDomain from '../Entities/IUserDomain';
import EventHandler from '../../../Shared/Events/EventHandler';
import UserCreatedEvent from '../../../Shared/Events/UserCreatedEvent';
import UserSavePayload from '../Payloads/UserSavePayload';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IUserRepository from '../../Infrastructure/Repositories/IUserRepository';
import MainConfig from '../../../Config/mainConfig';
import User from '../Entities/User';
import Password from '../../../App/Domain/ValueObjects/Password';
import RemoveFileService from '../../../File/Domain/Services/RemoveFileService';
import UserService from '../Services/UserService';
import Logger from '../../../Log/Domain/Services/Logger';

class SaveUserUseCase
{
    private static readonly CREATED_USER =  'createdUser';

    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    private readonly eventHandler = EventHandler.getInstance();

    private readonly config = MainConfig.getInstance().getConfig();

    private readonly userService = new UserService();

    async handle(payload: UserSavePayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        const { minLength, maxLength } = this.config.validationSettings.password;

        let user: IUserDomain = new User(payload);

        user.verify = payload.verify;
        user.enable = payload.enable;
        user.permissions = payload.permissions;

        user.setPassword(await (new Password(payload.password, minLength, maxLength)).ready());

        const oldMainPicture = user?.mainPicture;

        user.mainPicture = await RemoveFileService.update(payload?.mainPictureId, oldMainPicture);

        await this.userService.validate(user);

        await this.eventHandler.execute(UserCreatedEvent.USER_CREATED_EVENT, { email: user.email });

        user = await this.repository.save(user);

        void await RemoveFileService.remove(user?.mainPicture?.getId(), oldMainPicture?.getId());

        void await Logger.save({
            type: User.name,
            entity: User.name,
            entityId: user.getId(),
            metadata: {
                action: SaveUserUseCase.CREATED_USER
            },
            authUser
        });

        return user;
    }
}

export default SaveUserUseCase;
