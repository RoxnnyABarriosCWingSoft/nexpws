import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import Logger from '../../../Shared/Logger/Logger';
import IRoleRepository from '../Repositories/IRoleRepository';
import IRoleDomain from '../../Domain/Entities/IRoleDomain';
import Role from '../../Domain/Entities/Role';
import IBuildRole from '../../Domain/Entities/IBuildRole';

export interface IRoleSeedData extends IBuildRole
{
    ofSystem?: boolean;
}

class RoleSeedService
{
    @containerFactory(REPOSITORIES.IRoleRepository)
    private static readonly roleRepository: IRoleRepository;

    static async load(data: IRoleSeedData[]): Promise<IRoleDomain[]>
    {
        const roles: IRoleDomain[] = [];

        for await (const _data of data)
        {
            try
            {
                const role: IRoleDomain = new Role(_data);

                role.ofSystem = _data?.ofSystem ?? false;

                roles.push(await this.roleRepository.save(role));
            }
            catch (e)
            {
                Logger.info(`├───── Error ${e}`);
            }
        }

        return roles;
    }
}

export default RoleSeedService;
