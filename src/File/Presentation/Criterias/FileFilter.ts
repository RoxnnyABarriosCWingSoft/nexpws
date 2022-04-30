import { Filter } from '@digichanges/shared-experience';

class FileFilter extends Filter
{
    static readonly SEARCH: string = 'search';

    getFields(): any
    {
        return [
            FileFilter.SEARCH
        ];
    }

    getDefaultFilters(): any
    {
        return [];
    }
}

export default FileFilter;
