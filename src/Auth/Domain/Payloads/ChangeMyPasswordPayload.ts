import UserPasswordRepPayload from '../../../User/Domain/Payloads/UserPasswordPayload';

interface ChangeMyPasswordPayload extends UserPasswordRepPayload
{
    currentPassword: string;
}

export default ChangeMyPasswordPayload;
