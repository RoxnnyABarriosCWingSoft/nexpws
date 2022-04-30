import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import IUserDomain from '../Entities/IUserDomain';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import IUserRepository from '../../Infrastructure/Repositories/IUserRepository';
import FileService from '../../../File/Domain/Services/FileService';
import Logger from '../../../Log/Domain/Services/Logger';
import User from '../Entities/User';
import LogUserTransformer from '../../../Log/Presentation/Transformers/LogUserTransformer';

class RemoveUserUseCase
{
    private static readonly REMOVED_USER = 'removedUser';

    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    private readonly fileService = new FileService();

    // TODO: verificar sin con el deteCascade se puede eliminar la imagen asociada de db. hay que manejar el borrado de esta del bucket
    async handle(payload: IdPayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        const { id } = payload;
        const user = await this.repository.delete(id);

        if (user?.mainPicture)
        {
            void await this.fileService.removeFile(user.mainPicture.getId());
        }

        void await Logger.remove({
            type: User.name,
            entity: User.name,
            entityId: user.getId(),
            removeEntity: user,
            transformer: new LogUserTransformer(),
            metadata: {
                action: RemoveUserUseCase.REMOVED_USER
            },
            authUser
        });

        return user;
    }
}

export default RemoveUserUseCase;
