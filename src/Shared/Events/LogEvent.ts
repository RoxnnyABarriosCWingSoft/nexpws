import LoggerService, {
    ILogLoginProps, ILogLogoutProps,
    ILogRemoveProps,
    ILogSaveProps,
    ILogUpdateProps
} from '../../Log/Domain/Services/LoggerService';

class LogEvent
{
    public static LOG_LOGIN_EVENT = 'LOG_LOGIN_EVENT';
    public static LOG_LOGOUT_EVENT = 'LOG_LOGOUT_EVENT';
    public static LOG_SAVE_EVENT = 'LOG_SAVE_EVENT';
    public static LOG_UPDATE_EVENT = 'LOG_UPDATE_EVENT';
    public static LOG_REMOVE_EVENT = 'LOG_REMOVE_EVENT';

    public static login = async(props: ILogLoginProps) =>
    {
        void await LoggerService.login(props);
    };

    public static logout = async(props: ILogLogoutProps) =>
    {
        void await LoggerService.logout(props);
    };

    public static save = async(props: ILogSaveProps) =>
    {
        void await LoggerService.save(props);
    };

    public static update = async(props: ILogUpdateProps) =>
    {
        void await LoggerService.update(props);
    };

    public static remove = async(props: ILogRemoveProps) =>
    {
        void await LoggerService.remove(props);
    };
}

export default LogEvent;
