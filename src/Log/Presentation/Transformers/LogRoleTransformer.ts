import { Transformer } from '@digichanges/shared-experience';
import IRoleDomain from '../../../Role/Domain/Entities/IRoleDomain';

class LogRoleTransformer extends Transformer
{
    public async transform(role: IRoleDomain)
    {
        return {
            name: role.name,
            slug: role.slug,
            permissions: role?.permissions ? role.permissions : null,
            enable: role.enable,
            isAdmin: role.isAdmin,
            ofSystem: role.ofSystem
        };
    }
}

export default LogRoleTransformer;

