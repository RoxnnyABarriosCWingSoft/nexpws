import AuthPayload from '../../Domain/Payloads/AuthPayload';
import MainConfig from '../../../Config/mainConfig';
import { IsString, Length } from 'class-validator';

class AuthRequest implements AuthPayload
{
    private readonly _rut: string;
    private readonly _password: string;

    constructor(data: Record<string, any>)
    {
        this._rut = data.rut;
        this._password = data.password;
    }

    @IsString()
    get rut(): string
    {
        return this._rut;
    }

    @IsString()
    @Length(MainConfig.getInstance().getConfig().validationSettings.password.minLength,
        MainConfig.getInstance().getConfig().validationSettings.password.maxLength)
    get password(): string
    {
        return this._password;
    }
}

export default AuthRequest;
