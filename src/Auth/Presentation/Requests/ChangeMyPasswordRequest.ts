import { IsString, IsUUID, Length } from 'class-validator';
import MainConfig from '../../../Config/mainConfig';
import ChangeMyPasswordPayload from '../../Domain/Payloads/ChangeMyPasswordPayload';
import UserPasswordRequest from '../../../User/Presentation/Requests/UserPasswordRequest';

class ChangeMyPasswordRequest extends UserPasswordRequest implements ChangeMyPasswordPayload
{
    private readonly _currentPassword: string;

    constructor(data: Record<string, any>)
    {
        super(data);
        this._currentPassword = data.currentPassword;
    }

    @IsString()
    @Length(
        MainConfig.getInstance().getConfig().validationSettings.password.minLength,
        MainConfig.getInstance().getConfig().validationSettings.password.maxLength
    )
    get currentPassword(): string
    {
        return this._currentPassword;
    }
}

export default ChangeMyPasswordRequest;
