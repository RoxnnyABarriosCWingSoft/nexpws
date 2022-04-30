import UserUpdatePayload from '../Payloads/UserUpdatePayload';
import IUserDomain from '../Entities/IUserDomain';
import CantDisabledException from '../../../Auth/Domain/Exceptions/CantDisabledException';
import UserService from '../Services/UserService';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IUserRepository from '../../Infrastructure/Repositories/IUserRepository';
import Logger from '../../../Log/Domain/Services/Logger';
import User from '../Entities/User';
import LogUserTransformer from '../../../Log/Presentation/Transformers/LogUserTransformer';

class UpdateUserUseCase
{
    private static readonly UPDATED_USER = 'updatedUser';

    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    private readonly userService = new UserService();

    // TODO: si el usuario a editar es super admin, lanzar un error de que el super admin no puede ser editado
    async handle(payload: UserUpdatePayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        const { id } = payload;
        let user: IUserDomain = await this.repository.getOne(id);
        const oldUser = Logger.copy<IUserDomain>(user);
        let enable = payload.enable;

        if (authUser.getId() === user.getId())
        {
            enable = true;
        }

        if (typeof user.roles !== 'undefined' && enable !== null) // TODO: Refactoring
        {
            if (user.isSuperAdmin && !enable)
            {
                throw new CantDisabledException();
            }
        }

        user.build(payload);

        user.verify = payload.verify;
        user.enable = payload.enable;
        user.permissions = payload.permissions;

        await this.userService.validate(user);

        user = await this.repository.update(user);

        void await Logger.update({
            type: User.name,
            entity: User.name,
            entityId: user.getId(),
            newEntity: user,
            oldEntity: oldUser,
            transformer: new LogUserTransformer(),
            metadata: {
                action: UpdateUserUseCase.UPDATED_USER
            },
            authUser
        });

        return user;
    }
}

export default UpdateUserUseCase;
