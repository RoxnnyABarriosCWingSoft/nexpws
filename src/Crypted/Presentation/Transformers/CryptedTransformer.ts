import { Transformer } from '@digichanges/shared-experience';
import ICryptedTransformer from './ICryptedTransformer';
import ICryptedDomain from '../../Domain/Entities/ICryptedDomain';

class CryptedTransformer extends Transformer
{
    public async transform(crypted: ICryptedDomain): Promise<ICryptedTransformer>
    {
        return {
            input: crypted.input,
            output: crypted.output
        };
    }
}

export default CryptedTransformer;
