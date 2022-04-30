import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IRoleDomain from '../Entities/IRoleDomain';
import UniqueService from '../../../App/Domain/Services/UniqueService';

class RoleService
{
    async validate(role: IRoleDomain): Promise<void>
    {
        void await UniqueService.validate<IRoleDomain>({
            repository: REPOSITORIES.IRoleRepository,
            validate: {
                slug: role.slug
            },
            refValue: role.getId()
        });
    }
}

export default RoleService;
