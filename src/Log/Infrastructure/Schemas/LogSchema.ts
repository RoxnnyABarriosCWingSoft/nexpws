import { EntitySchema } from 'typeorm';
import Log from '../../Domain/Entities/Log';
import LogActionEnum from '../../Domain/Enums/LogActionEnum';

const LogSchema = new EntitySchema<Log>({
    name: 'Log',
    target: Log,
    tableName: 'logs',
    columns: {
        _id: {
            type: 'uuid',
            primary: true,
            unique: true
        },
        type: {
            type: String
        },
        action: {
            type: String,
            enum: LogActionEnum
        },
        entity: {
            type: String
        },
        entityId: {
            type: String
        },
        parentId: {
            type: String
        },
        description: {
            type: String
        },
        metadata: {
            type: 'jsonb',
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
        createdBy: {
            type: 'many-to-one',
            target: 'User',
            eager: true,
            joinColumn: true
        },
        files: {
            type: 'many-to-many',
            target: 'File',
            eager: true,
            joinTable: {
                name: 'logs_has_files',
                joinColumn: {
                    name: 'log_id'
                },
                inverseJoinColumn: {
                    name: 'file_id'
                }
            }
        }
    }
});

export default LogSchema;

