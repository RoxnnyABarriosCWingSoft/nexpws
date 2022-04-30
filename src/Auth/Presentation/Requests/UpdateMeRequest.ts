import { decorate } from 'ts-mixer';
import GenderEnum from '../../../User/Domain/Enums/GenderEnum';
import UpdateMePayload from '../../Domain/Payloads/UpdateMePayload';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

class UpdateMeRequest implements UpdateMePayload
{
    private readonly _firstName: string;
    private readonly _lastName: string;
    private readonly _email: string | null;
    private readonly _birthday: Date;
    private readonly _rut: string;
    private readonly _gender: GenderEnum;
    private readonly _phoneNumber: string;
    private readonly _localPhoneNumber: string | null;

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
}

export default UpdateMeRequest;
