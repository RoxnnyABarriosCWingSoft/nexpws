import MainConfig from '../../../Config/mainConfig';
import ForgotPasswordPayload from '../Payloads/ForgotPasswordPayload';
import IUserRepository from '../../../User/Infrastructure/Repositories/IUserRepository';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import ForgotPasswordEvent from '../../../Shared/Events/ForgotPasswordEvent';
import SendEmailService from '../../../Notification/Domain/Services/SendEmailService';
import TypeNotificationEnum from '../../../Notification/Domain/Enum/TypeNotificationEnum';
import Locales from '../../../App/Presentation/Shared/Locales';
import ILocaleMessage from '../../../App/InterfaceAdapters/ILocaleMessage';
import { IEncryption } from '@digichanges/shared-experience';
import EncryptionFactory from '../../../Shared/Factories/EncryptionFactory';

class ForgotPasswordUseCase
{
    @containerFactory(REPOSITORIES.IUserRepository)
    private readonly repository: IUserRepository;

    async handle(payload: ForgotPasswordPayload): Promise<ILocaleMessage>
    {
        const config = MainConfig.getInstance();
        const encryption: IEncryption = EncryptionFactory.create('md5');

        const [user, confirmationToken] = await Promise.all([
            this.repository.getOneByEmail(payload.email),
            encryption.encrypt(payload.confirmationToken)
        ]);

        user.confirmationToken = confirmationToken;
        user.passwordRequestedAt = payload.passwordRequestedAt;

        await this.repository.save(user);

        const urlConfirmationToken = `${config.getConfig().url.urlWeb}/changeForgotPassword/${user.confirmationToken}`;

        void await SendEmailService.handle({
            event: ForgotPasswordEvent.FORGOT_PASSWORD_EVENT,
            type: TypeNotificationEnum.FORGOT_PASSWORD,
            to: user.email,
            name: 'Forgot password',
            args: {
                urlConfirmationToken,
                userName: user.firstName
            },
            data: {
                EMAIL_USER: user.email,
                URL_CONFIRMATION_TOKEN: urlConfirmationToken
            },
            external: true
        });

        const locales = Locales.getInstance().getLocales();
        const key = 'auth.domain.messages.forgotPassword';

        return { message: locales.__(key), messageCode: key };
    }
}

export default ForgotPasswordUseCase;
