import { decorate, Mixin } from 'ts-mixer';
import { IsUUID } from 'class-validator';
import UserRepRequest from './UserRepRequest';
import IdRequest from '../../../App/Presentation/Requests/IdRequest';
import UserUpdatePayload from '../../Domain/Payloads/UserUpdatePayload';

class UserUpdateRequest extends Mixin(UserRepRequest, IdRequest) implements UserUpdatePayload
{
    constructor(data: Record<string, any>, id: string)
    {
        super(data);
        this._id = id;
    }
}

export default UserUpdateRequest;
