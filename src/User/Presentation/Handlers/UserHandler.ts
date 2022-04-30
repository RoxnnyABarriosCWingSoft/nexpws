import Koa from 'koa';
import Router from 'koa-router';
import { IPaginator, StatusCode } from '@digichanges/shared-experience';
import Responder from '../../../App/Presentation/Shared/Responder';
import IdRequest from '../../../App/Presentation/Requests/IdRequest';
import UserController from '../Controllers/UserControllers';
import IUserDomain from '../../Domain/Entities/IUserDomain';
import UserRequestCriteria from '../Requests/UserRequestCriteria';
import UserUpdateRequest from '../Requests/UserUpdateRequest';
import UserSaveRequest from '../Requests/UserSaveRequest';
import UserAssignRoleRequest from '../Requests/UserAssignRoleRequest';
import ChangeUserPasswordRequest from '../Requests/ChangeUserPasswordRequest';
import UserTransformer from '../Transformers/UserTransformer';
import AuthorizeMiddleware from '../../../Auth/Presentation/Middlewares/AuthorizeMiddleware';
import ResponseMessageEnum from '../../../App/Domain/Enum/ResponseMessageEnum';
import DefaultMessageTransformer from '../../../App/Presentation/Transformers/DefaultMessageTransformer';
import DataResponseMessage from '../../../App/Presentation/Transformers/Response/DataResponseMessage';
import { AuthUser } from '../../../Auth/Presentation/Helpers/AuthUser';
import UserPermissions from '../../Domain/Shared/UserPermissions';
import SetMainPictureUserRequest from '../Requests/SetMainPictureUserRequest';

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/users'
};

const UserHandler: Router = new Router(routerOpts);
const responder: Responder = new Responder();
const controller = new UserController();

UserHandler.post('/', AuthorizeMiddleware('some', UserPermissions.I.SAVE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new UserSaveRequest(ctx.request.body);

    const user: IUserDomain = await controller.save(_request, AuthUser(ctx));
    const responseData = new DataResponseMessage(user.getId(), ResponseMessageEnum.CREATED);
    void await responder.send(responseData, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer());
});

UserHandler.get('/', AuthorizeMiddleware('some', UserPermissions.I.LIST), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new UserRequestCriteria(ctx.request.query, ctx.request.url);

    const paginator: IPaginator = await controller.list(_request);


    await responder.paginate(paginator, ctx, StatusCode.HTTP_OK, new UserTransformer());
});

UserHandler.get('/:id', AuthorizeMiddleware('some', UserPermissions.I.SHOW), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new IdRequest({ id: ctx.params.id });

    const user: IUserDomain = await controller.getOne(_request);

    void await responder.send(user, ctx, StatusCode.HTTP_OK, new UserTransformer());
});

UserHandler.put('/:id', AuthorizeMiddleware('some', UserPermissions.I.UPDATE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new UserUpdateRequest(ctx.request.body, ctx.params.id);

    const user: IUserDomain = await controller.update(_request,  AuthUser(ctx));
    const responseData = new DataResponseMessage(user.getId(), ResponseMessageEnum.UPDATED);
    void await responder.send(responseData, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer());
});

UserHandler.put('/:id/set-main-picture/:mainPictureId', AuthorizeMiddleware('some', UserPermissions.I.UPDATE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new SetMainPictureUserRequest({
        id: ctx.params?.id,
        mainPictureId: ctx.params?.mainPictureId,
        setNull: ctx.request.query?.setNull
    });

    const user: IUserDomain = await controller.setMainPicture(_request,  AuthUser(ctx));
    const responseData = new DataResponseMessage(user.getId(), ResponseMessageEnum.UPDATED);
    void await responder.send(responseData, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer());
});

UserHandler.put('/:id/assign-role', AuthorizeMiddleware('some', UserPermissions.I.ASSIGN_ROLE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new UserAssignRoleRequest(ctx.request.body, ctx.params.id);

    const user: IUserDomain = await controller.assignRole(_request,  AuthUser(ctx));
    const responseData = new DataResponseMessage(user.getId(), ResponseMessageEnum.UPDATED);
    void await responder.send(responseData, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer());
});

UserHandler.delete('/:id', AuthorizeMiddleware('some', UserPermissions.I.DELETE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new IdRequest({ id: ctx.params.id });

    const user: IUserDomain = await controller.remove(_request,  AuthUser(ctx));

    void await responder.send(user, ctx, StatusCode.HTTP_OK, new UserTransformer());
});

UserHandler.put('/:id/change-user-password', AuthorizeMiddleware('some', UserPermissions.I.CHANGE_USER_PASSWORD), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new ChangeUserPasswordRequest(ctx.request.body, ctx.params.id);

    const user: IUserDomain = await controller.changeUserPassword(_request, AuthUser(ctx));
    const responseData = new DataResponseMessage(user.getId(), ResponseMessageEnum.UPDATED);
    void await responder.send(responseData, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer());
});

export default UserHandler;
