import moment from 'moment';
import { Transformer } from '@digichanges/shared-experience';

import IRoleDomain from '../../Domain/Entities/IRoleDomain';
import IRoleTransformer from './IRoleTransformer';
import AES from '../../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';

class RoleTransformer extends Transformer
{
    public async transform(role: IRoleDomain): Promise<IRoleTransformer>
    {
        return {
            id: role.getId(),
            name: role.name,
            slug: role.slug,
            permissions: AES(role.permissions ? role.permissions : null, 'encrypt', true),
            enable: role.enable,
            isAdmin: role.isAdmin,
            ofSystem: role.ofSystem,
            createdAt: moment(role.createdAt).utc().unix(),
            updatedAt: moment(role.updatedAt).utc().unix()
        };
    }
}

export default RoleTransformer;
