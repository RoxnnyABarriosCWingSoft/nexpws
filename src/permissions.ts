import AppPermissions from './App/Domain/Shared/AppPermissions';
import UserPermissions from './User/Domain/Shared/UserPermissions';
import RolePermissions from './Role/Domain/Shared/RolePermissions';
import FilePermissions from './File/Domain/Shared/FilePermissions';
import LogPermissions from './Log/Domain/Shared/LogPermissions';

const permissions = [
    AppPermissions.I,
    UserPermissions.I,
    RolePermissions.I,
    FilePermissions.I,
    LogPermissions.I
];

export default permissions;

