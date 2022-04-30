import { ParsedQs } from 'qs';

import RequestCriteria from '../../../App/Presentation/Requests/RequestCriteria';

import LogSort from '../Criterias/LogSort';
import LogFilter from '../Criterias/LogFilter';
import Pagination from '../../../App/Presentation/Shared/Pagination';
import { decorate } from 'ts-mixer';
import { IsUUID } from 'class-validator';
import LogDomainsCriteriaPayload from '../../Domain/Payloads/LogDomainsCriteriaPayload';

class LogDomainsRequestCriteria extends RequestCriteria implements LogDomainsCriteriaPayload
{
    protected _id: string;

    constructor(query: ParsedQs, url: string, id: string)
    {
        super(new LogSort(query), new LogFilter(query), new Pagination(query, url));
        this._id = id;
    }

    @decorate(IsUUID('4'))
    get id(): string
    {
        return this._id;
    }
}

export default LogDomainsRequestCriteria;
