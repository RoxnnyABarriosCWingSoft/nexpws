import { Transformer } from '@digichanges/shared-experience';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import moment from 'moment';
class LogUserTransformer extends Transformer
{
    public async transform(user: IUserDomain)
    {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            rut: user.rut,
            email: user.email,
            birthday: moment(user.birthday).format('YYYY-MM-DD'),
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            localPhoneNumber: user.localPhoneNumber,
            mainPictureId: user?.mainPicture?.getId(),
            enable: user.enable,
            verify: user.verify,
            permissions: user.permissions,
            roles: user.roles.map(r =>
            {
                return { id: r.getId(), name: r.name, slug: r.slug };
            }),
            password: user.password.toString()
        };
    }
}

export default LogUserTransformer;

