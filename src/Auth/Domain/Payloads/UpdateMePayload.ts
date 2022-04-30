import GenderEnum from '../../../User/Domain/Enums/GenderEnum';

interface UpdateMePayload
{
    firstName: string;
    lastName: string;
    email: string | null;
    birthday: Date;
    rut: string;
    gender: GenderEnum;
    phoneNumber: string;
    localPhoneNumber: string | null;
}

export default UpdateMePayload;
