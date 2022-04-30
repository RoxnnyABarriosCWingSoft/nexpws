import { AES, enc } from 'crypto-js';
import MainConfig from '../../Config/mainConfig';
import SymmetricDecryptException from '../Exceptions/SymmetricDecryptException';
import Parse from '../Helpers/ParseHelper';

class SymmetricEncryptionStrategy
{
    private static config = MainConfig.getInstance().getConfig();

    static enCrypt<T = any>(value: T, encrypt = true): string | any
    {
        if (encrypt)
        {
            return AES.encrypt(
                JSON.stringify(value),
                this.config.encryption.symmetricKey
            ).toString();
        }
        else
        {
            return value;
        }
    }

    static deCrypt<T = any>(value: string): T
    {
        if (typeof value === 'string')
        {
            const decrypted = AES.decrypt(value.toString(), this.config.encryption.symmetricKey);
            const decryptedString = decrypted.toString(enc.Utf8);

            if (decryptedString.length === 0)
            {
                throw new SymmetricDecryptException();
            }

            return Parse(decryptedString);
        }
        else
        {
            return value;
        }
    }
}

export default SymmetricEncryptionStrategy;
