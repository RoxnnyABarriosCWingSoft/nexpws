import ISeed from '../../../Shared/InterfaceAdapters/ISeed';
import IRoleDomain from '../../Domain/Entities/IRoleDomain';
import RoleSeedService, { IRoleSeedData } from '../Services/RoleSeedService';
import AdminRole from '../../../App/Domain/Shared/AdminRole';

class RoleSeed implements ISeed
{
    public async init(): Promise<IRoleDomain[]>
    {
        const data: IRoleSeedData[] = [
            {
                name: AdminRole.I.NAME,
                slug: AdminRole.I.NAME.toLowerCase(),
                permissions: [],
                enable: true,
                isAdmin: true,
                ofSystem: true
            }
        ];

        return await RoleSeedService.load(data);
    }
}


export default RoleSeed;
