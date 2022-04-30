import GenderEnum from '../Enums/GenderEnum';

interface IBuildUser
{
    firstName: string;
    lastName: string;
    email?: string | null;
    birthday: Date;
    rut: string;
    gender: GenderEnum;
    phoneNumber: string;
    localPhoneNumber?: string | null;
}


export default IBuildUser;
