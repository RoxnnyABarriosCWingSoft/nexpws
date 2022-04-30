import DomainRoles from '../Utils/DomainRoles';

interface IDomainRoles<T>
{
    I: T | DomainRoles;
}

export default IDomainRoles;
