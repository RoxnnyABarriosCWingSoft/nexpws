import IUserDomain from '../Entities/IUserDomain';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import CheckUserRolePayload from '../Payloads/CheckUserRolePayload';
import UniqueService from '../../../App/Domain/Services/UniqueService';
import AuthHelper from '../../../Shared/Helpers/AuthHelper';

class UserService
{
    async validate(user: IUserDomain): Promise<void>
    {
        AuthHelper.validatePermissions(user.permissions);

        void await UniqueService.validate<IUserDomain>({
            repository: REPOSITORIES.IUserRepository,
            validate: {
                email: user?.email,
                rut: user.rut,
                phoneNumber: user.phoneNumber
            },
            refValue: user.getId()
        });
    }
}

export default UserService;
