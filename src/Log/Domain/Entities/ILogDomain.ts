import IBaseDomain from '../../../App/InterfaceAdapters/IBaseDomain';
import LogActionEnum from '../Enums/LogActionEnum';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import IFileDomain from '../../../File/Domain/Entities/IFileDomain';
import IBuildLog from './IBuildLog';

interface ILogDomain extends IBaseDomain
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

    build(build: IBuildLog): void
}

export default ILogDomain;
