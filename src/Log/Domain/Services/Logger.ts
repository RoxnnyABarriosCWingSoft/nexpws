import EventHandler from '../../../Shared/Events/EventHandler';
import { ILogLoginProps, ILogLogoutProps, ILogRemoveProps, ILogSaveProps, ILogUpdateProps } from './LoggerService';
import LogEvent from '../../../Shared/Events/LogEvent';
import _ from 'lodash';

class Logger
{
    private static readonly eventHandler = EventHandler.getInstance();

    static async login(props: ILogLoginProps): Promise<void>
    {
        await this.eventHandler.execute(LogEvent.LOG_LOGIN_EVENT, props);
    }

    static async logout(props: ILogLogoutProps): Promise<void>
    {
        await this.eventHandler.execute(LogEvent.LOG_LOGOUT_EVENT, props);
    }

    static async save(props: ILogSaveProps): Promise<void>
    {
        await this.eventHandler.execute(LogEvent.LOG_SAVE_EVENT, props);
    }

    static async update<T = any>(props: ILogUpdateProps<T>): Promise<void>
    {
        await this.eventHandler.execute(LogEvent.LOG_UPDATE_EVENT, props);
    }

    static async remove<T = any>(props: ILogRemoveProps<T>): Promise<void>
    {
        await this.eventHandler.execute(LogEvent.LOG_REMOVE_EVENT, props);
    }

    static copy<T = any>(value: T): T
    {
        return _.cloneDeep<T>(value);
    }
}

export default Logger;
