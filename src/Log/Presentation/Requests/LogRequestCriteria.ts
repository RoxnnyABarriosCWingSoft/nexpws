import { ParsedQs } from 'qs';
import { ICriteria } from '@digichanges/shared-experience';

import RequestCriteria from '../../../App/Presentation/Requests/RequestCriteria';

import LogSort from '../Criterias/LogSort';
import LogFilter from '../Criterias/LogFilter';
import Pagination from '../../../App/Presentation/Shared/Pagination';

class LogRequestCriteria extends RequestCriteria implements ICriteria
{
    constructor(query: ParsedQs, url: string)
    {
        super(new LogSort(query), new LogFilter(query), new Pagination(query, url));
    }
}

export default LogRequestCriteria;
