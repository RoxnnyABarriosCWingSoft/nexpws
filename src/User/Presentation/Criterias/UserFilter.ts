import { Filter } from '@digichanges/shared-experience';

class UserFilter extends Filter
{
    static readonly ENABLE: string = 'enable';
    static readonly IS_SUPER_ADMIN: string = 'isSuperAdmin';
    static readonly VERIFY: string = 'verify';
    static readonly SEARCH: string = 'search';

    getFields(): any
    {
        return [
            UserFilter.ENABLE,
            UserFilter.IS_SUPER_ADMIN,
            UserFilter.VERIFY,
            UserFilter.SEARCH

        ];
    }

    getDefaultFilters(): any
    {
        return [
            { [UserFilter.IS_SUPER_ADMIN]: false }
        ];
    }
}

export default UserFilter;
