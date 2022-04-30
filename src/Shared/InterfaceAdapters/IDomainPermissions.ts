import DomainPermissions from '../Utils/DomainPermissions';

interface IDomainPermissions<T>
{
    I: T | DomainPermissions;
}

export default IDomainPermissions;
