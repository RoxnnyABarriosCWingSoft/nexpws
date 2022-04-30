import { decorate } from 'ts-mixer';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import IRoleDomain from '../../../Role/Domain/Entities/IRoleDomain';
import UserRepPayload from '../../Domain/Payloads/UserRepPayload';
import GenderEnum from '../../Domain/Enums/GenderEnum';

class UserWithoutPermissionsRequest implements UserRepPayload
{
    private readonly _firstName: string;
    private readonly _lastName: string;
    private readonly _email: string | null;
    private readonly _birthday: Date;
    private readonly _rut: string;
    private readonly _gender: GenderEnum;
    private readonly _phoneNumber: string;
    private readonly _localPhoneNumber: string | null;
    private readonly _mainPictureId: string | null;

    constructor(data: Record<string, any>)
    {
        this._firstName = data.firstName;
        this._lastName = data.lastName;
        this._email = data.email;
        this._birthday = data.birthday;
        this._rut = data.rut;
        this._gender = data.gender;
        this._phoneNumber = data.phoneNumber;
        this._localPhoneNumber = data.localPhoneNumber;
        this._mainPictureId = data.mainPictureId;
    }

    @decorate(Length(3, 50))
    @decorate(IsString())
    get firstName(): string
    {
        return this._firstName;
    }

    @decorate(Length(3, 50))
    @decorate(IsString())
    get lastName(): string
    {
        return this._lastName;
    }

    @decorate(IsOptional())
    @decorate(IsEmail())
    get email(): string | null
    {
        return this._email;
    }

    @decorate(IsDateString())
    get birthday(): Date
    {
        return this._birthday;
    }

    @decorate(Length(2, 20))
    @decorate(IsString())
    get rut(): string
    {
        return this._rut;
    }

    @decorate(IsEnum(GenderEnum))
    get gender(): GenderEnum
    {
        return this._gender;
    }

    @decorate(IsString())
    get phoneNumber(): string
    {
        return this._phoneNumber;
    }

    @decorate(IsOptional())
    @decorate(IsString())
    get localPhoneNumber(): string | null
    {
        return this._localPhoneNumber;
    }

    @decorate(IsOptional())
    @decorate(IsUUID('4'))
    get mainPictureId(): string | null
    {
        return this._mainPictureId;
    }

    get enable(): boolean
    {
        return false;
    }

    get confirmationToken(): string | null
    {
        return null;
    }

    get passwordRequestedAt(): null
    {
        return null;
    }

    get roles(): IRoleDomain[]
    {
        return [];
    }

    get permissions(): string[]
    {
        return [];
    }

    get isSuperAdmin(): boolean
    {
        return false;
    }
}

export default UserWithoutPermissionsRequest;
