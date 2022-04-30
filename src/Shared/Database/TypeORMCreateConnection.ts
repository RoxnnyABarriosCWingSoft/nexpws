import { Connection, createConnection } from 'typeorm';
import { newDb } from 'pg-mem';
import { ICreateConnection } from '@digichanges/shared-experience';

import TokenSchema from '../../Auth/Infrastructure/Schemas/TokenSchema';
import entities from '../../entities';


class TypeORMCreateConnection implements ICreateConnection
{
    private readonly config: any;
    private connection: Connection;
    private createInstanceConnection: any;
    private entities = [
        ...entities
    ];

    constructor(config: any)
    {
        this.config = config;
    }

    initConfig(): any
    {
        this.createInstanceConnection = async() =>
        {
            this.connection = await createConnection({ ...this.config, entities: this.entities });

            return this.connection;
        };
    }

    initConfigTest(uri: string): any
    {
        // ==== create a memory db
        const db = newDb({
            autoCreateForeignKeyIndices: true
        });

        db.public.registerFunction({
            implementation: () => 'lovalledor',
            name: 'current_database'
        });

        this.createInstanceConnection = async() =>
        {
            this.connection = await db.adapters.createTypeormConnection({
                type: 'postgres',
                entities: [...this.entities, TokenSchema]
            });

            return await this.connection.synchronize();
        };
    }

    async create(): Promise<any>
    {
        return await this.createInstanceConnection();
    }

    async close(): Promise<any>
    {
        await this.connection.close();
        return this.connection;
    }

    async drop(): Promise<any>
    {
        return Promise.resolve(undefined); // TODO: drop
    }
}

export default TypeORMCreateConnection;
