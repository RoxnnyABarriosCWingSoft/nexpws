import IRoleDomain from '../../../Role/Domain/Entities/IRoleDomain';
import GenderEnum from '../Enums/GenderEnum';

interface UserRepPayload
{
    firstName: string;
    lastName: string;
    email: string | null;
    birthday: Date;
    rut: string;
    gender: GenderEnum;
    phoneNumber: string;
    localPhoneNumber: string | null;
    mainPictureId: string | null;
    roles: IRoleDomain[];
    permissions: string[];
    enable: boolean;
    verify?: boolean;
    isSuperAdmin: boolean;
    confirmationToken?: string;
    passwordRequestedAt?: null;
}

export default UserRepPayload;
