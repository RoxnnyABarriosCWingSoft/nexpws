import ValidatorRequest from '../../../App/Presentation/Shared/ValidatorRequest';
import CryptedRepPayload from '../../Domain/Payloads/CryptedRepPayload';
import ICryptedDomain from '../../Domain/Entities/ICryptedDomain';
import SymmetricEncryptUseCase from '../../Domain/useCases/symmetricEncryptUseCase';
import SymmetricDecryptUseCase from '../../Domain/useCases/symmetricDecryptUseCase';

class CryptedController
{
    public async encrypt(request: CryptedRepPayload): Promise<ICryptedDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new SymmetricEncryptUseCase();
        return await useCase.handle(request);
    }

    public async decrypt(request: CryptedRepPayload): Promise<ICryptedDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new SymmetricDecryptUseCase();
        return await useCase.handle(request);
    }
}

export default CryptedController;
