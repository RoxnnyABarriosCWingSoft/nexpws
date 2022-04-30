import DatabaseFactory from './Shared/Factories/DatabaseFactory';
import { validateEnv } from './Config/validateEnv';
import { ICreateConnection } from '@digichanges/shared-experience';

const initCommand = async() =>
{
    validateEnv();

    const databaseFactory = new DatabaseFactory();

    const createConnectionTypeORM: ICreateConnection = databaseFactory.create('TypeORM');
    createConnectionTypeORM.initConfig();
    await createConnectionTypeORM.create();

    const createConnectionMongoose: ICreateConnection = databaseFactory.create('Mongoose');
    createConnectionMongoose.initConfig();
    await createConnectionMongoose.create();
};

export default initCommand;
