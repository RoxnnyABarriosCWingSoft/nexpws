import moment from 'moment';
import { Transformer } from '@digichanges/shared-experience';

import RoleUserTransformer from '../../../Role/Presentation/Transformers/RoleUserTransformer';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import AuthService from '../../Domain/Services/AuthService';
import UrlFileService from '../../../File/Domain/Services/UrlFileService';
import IUserTransformer from '../../../User/Presentation/Transformers/IUserTransformer';
import AES from '../../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';

class AuthUserTransformer extends Transformer
{
    private roleUserTransformer: RoleUserTransformer;

    constructor()
    {
        super();
        this.roleUserTransformer = new RoleUserTransformer();
    }

    public async transform(authUser: IUserDomain): Promise<IUserTransformer>
    {
        const authService: AuthService = new AuthService();

        return {
            id: authUser.getId(),
            firstName: authUser.firstName,
            lastName: authUser.lastName,
            rut: AES(authUser.rut, 'encrypt', true),
            email: AES(authUser.email, 'encrypt', true),
            birthday: authUser.birthday,
            age: authUser.getAge(),
            gender: authUser.gender,
            phoneNumber: AES(authUser.phoneNumber, 'encrypt', true),
            localPhoneNumber: AES(authUser.localPhoneNumber, 'encrypt', true),
            isSuperAdmin: authUser.isSuperAdmin,
            mainPicture: <any> await UrlFileService.handle(authUser?.mainPicture),
            permissions: AES(authService.getPermissions(authUser), 'encrypt', true),
            roles: await this.roleUserTransformer.handle(authUser.roles),
            createdAt: moment(authUser.createdAt).utc().unix(),
            updatedAt: moment(authUser.updatedAt).utc().unix()
        };
    }
}

export default AuthUserTransformer;
