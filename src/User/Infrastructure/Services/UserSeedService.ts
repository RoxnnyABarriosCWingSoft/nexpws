import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import MainConfig from '../../../Config/mainConfig';
import Logger from '../../../Shared/Logger/Logger';
import IUserRepository from '../Repositories/IUserRepository';
import IRoleRepository from '../../../Role/Infrastructure/Repositories/IRoleRepository';
import IUserDomain from '../../Domain/Entities/IUserDomain';
import Roles from '../../../Config/Roles';
import User from '../../Domain/Entities/User';
import Password from '../../../App/Domain/ValueObjects/Password';
import IBuildUser from '../../Domain/Entities/IBuildUser';
import AdminRole from '../../../App/Domain/Shared/AdminRole';


export interface IUserSeedData extends IBuildUser
{
    role?: 'admin' | 'superadmin';
    password?: string;
    enable?: boolean;
    verify?: boolean;
    isSuperAdmin?: boolean;
}

class UserSeedService
{
    @containerFactory(REPOSITORIES.IUserRepository)
    private static readonly repository: IUserRepository;

    @containerFactory(REPOSITORIES.IRoleRepository)
    private static readonly roleRepository: IRoleRepository;

    private static readonly config = MainConfig.getInstance().getConfig();

    static async load(data: IUserSeedData[], defaultPassword = '12345678'): Promise<IUserDomain[]>
    {
        const [roleAmin] = await Promise.all([
            await this.roleRepository.getBySlug(AdminRole.I.NAME.toLowerCase())
        ]);

        const { minLength, maxLength } = this.config.validationSettings.password;

        const users: IUserDomain[] = [];

        for await (const _data of data)
        {
            try
            {
                const user: IUserDomain = new User(_data);

                const psw = _data?.password ?? defaultPassword;

                user.password = await (new Password(psw, minLength, maxLength)).ready();
                user.isSuperAdmin = _data?.isSuperAdmin ?? false;
                user.enable = _data?.enable ?? true;
                user.verify = _data?.verify ?? false;
                user.confirmationToken = null;
                user.passwordRequestedAt = null;
                user.permissions = [];

                if (_data?.role === AdminRole.I.NAME.toLowerCase())
                {
                    user.roles = [roleAmin];
                }

                users.push(await this.repository.save(user));
            }
            catch (e)
            {
                Logger.info(`├───── Error ${e}`);
            }
        }

        return users;
    }
}

export default UserSeedService;
