import IFileDomain from '../../../File/Domain/Entities/IFileDomain';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';

interface IBuildLog
{
    type: string;
    entity: string;
    entityId: string;
    parentId?: string | null;
    files?: IFileDomain[] | null;
    authUser: IUserDomain;
}

export default IBuildLog;
