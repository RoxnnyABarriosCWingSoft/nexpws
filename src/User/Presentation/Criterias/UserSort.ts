import { Sort } from '@digichanges/shared-experience';

class UserSort extends Sort
{
    static readonly FIRST_NAME: string = 'firstName';
    static readonly LAST_NAME: string = 'lastName';
    static readonly EMAIL: string = 'email';
    static readonly RUT: string = 'rut';
    static readonly PHONE_NUMBER: string = 'phoneNumber';
    static readonly LOCAL_PHONE_NUMBER: string = 'localPhoneNumber';
    static readonly CREATED_AT: string = 'createdAt';

    getFields(): any
    {
        return [
            UserSort.FIRST_NAME,
            UserSort.LAST_NAME,
            UserSort.EMAIL,
            UserSort.RUT,
            UserSort.PHONE_NUMBER,
            UserSort.LOCAL_PHONE_NUMBER,
            UserSort.CREATED_AT
        ];
    }

    getDefaultSorts(): any
    {
        return [
            { [UserSort.CREATED_AT]: 'DESC' }
        ];
    }
}

export default UserSort;
