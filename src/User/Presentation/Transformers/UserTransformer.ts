import moment from 'moment';
import { Transformer } from '@digichanges/shared-experience';

import IUserDomain from '../../Domain/Entities/IUserDomain';
import RoleTransformer from '../../../Role/Presentation/Transformers/RoleTransformer';
import IUserTransformer from './IUserTransformer';
import UrlFileService from '../../../File/Domain/Services/UrlFileService';
import AES from '../../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';

class UserTransformer extends Transformer
{
    private roleTransformer: RoleTransformer;

    constructor()
    {
        super();
        this.roleTransformer = new RoleTransformer();
    }

    public async transform(user: IUserDomain): Promise<IUserTransformer>
    {
        return {
            id: user.getId(),
            firstName: user.firstName,
            lastName: user.lastName,
            rut: AES(user.rut, 'encrypt', true),
            email: AES(user.email, 'encrypt', true),
            birthday: user.birthday,
            age: user.getAge(),
            gender: user.gender,
            phoneNumber: AES(user.phoneNumber, 'encrypt', true),
            localPhoneNumber: AES(user.localPhoneNumber, 'encrypt', true),
            mainPicture: <any> await UrlFileService.handle(user?.mainPicture),
            enable: user.enable,
            verify: user.verify,
            roles: await this.roleTransformer.handle(user.roles),
            permissions: AES(user.permissions, 'encrypt', true),
            createdAt: moment(user.createdAt).utc().unix(),
            updatedAt: moment(user.updatedAt).utc().unix()
        };
    }
}

export default UserTransformer;
