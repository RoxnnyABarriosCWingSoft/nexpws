import ISeed from '../../../Shared/InterfaceAdapters/ISeed';
import UserSeedService, { IUserSeedData } from '../Services/UserSeedService';
import GenderEnum from '../../Domain/Enums/GenderEnum';
import moment from 'moment';

class UserSeed implements ISeed
{
    public async init(): Promise<void>
    {
        const data: IUserSeedData[] = [
            {
                firstName: 'User',
                lastName: 'Super Admin',
                rut: '12.345.678-9',
                email: 'superadmin@wingsoft.com',
                birthday: moment('1990-04-07').toDate(),
                gender: GenderEnum.MALE,
                phoneNumber: '04143819771',
                enable: true,
                isSuperAdmin: true,
                verify: true
            },
            {
                firstName: 'User',
                lastName: 'Admin',
                rut: '23.456.789-0',
                email: 'admin@wingsoft.com',
                birthday: moment('1995-12-07').toDate(),
                gender: GenderEnum.MALE,
                phoneNumber: '04143819772',
                role: 'admin',
                enable: true,
                verify: true
            }
        ];

        await UserSeedService.load(data);
    }
}


export default UserSeed;
