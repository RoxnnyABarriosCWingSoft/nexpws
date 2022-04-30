import IApp from '../../InterfaceAdapters/IApp';
import AppKoa from '../Shared/AppKoa';
import IAppConfig from '../../InterfaceAdapters/IAppConfig';

class AppFactory
{
    static create(appName = 'AppExpress', config: IAppConfig): IApp
    {
        const strategy: Record<string, any> = {
            [AppKoa.name]: AppKoa
        };

        return new strategy[appName](config);
    }
}

export default AppFactory;
