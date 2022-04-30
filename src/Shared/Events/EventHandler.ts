import EventEmitter from 'promise-events';
import UserCreatedEvent from './UserCreatedEvent';
import ForgotPasswordEvent from './ForgotPasswordEvent';
import SendMessageEvent from './SendMessageEvent';
import RegisterEvent from './RegisterEvent';
import VerifiedAccountEvent from './VerifiedAccountEvent';
import LogEvent from './LogEvent';

class EventHandler extends EventEmitter
{
    private static instance: EventHandler;

    private constructor()
    {
        super();
    }

    static getInstance(): EventHandler
    {
        if (!EventHandler.instance)
        {
            EventHandler.instance = new EventHandler();
        }

        return EventHandler.instance;
    }

    public async execute(event: string | symbol, ...args: any[])
    {
        await this.emit(event, ...args);
    }

    public async setListeners()
    {
        await this.on(UserCreatedEvent.USER_CREATED_EVENT, UserCreatedEvent.userCreatedListener);
        await this.on(ForgotPasswordEvent.FORGOT_PASSWORD_EVENT, ForgotPasswordEvent.forgotPasswordListener);
        await this.on(SendMessageEvent.SEND_MESSAGE_EVENT, SendMessageEvent.sendMessageListener);
        await this.on(RegisterEvent.REGISTER_EVENT, RegisterEvent.sendEmailListener);
        await this.on(VerifiedAccountEvent.VERIFIED_ACCOUNT_EVENT, VerifiedAccountEvent.sendEmailListener);

        await this.on(LogEvent.LOG_LOGIN_EVENT, LogEvent.login);
        await this.on(LogEvent.LOG_LOGOUT_EVENT, LogEvent.logout);
        await this.on(LogEvent.LOG_SAVE_EVENT, LogEvent.save);
        await this.on(LogEvent.LOG_UPDATE_EVENT, LogEvent.update);
        await this.on(LogEvent.LOG_REMOVE_EVENT, LogEvent.remove);
    }
}

export default EventHandler;
