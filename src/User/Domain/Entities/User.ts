import IRoleDomain from '../../../Role/Domain/Entities/IRoleDomain';
import IUserDomain from './IUserDomain';
import Base from '../../../App/Domain/Entities/Base';
import Password from '../../../App/Domain/ValueObjects/Password';
import GenderEnum from '../Enums/GenderEnum';
import IFileDomain from '../../../File/Domain/Entities/IFileDomain';
import moment from 'moment';
import IBuildUser from './IBuildUser';

class User extends Base implements IUserDomain
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

    constructor(build?: IBuildUser)
    {
        super();
        if (build)
        {
            this.build(build);
        }
    }

    build(build: IBuildUser)
    {
        this.firstName = build.firstName;
        this.lastName = build.lastName;
        this.email = build?.email ?? null;
        this.rut = build.rut;
        this.birthday = build.birthday;
        this.gender = build.gender;
        this.phoneNumber = build.phoneNumber;
        this.localPhoneNumber = build?.localPhoneNumber ?? null;
    }

    setPassword(value: Password)
    {
        this.password = value;
    }

    getFullName(): string
    {
        return `${this.firstName} ${this.lastName}`;
    }

    clearRoles(): void
    {
        this.roles = [];
    }

    setRole(role: IRoleDomain): void
    {
        const find = this.roles.find((_role) => _role.getId().toString() === role.getId().toString());

        if (!find)
        {
            this.roles.push(role);
        }
    }

    getAge(): number
    {
        return  moment().diff(this.birthday, 'years', false);
    }
}

export default User;
