import symmetricEncryptOrDecryptEachNestedField from '../../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';
import Crypted from '../Entities/Crypted';
import ICryptedDomain from '../Entities/ICryptedDomain';
import CryptedRepPayload from '../Payloads/CryptedRepPayload';

class SymmetricEncryptUseCase
{
    async handle({ value, allowNulls = false }: CryptedRepPayload): Promise<ICryptedDomain>
    {
        return new Crypted({
            input: value,
            output: symmetricEncryptOrDecryptEachNestedField(value, 'decrypt', allowNulls)
        });
    }
}

export default SymmetricEncryptUseCase;
