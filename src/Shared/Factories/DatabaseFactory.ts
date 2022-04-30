import MainConfig from '../../Config/mainConfig';
import MongooseCreateConnection from '../Database/MongooseCreateConnection';
import { ICreateConnection } from '@digichanges/shared-experience';
import TypeORMCreateConnection from '../Database/TypeORMCreateConnection';

class DatabaseFactory
{
    private dbDefault: string;

    create(dbDefault?: 'TypeORM' | 'Mongoose'): ICreateConnection
    {
        const mainConfig = MainConfig.getInstance();

        if (!dbDefault)
        {
            this.dbDefault = mainConfig.getConfig().dbConfig.default;
        }
        else
        {
            this.dbDefault = dbDefault;
        }

        const dbConfig: any = mainConfig.getConfig().dbConfig;
        const config = dbConfig[this.dbDefault];

        const createConnections: Record<string, any> = {
            TypeORM: TypeORMCreateConnection,
            Mongoose: MongooseCreateConnection
        };

        return new createConnections[this.dbDefault](config);
    }
}

export default DatabaseFactory;
