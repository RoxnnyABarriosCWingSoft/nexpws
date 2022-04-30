import AuthPayload from '../Payloads/AuthPayload';
import IUserRepository from '../../../User/Infrastructure/Repositories/IUserRepository';
import EncryptionFactory from '../../../Shared/Factories/EncryptionFactory';
import TokenFactory from '../../../Shared/Factories/TokenFactory';

import { REPOSITORIES } from '../../../Config/Injects/repositories';

import BadCredentialsException from '../Exceptions/BadCredentialsException';
import UserDisabledException from '../../../User/Domain/Exceptions/UserDisabledException';
import RoleDisabledException from '../../../Role/Domain/Exceptions/RoleDisabledException';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import IToken from '../Models/IToken';
import UnverifiedUserException from '../../../User/Domain/Exceptions/UnverifiedUserException';
import Logger from '../../../Log/Domain/Services/Logger';
import User from '../../../User/Domain/Entities/User';
import RoleWithoutAdministrativeAccessException
    from '../../../Role/Domain/Exceptions/RoleWithoutAdministrativeAccessException';

class LoginUseCase
{
    private static readonly LOGIN = 'login';

    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    private readonly encryption = EncryptionFactory.create();

    private readonly tokenFactory = new TokenFactory();

    async handle({ rut, password }: AuthPayload): Promise<IToken>
    {
        const user = await this.repository.getOneBy({ rut }, { populate: 'roles', initThrow: false });

        if (!user)
        {
            throw new BadCredentialsException();
        }

        if (!user.verify)
        {
            throw new UnverifiedUserException();
        }

        if (!user.enable)
        {
            throw new UserDisabledException();
        }

        const roleDisabled = user.roles.find(role => !role.enable);
        const viewAdmin = user.roles.some((role) => role.isAdmin);

        if (roleDisabled)
        {
            throw new RoleDisabledException();
        }

        if (!viewAdmin && !user.isSuperAdmin)
        {
            throw new RoleWithoutAdministrativeAccessException();
        }

        if (! await this.encryption.compare(password, user.password.toString()))
        {
            throw new BadCredentialsException();
        }

        void await Logger.login({
            type: User.name,
            entity: User.name,
            entityId: user.getId(),
            metadata: {
                action: LoginUseCase.LOGIN
            },
            authUser: user
        });

        return this.tokenFactory.createToken(user);
    }
}

export default LoginUseCase;
