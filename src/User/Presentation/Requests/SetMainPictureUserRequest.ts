import { Mixin } from 'ts-mixer';
import SetMainPictureRequest from './SetMainPictureRequest';
import IdRequest from '../../../App/Presentation/Requests/IdRequest';
import SetMainPictureUserPayload from '../../Domain/Payloads/SetMainPictureUserPayload';

class SetMainPictureUserRequest extends Mixin(SetMainPictureRequest, IdRequest) implements SetMainPictureUserPayload
{
    constructor(data: Record<string, any> | any)
    {
        super(data);
    }
}

export default SetMainPictureUserRequest;
