import { IsBoolean, IsDefined } from 'class-validator';
import { decorate } from 'ts-mixer';
import CryptedRepPayload from '../../Domain/Payloads/CryptedRepPayload';

class CryptedRepRequest implements CryptedRepPayload
{
    private readonly _allowNulls: boolean;
    private readonly _value: string;

    constructor(data: Record<string, any>)
    {
        this._allowNulls = data.allowNulls;
        this._value = data.value;
    }

    @decorate(IsBoolean())
    get allowNulls(): boolean
    {
        return this._allowNulls;
    }

    @decorate(IsDefined())
    get value(): string
    {
        return this._value;
    }
}

export default CryptedRepRequest;
