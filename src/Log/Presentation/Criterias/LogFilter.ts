import { Filter } from '@digichanges/shared-experience';

class LogFilter extends Filter
{
    static readonly ACTION: string = 'action';
    static readonly ENTITY: string = 'entity';
    static readonly ENTITY_ID: string = 'entityId';
    static readonly SEARCH: string = 'search';

    getFields(): any
    {
        return [
            LogFilter.ACTION,
            LogFilter.ENTITY,
            LogFilter.ENTITY_ID,
            LogFilter.SEARCH
        ];
    }

    getDefaultFilters(): any
    {
        return [];
    }
}

export default LogFilter;
