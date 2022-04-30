import { decorate } from 'ts-mixer';
import { IsBoolean, IsUUID } from 'class-validator';
import SetMainPicturePayload from '../../Domain/Payloads/SetMainPicturePayload';
import Parse from '../../../Shared/Helpers/ParseHelper';

class SetMainPictureRequest implements SetMainPicturePayload
{
    private readonly _mainPictureId: string;
    private readonly _setNull: boolean;

    constructor(data: Record<string, any>)
    {
        this._mainPictureId = data.mainPictureId;
        this._setNull = Parse<boolean>(data?.setNull ?? false);
    }

    @decorate(IsUUID('4'))
    get mainPictureId(): string
    {
        return this._mainPictureId;
    }

    @decorate(IsBoolean())
    get setNull(): boolean
    {
        return this._setNull;
    }
}

export default SetMainPictureRequest;
