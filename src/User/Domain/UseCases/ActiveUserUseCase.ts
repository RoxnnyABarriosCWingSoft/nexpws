import UserActivePayload from '../Payloads/UserActivePayload';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IUserRepository from '../../Infrastructure/Repositories/IUserRepository';
import Logger from '../../../Log/Domain/Services/Logger';
import User from '../Entities/User';
import LogUserTransformer from '../../../Log/Presentation/Transformers/LogUserTransformer';
import IUserDomain from '../Entities/IUserDomain';

class ActiveUserUseCase
{
    private static readonly ACTIVATE_USER = 'activateUser';

    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    // TODO: plantear la ida de activar usuarios con un switch a nivel de front y reutilizar este codigo
    async handle(payload: UserActivePayload, authUser: IUserDomain): Promise<void>
    {
        const { rut } = payload;
        let user = await this.repository.getOneByRut(rut);
        const oldUser = Logger.copy<IUserDomain>(user);

        user.enable = true;
        user.verify = true;

        user = await this.repository.update(user);

        void await Logger.update({
            type: User.name,
            entity: User.name,
            entityId: user.getId(),
            newEntity: user,
            oldEntity: oldUser,
            transformer: new LogUserTransformer(),
            metadata: {
                action: ActiveUserUseCase.ACTIVATE_USER
            },
            authUser
        });
    }
}

export default ActiveUserUseCase;
