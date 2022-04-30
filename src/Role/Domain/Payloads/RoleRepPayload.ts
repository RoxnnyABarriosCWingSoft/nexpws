
interface RoleRepPayload
{
    name: string;
    slug: string;
    permissions: string[];
    enable: boolean;
    isAdmin: boolean;
}

export default RoleRepPayload;
