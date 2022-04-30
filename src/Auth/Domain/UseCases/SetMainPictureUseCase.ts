import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IUserRepository from '../../../User/Infrastructure/Repositories/IUserRepository';
import RemoveFileService from '../../../File/Domain/Services/RemoveFileService';
import Logger from '../../../Log/Domain/Services/Logger';
import User from '../../../User/Domain/Entities/User';
import LogUserTransformer from '../../../Log/Presentation/Transformers/LogUserTransformer';
import SetMainPicturePayload from '../../../User/Domain/Payloads/SetMainPicturePayload';

class SetMainPictureUseCase
{
    private static readonly SET_MAIN_PICTURE = 'setMainPicture';

    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    async handle(payload: SetMainPicturePayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        const oldAuthUser = Logger.copy<IUserDomain>(authUser);

        const oldMainPicture = authUser?.mainPicture;

        if (!payload.setNull)
        {
            authUser.mainPicture = await RemoveFileService.update(payload?.mainPictureId, oldMainPicture);
        }
        else
        {
            authUser.mainPicture = null;
        }

        authUser = await this.repository.update(authUser);

        void await RemoveFileService.remove(authUser?.mainPicture?.getId(), oldMainPicture?.getId());

        void await Logger.update({
            type: User.name,
            entity: User.name,
            entityId: authUser.getId(),
            newEntity: authUser,
            oldEntity: oldAuthUser,
            transformer: new LogUserTransformer(),
            metadata: {
                action: SetMainPictureUseCase.SET_MAIN_PICTURE
            },
            authUser
        });

        return authUser;
    }
}

export default SetMainPictureUseCase;
