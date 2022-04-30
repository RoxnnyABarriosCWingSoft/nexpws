import { Transformer } from '@digichanges/shared-experience';
import AES from '../../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';

class PermissionsTransformer extends Transformer
{
    public async transform(data: any)
    {
        return AES(data, 'encrypt');
    }
}

export default PermissionsTransformer;
