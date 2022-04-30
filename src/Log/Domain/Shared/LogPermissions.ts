import IGroupPermission from '../../../Shared/InterfaceAdapters/IGroupPermission';
import DomainPermissions from '../../../Shared/Utils/DomainPermissions';
import { domainPermissions } from '../../../Shared/Decorators/DomainPermissions';

@domainPermissions<LogPermissions>()
class LogPermissions extends DomainPermissions
{
    readonly LIST: string = 'logsList';
    readonly LIST_USERS: string = 'logsListUsers';
    readonly LIST_ROLES: string = 'logsListRoles';
    readonly LIST_AUTH_USER: string = 'logsListAuthUser';
    readonly LIST_TURNS: string = 'logsListTurns';

    static get I(): LogPermissions
    {
        return <LogPermissions> this.instance ?? new LogPermissions();
    }

    group(): IGroupPermission
    {
        return <IGroupPermission> {
            group: 'LOGS',
            permissions: this.get()
        };
    }

    get(): string[]
    {
        return this.permissions ?? [
            this.LIST,
            this.LIST_USERS,
            this.LIST_ROLES,
            this.LIST_AUTH_USER,
            this.LIST_TURNS
        ];
    }
}

export default LogPermissions;

