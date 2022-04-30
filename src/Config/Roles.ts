import AdminRole from '../App/Domain/Shared/AdminRole';

class Roles
{
    static getRoles(): any
    {
        const admin = AdminRole.I;

        admin.allPermissions();

        return {
            [admin.NAME]: admin.get()
        };
    }
}

export default Roles;
