import { ErrorException } from '@digichanges/shared-experience';
import Locales from '../../../App/Presentation/Shared/Locales';

class RoleWithoutAdministrativeAccessException extends ErrorException
{
    constructor()
    {
        const locales = Locales.getInstance().getLocales();
        const key = 'role.domain.exceptions.roleWithoutAdministrativeAccessException';
        super({
            message: locales.__(key),
            errorCode: key
        }, RoleWithoutAdministrativeAccessException.name);
    }
}

export default RoleWithoutAdministrativeAccessException;
