
interface IBuildRole
{
    name: string;
    slug: string;
    enable: boolean;
    isAdmin: boolean;
    permissions: string[];
}

export default IBuildRole;
