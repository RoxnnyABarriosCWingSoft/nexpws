import { Filter } from '@digichanges/shared-experience';

class RoleFilter extends Filter
{
    static readonly ENABLE: string = 'enable';
    static readonly OF_SYSTEM: string = 'ofSystem';
    static readonly IS_ADMIN: string = 'isAdmin';
    static readonly SEARCH: string = 'search';

    getFields(): any
    {
        return [
            RoleFilter.ENABLE,
            RoleFilter.OF_SYSTEM,
            RoleFilter.IS_ADMIN,
            RoleFilter.SEARCH
        ];
    }

    getDefaultFilters(): any
    {
        return [];
    }
}

export default RoleFilter;
