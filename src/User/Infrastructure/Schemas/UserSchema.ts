import { EntitySchema } from 'typeorm';
import User from '../../Domain/Entities/User';
import GenderEnum from '../../Domain/Enums/GenderEnum';

const UserSchema = new EntitySchema<User>({
    name: 'User',
    target: User,
    tableName: 'users',
    columns: {
        _id: {
            type: 'uuid',
            primary: true,
            unique: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            unique: true,
            nullable: true
        },
        birthday: {
            type: Date
        },
        rut: {
            type: String,
            unique: true
        },
        gender: {
            type: String,
            enum: GenderEnum
        },
        phoneNumber: {
            type: String,
            unique: true
        },
        localPhoneNumber: {
            type: String,
            nullable: true
        },
        password: {
            type: String,
            transformer: {
                from(val: string)
                {
                    return val;
                },
                to(val: Record<string, string>)
                {
                    return val.value;
                }
            }
        },
        permissions: {
            type: 'simple-array',
            nullable: true
        },
        enable: {
            type: 'bool',
            default: true
        },
        verify: {
            type: 'bool',
            default: false
        },
        isSuperAdmin: {
            type: 'bool',
            default: false
        },
        confirmationToken: {
            type: String,
            nullable: true
        },
        passwordRequestedAt: {
            type: Date,
            nullable: true
        },
        createdAt: {
            name: 'createdAt',
            type: 'timestamp with time zone',
            createDate: true
        },
        updatedAt: {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            updateDate: true
        }
    },
    relations: {
        roles: {
            type: 'many-to-many',
            target: 'Role',
            eager: true,
            joinTable: {
                name: 'users_has_roles',
                joinColumn: {
                    name: 'user_id'
                },
                inverseJoinColumn: {
                    name: 'role_id'
                }
            }
        },
        mainPicture: {
            type: 'one-to-one',
            target: 'File',
            joinColumn: true,
            nullable: true,
            eager: true
        }
    }
});

export default UserSchema;

