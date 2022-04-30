import IRoleDomain from '../../../Role/Domain/Entities/IRoleDomain';
import IBaseDomain from '../../../App/InterfaceAdapters/IBaseDomain';
import Password from '../../../App/Domain/ValueObjects/Password';
import GenderEnum from '../Enums/GenderEnum';
import IFileDomain from '../../../File/Domain/Entities/IFileDomain';
import IBuildUser from './IBuildUser';

interface IUserDomain extends IBaseDomain
{
    firstName: string;
    lastName: string;
    email: string | null;
    birthday: Date;
    rut: string;
    gender: GenderEnum;
    phoneNumber: string;
    localPhoneNumber: string | null;
    mainPicture: IFileDomain | null;
    password: Password;
    roles: IRoleDomain[];
    permissions: string[];
    enable: boolean;
    verify: boolean;
    isSuperAdmin: boolean;
    confirmationToken?: string;
    passwordRequestedAt?: Date;

    build(build: IBuildUser): void;
    getFullName(): string;
    setRole(role: IRoleDomain): void;
    clearRoles(): void;
    getAge(): number;
    setPassword(value: Password): void;
}

export default IUserDomain;
