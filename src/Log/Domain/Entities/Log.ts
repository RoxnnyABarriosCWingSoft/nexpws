import ILogDomain from './ILogDomain';
import Base from '../../../App/Domain/Entities/Base';
import IBuildLog from './IBuildLog';
import LogActionEnum from '../Enums/LogActionEnum';
import IFileDomain from '../../../File/Domain/Entities/IFileDomain';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';

class Log extends Base implements ILogDomain
{
    type: string;
    action: LogActionEnum;
    entity: string;
    entityId: string;
    parentId: string;
    description: string;
    files: IFileDomain[] | null;
    metadata: Record<string, any>;
    createdBy: IUserDomain;

    constructor(build?: IBuildLog)
    {
        super();
        if (build)
        {
            this.build(build);
        }
    }

    build(build: IBuildLog): void
    {
        this.type = build.type;
        this.entity = build.entity;
        this.entityId = build.entityId;
        this.parentId = build?.parentId ?? build.entityId;
        this.files = build?.files ?? null;
        this.createdBy = build.authUser;
    }
}

export default Log;
