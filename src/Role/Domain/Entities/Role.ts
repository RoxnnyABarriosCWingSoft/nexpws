import IRoleDomain from './IRoleDomain';
import Base from '../../../App/Domain/Entities/Base';
import AuthHelper from '../../../Shared/Helpers/AuthHelper';
import IBuildRole from './IBuildRole';

class Role extends Base implements IRoleDomain
{
    name: string;
    slug: string;
    enable: boolean;
    ofSystem: boolean;
    isAdmin: boolean;
    permissions: string[];

    constructor(build?: IBuildRole)
    {
        super();
        if (build)
        {
            this.build(build);
        }
    }

    build(build: IBuildRole): void
    {
        AuthHelper.validatePermissions(build.permissions);

        this.name = build.name;
        this.slug = build.slug;
        this.enable = build.enable;
        this.isAdmin = build.isAdmin;
        this.permissions = build.permissions;
    }
}

export default Role;
