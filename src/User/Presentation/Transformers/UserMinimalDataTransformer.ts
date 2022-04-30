import { Transformer } from '@digichanges/shared-experience';

import IUserDomain from '../../Domain/Entities/IUserDomain';
import IUserMinimalDataTransformer from './IUserMinimalDataTransformer';
import UrlFileService from '../../../File/Domain/Services/UrlFileService';
import AES from '../../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';

class UserMinimalDataTransformer extends Transformer
{
    public async transform(user: IUserDomain): Promise<IUserMinimalDataTransformer>
    {
        return {
            id: user.getId(),
            firstName: user.firstName,
            lastName: user.lastName,
            rut: AES(user.rut, 'encrypt', true),
            email: AES(user.email, 'encrypt', true),
            age: user.getAge(),
            phoneNumber: AES(user.phoneNumber, 'encrypt', true),
            localPhoneNumber: AES(user.localPhoneNumber, 'encrypt', true),
            mainPicture: <any> await UrlFileService.handle(user?.mainPicture)
        };
    }
}

export default UserMinimalDataTransformer;
