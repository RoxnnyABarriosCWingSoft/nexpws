import mongoose from 'mongoose';
import MainConfig from '../../Config/mainConfig';
import { ICreateConnection } from '@digichanges/shared-experience';

import INotificationDocument from '../../Notification/InterfaceAdapters/INotificationDocument';

import {
    EmailNotificationSchema,
    NotificationSchema,
    PushNotificationSchema
} from '../../Notification/Infrastructure/Schemas/NotificationSchema';

export let connection: mongoose.Connection = null;

class MongooseCreateConnection implements ICreateConnection
{
    private readonly config: any;
    private uri: string;

    constructor(config: any)
    {
        this.config = config;
        this.uri = '';
    }

    async initConfig()
    {
        const config = MainConfig.getInstance().getConfig().dbConfig.Mongoose;
        this.uri = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
    }

    async initConfigTest(uri: string)
    {
        this.uri = uri;
    }

    async create(): Promise<any>
    {
        connection = mongoose.createConnection(this.uri);
        // Infrastructure
        const NotificationModel = connection.model<INotificationDocument>('Notification', NotificationSchema);
        NotificationModel.discriminator('EmailNotification', EmailNotificationSchema);
        NotificationModel.discriminator('PushNotification', PushNotificationSchema);

        return connection;
    }

    async close(): Promise<any>
    {
        await connection.close(true);
    }

    async drop(): Promise<any>
    {
        const collections = await connection.db.collections();

        for (const collection of collections)
        {
            await collection.drop();
        }
    }
}

export default MongooseCreateConnection;
