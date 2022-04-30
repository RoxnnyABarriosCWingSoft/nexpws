import IUserDomain from '../Entities/IUserDomain';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IUserRepository from '../../Infrastructure/Repositories/IUserRepository';
import RemoveFileService from '../../../File/Domain/Services/RemoveFileService';
import Logger from '../../../Log/Domain/Services/Logger';
import User from '../Entities/User';
import LogUserTransformer from '../../../Log/Presentation/Transformers/LogUserTransformer';
import SetMainPictureUserPayload from '../Payloads/SetMainPictureUserPayload';

class SetMainPictureUserUseCase
{
    private static readonly USER_SET_MAIN_PICTURE = 'userSetMainPicture';

    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    async handle(payload: SetMainPictureUserPayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        const { id } = payload;
        let user: IUserDomain = await this.repository.getOne(id);
        const oldUser = Logger.copy<IUserDomain>(user);

        const oldMainPicture = user?.mainPicture;

        if (!payload.setNull)
        {
            user.mainPicture = await RemoveFileService.update(payload?.mainPictureId, oldMainPicture);
        }
        else
        {
            user.mainPicture = null;
        }

        user = await this.repository.update(user);

        void await RemoveFileService.remove(user?.mainPicture?.getId(), oldMainPicture?.getId());

        void await Logger.update({
            type: User.name,
            entity: User.name,
            entityId: user.getId(),
            newEntity: user,
            oldEntity: oldUser,
            transformer: new LogUserTransformer(),
            metadata: {
                action: SetMainPictureUserUseCase.USER_SET_MAIN_PICTURE
            },
            authUser
        });

        return user;
    }
}

export default SetMainPictureUserUseCase;
