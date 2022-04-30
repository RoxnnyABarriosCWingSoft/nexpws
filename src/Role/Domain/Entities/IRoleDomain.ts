import IBaseDomain from '../../../App/InterfaceAdapters/IBaseDomain';
import IBuildRole from './IBuildRole';

interface IRoleDomain extends IBaseDomain
{
    name: string;
    slug: string;
    enable: boolean;
    ofSystem: boolean;
    isAdmin: boolean;
    permissions: string[];

    build(build: IBuildRole): void
}

export default IRoleDomain;
