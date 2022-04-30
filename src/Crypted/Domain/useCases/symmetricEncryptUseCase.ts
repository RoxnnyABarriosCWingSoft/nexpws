import symmetricEncryptOrDecryptEachNestedField from '../../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';
import Crypted from '../Entities/Crypted';
import CryptedRepPayload from '../Payloads/CryptedRepPayload';
import ICryptedDomain from '../Entities/ICryptedDomain';

class SymmetricEncryptUseCase
{
    async handle({ value, allowNulls = false }: CryptedRepPayload): Promise<ICryptedDomain>
    {
        return new Crypted({
            input: value,
            output: symmetricEncryptOrDecryptEachNestedField(value, 'encrypt', allowNulls)
        });
    }
}

export default SymmetricEncryptUseCase;
