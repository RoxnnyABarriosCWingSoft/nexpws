import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import UpdateMePayload from '../Payloads/UpdateMePayload';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IUserRepository from '../../../User/Infrastructure/Repositories/IUserRepository';
import UserService from '../../../User/Domain/Services/UserService';
import Logger from '../../../Log/Domain/Services/Logger';
import User from '../../../User/Domain/Entities/User';
import LogUserTransformer from '../../../Log/Presentation/Transformers/LogUserTransformer';

class UpdateMeUseCase
{
    private static readonly UPDATED_ME = 'updatedMe';

    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    private readonly userService = new UserService();

    async handle(payload: UpdateMePayload, authUser: IUserDomain): Promise<IUserDomain>
    {
        const oldAuthUser = Logger.copy<IUserDomain>(authUser);

        authUser.build(payload);

        await this.userService.validate(authUser);

        authUser = await this.repository.update(authUser);

        void await Logger.update({
            type: User.name,
            entity: User.name,
            entityId: authUser.getId(),
            newEntity: authUser,
            oldEntity: oldAuthUser,
            transformer: new LogUserTransformer(),
            metadata: {
                action: UpdateMeUseCase.UPDATED_ME
            },
            authUser
        });

        return authUser;
    }
}

export default UpdateMeUseCase;
