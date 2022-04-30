import cors from 'koa-cors';
import helmet from 'koa-helmet';
import hbshbs from 'koa-hbs';

import AuthenticationMiddleware from '../../../Auth/Presentation/Middlewares/AuthenticationMiddleware';
import RedirectRouteNotFoundMiddleware from '../Middlewares/RedirectRouteNotFoundMiddleware';
import Throttle from '../Middlewares/Throttle';
import VerifyTokenMiddleware from '../../../Auth/Presentation/Middlewares/VerifyTokenMiddleware';
import IApp from '../../InterfaceAdapters/IApp';
import Locales from './Locales';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import IndexHandler from '../Handlers/IndexHandler';
import RoleHandler from '../../../Role/Presentation/Handlers/RoleHandler';
import UserHandler from '../../../User/Presentation/Handlers/UserHandler';
import NotificationHandler from '../../../Notification/Presentation/Handlers/NotificationHandler';
import FileHandler from '../../../File/Presentation/Handlers/FileHandler';
import AuthHandler from '../../../Auth/Presentation/Handlers/AuthHandler';
import IAppConfig from '../../InterfaceAdapters/IAppConfig';
import WhiteListHandler from '../../Tests/WhiteListHandler';
import { ErrorHandler } from './ErrorHandler';
import MainConfig from '../../../Config/mainConfig';
import LoggerMiddleware from '../Middlewares/LoggerMiddleware';
import Logger from '../../../Shared/Logger/Logger';
import LogHandler from '../../../Log/Presentation/Handlers/LogHandler';
import DecryptMiddleware from '../Middlewares/DecryptMiddleware';
import CryptedHandler from '../../../Crypted/Presentation/Handlers/CryptedHandler';

class AppKoa implements IApp
{
    public port?: number;
    private readonly app: Koa;
    private locales: Locales;
    private config: IAppConfig;

    constructor(config: IAppConfig)
    {
        this.port = config.serverPort || 8090;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        this.app = require('koa-qs')(new Koa());
        this.locales = Locales.getInstance();
        this.config = config;
    }

    public initConfig()
    {
        this.app.use(cors({
            credentials: true
        }));
        this.app.proxy = MainConfig.getInstance().getConfig().env === 'production';
        this.app.use(helmet());
        this.app.use(hbshbs.middleware({
            viewPath: this.config.viewRouteEngine
        }));

        // Generic error handling middleware.
        this.app.use(ErrorHandler.handle);

        this.app.use(bodyParser({
            jsonLimit: '5mb'
        }));

        this.app.use(LoggerMiddleware);
        this.app.use(Throttle);
        this.app.use(AuthenticationMiddleware);
        this.app.use(VerifyTokenMiddleware);
        this.app.use(DecryptMiddleware);
    }

    public build(): void
    {
        // Route middleware.
        this.app.use(IndexHandler.routes());
        this.app.use(IndexHandler.allowedMethods());

        this.app.use(WhiteListHandler.routes());
        this.app.use(WhiteListHandler.allowedMethods());

        this.app.use(RoleHandler.routes());
        this.app.use(RoleHandler.allowedMethods());

        this.app.use(UserHandler.routes());
        this.app.use(UserHandler.allowedMethods());

        this.app.use(NotificationHandler.routes());
        this.app.use(NotificationHandler.allowedMethods());

        this.app.use(FileHandler.routes());
        this.app.use(FileHandler.allowedMethods());

        this.app.use(AuthHandler.routes());
        this.app.use(AuthHandler.allowedMethods());

        this.app.use(LogHandler.routes());
        this.app.use(LogHandler.allowedMethods());

        if (MainConfig.getInstance().getConfig().env === 'local')
        {
            this.app.use(CryptedHandler.routes());
            this.app.use(CryptedHandler.allowedMethods());
        }

        this.app.use(RedirectRouteNotFoundMiddleware);
    }

    public listen(): any
    {
        return this.app.listen(this.port, () =>
        {
            Logger.info(`Koa is listening to http://localhost:${this.port}`);
        });
    }

    public callback(): any
    {
        return this.app.callback();
    }
}

export default AppKoa;
