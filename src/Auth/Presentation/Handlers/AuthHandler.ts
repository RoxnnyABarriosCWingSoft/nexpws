import Koa from 'koa';
import Router from 'koa-router';
import { IPaginator, StatusCode } from '@digichanges/shared-experience';
import Responder from '../../../App/Presentation/Shared/Responder';
import AuthRequest from '../Requests/AuthRequest';
import AuthController from '../Controllers/AuthController';
import AuthTransformer from '../Transformers/AuthTransformer';
import RefreshTokenRequest from '../Requests/RefreshTokenRequest';
import ForgotPasswordRequest from '../Requests/ForgotPasswordRequest';
import ChangeForgotPasswordRequest from '../Requests/ChangeForgotPasswordRequest';
import PermissionsTransformer from '../Transformers/PermissionsTransformer';
import AuthorizeMiddleware from '../Middlewares/AuthorizeMiddleware';
import { AuthUser } from '../Helpers/AuthUser';
import moment from 'moment';
import DefaultTransformer from '../../../App/Presentation/Transformers/DefaultTransformer';
import UpdateMeRequest from '../Requests/UpdateMeRequest';
import VerifyYourAccountRequest from '../Requests/VerifyYourAccountRequest';
import RefreshTokenMiddleware from '../Middlewares/RefreshTokenMiddleware';
import MainConfig from '../../../Config/mainConfig';
import AuthUserTransformer from '../Transformers/AuthUserTransformer';
import ChangeMyPasswordRequest from '../Requests/ChangeMyPasswordRequest';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import DataResponseMessage from '../../../App/Presentation/Transformers/Response/DataResponseMessage';
import ResponseMessageEnum from '../../../App/Domain/Enum/ResponseMessageEnum';
import DefaultMessageTransformer from '../../../App/Presentation/Transformers/DefaultMessageTransformer';
import UserPermissions from '../../../User/Domain/Shared/UserPermissions';
import AppPermissions from '../../../App/Domain/Shared/AppPermissions';
import LogPermissions from '../../../Log/Domain/Shared/LogPermissions';
import LogRequestCriteria from '../../../Log/Presentation/Requests/LogRequestCriteria';
import LogTransformer from '../../../Log/Presentation/Transformers/LogTransformer';
import User from '../../../User/Domain/Entities/User';
import SetMainPictureRequest from '../../../User/Presentation/Requests/SetMainPictureRequest';

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/auth'
};

const AuthHandler: Router = new Router(routerOpts);
const responder: Responder = new Responder();
const controller = new AuthController();
const config = MainConfig.getInstance().getConfig();

AuthHandler.get('/me', async(ctx: Koa.ParameterizedContext & any) =>
{
    void await responder.send(AuthUser(ctx), ctx, StatusCode.HTTP_OK, new AuthUserTransformer());
});

AuthHandler.put('/me', async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new UpdateMeRequest(ctx.request.body);

    const payload = await controller.updateMe(_request, AuthUser(ctx));

    void await responder.send(payload, ctx, StatusCode.HTTP_CREATED, new AuthUserTransformer());
});

AuthHandler.put('/me/set-my-main-picture/:mainPictureId', async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new SetMainPictureRequest({
        mainPictureId: ctx.params?.mainPictureId,
        setNull: ctx.request.query?.setNull
    });

    const user: IUserDomain = await controller.setMyMainPicture(_request, AuthUser(ctx));
    const responseData = new DataResponseMessage(user.getId(), ResponseMessageEnum.UPDATED);
    void await responder.send(responseData, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer());
});

AuthHandler.post('/login', async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new AuthRequest(ctx.request.body);

    const payload = await controller.login(_request);

    ctx.cookies.set(
        'refreshToken',
        payload.getRefreshHash(),
        {
            expires: moment.unix(payload.getExpires()).toDate(),
            maxAge: payload.getExpires(),
            path: '/api/auth',
            secure: config.setCookieSecure,
            httpOnly: true,
            sameSite: config.setCookieSameSite
        }
    );

    void await responder.send(payload, ctx, StatusCode.HTTP_CREATED, new AuthTransformer());
});

AuthHandler.post('/logout', async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new RefreshTokenRequest(ctx.refreshToken);

    const payload = await controller.logout(_request, AuthUser(ctx, 'tokenDecode'), AuthUser(ctx));

    ctx.cookies.set('refreshToken', null);

    void await responder.send(payload, ctx, StatusCode.HTTP_OK, new DefaultTransformer());
});

AuthHandler.post('/refresh-token', RefreshTokenMiddleware, async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new RefreshTokenRequest(ctx.refreshToken);

    const payload = await controller.refreshToken(_request);

    ctx.cookies.set(
        'refreshToken',
        payload.getRefreshHash(),
        {
            expires: moment.unix(payload.getExpires()).toDate(),
            maxAge: payload.getExpires(),
            path: '/api/auth',
            secure: config.setCookieSecure,
            httpOnly: true,
            sameSite: config.setCookieSameSite
        });

    void await responder.send(payload, ctx, StatusCode.HTTP_OK, new AuthTransformer());
});

AuthHandler.put('/change-my-password', AuthorizeMiddleware('some', UserPermissions.I.CHANGE_MY_PASSWORD), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new ChangeMyPasswordRequest(ctx.request.body);

    const user: IUserDomain = await controller.changeMyPassword(_request, AuthUser(ctx));
    const responseData = new DataResponseMessage(user.getId(), ResponseMessageEnum.UPDATED);
    void await responder.send(responseData, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer());
});

AuthHandler.post('/forgot-password', async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new ForgotPasswordRequest(ctx.request.body);

    const payload = await controller.forgotPassword(_request);

    void await responder.send(payload, ctx, StatusCode.HTTP_CREATED);
});

AuthHandler.put('/change-forgot-password', async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new ChangeForgotPasswordRequest(ctx.request.body);

    const payload = await controller.changeForgotPassword(_request);

    void await responder.send(payload, ctx, StatusCode.HTTP_CREATED);
});

AuthHandler.put('/verify-your-account/:confirmationToken', async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new VerifyYourAccountRequest(ctx.params.confirmationToken);

    const payload = await controller.verifyYourAccount(_request);

    void await responder.send(payload, ctx, StatusCode.HTTP_CREATED, new DefaultTransformer());
});

AuthHandler.get('/permissions', AuthorizeMiddleware('some', AppPermissions.I.GET_PERMISSIONS), async(ctx: Koa.ParameterizedContext) =>
{
    const payload = controller.permissions();

    void await responder.send(payload, ctx, StatusCode.HTTP_OK, new PermissionsTransformer());
});

AuthHandler.post('/sync-roles-permissions', AuthorizeMiddleware('some',  AppPermissions.I.SYNC_PERMISSIONS), async(ctx: Koa.ParameterizedContext & any) =>
{
    controller.syncRolesPermissions();

    void await responder.send({ message: 'Sync Successfully' }, ctx, StatusCode.HTTP_CREATED);
});

AuthHandler.get('/logs', AuthorizeMiddleware('some',  LogPermissions.I.LIST_AUTH_USER), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new LogRequestCriteria(ctx.request.query, ctx.request.url);

    const paginator: IPaginator = await controller.logs(_request, { entity: User.name, entityId: AuthUser<IUserDomain>(ctx).getId() });

    await responder.paginate(paginator, ctx, StatusCode.HTTP_OK, new LogTransformer());
});

export default AuthHandler;
