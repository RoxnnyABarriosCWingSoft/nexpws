import { ErrorException } from '@digichanges/shared-experience';
import Locales from '../../App/Presentation/Shared/Locales';

class SymmetricDecryptException extends ErrorException
{
    constructor()
    {
        const locales = Locales.getInstance().getLocales();
        const key = 'shared.exceptions.symmetricDecryptError';
        super({
            message: `${locales.__(key)}`,
            errorCode: key
        }, SymmetricDecryptException.name);
    }
}

export default SymmetricDecryptException;
