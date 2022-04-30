import Koa from 'koa';
import Router from 'koa-router';
import { IPaginator, StatusCode } from '@digichanges/shared-experience';
import Responder from '../../../App/Presentation/Shared/Responder';
import IdRequest from '../../../App/Presentation/Requests/IdRequest';
import RoleRepRequest from '../Requests/RoleRepRequest';
import IRoleDomain from '../../Domain/Entities/IRoleDomain';
import RoleTransformer from '../Transformers/RoleTransformer';
import RoleRequestCriteria from '../Requests/RoleRequestCriteria';
import RoleUpdateRequest from '../Requests/RoleUpdateRequest';
import RoleController from '../Controllers/RoleController';
import AuthorizeMiddleware from '../../../Auth/Presentation/Middlewares/AuthorizeMiddleware';
import Permissions from '../../../Config/Permissions';
import ResponseMessageEnum from '../../../App/Domain/Enum/ResponseMessageEnum';
import DefaultMessageTransformer from '../../../App/Presentation/Transformers/DefaultMessageTransformer';
import DataResponseMessage from '../../../App/Presentation/Transformers/Response/DataResponseMessage';
import { AuthUser } from '../../../Auth/Presentation/Helpers/AuthUser';
import RolePermissions from '../../Domain/Shared/RolePermissions';

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/roles'
};

const RoleHandler: Router = new Router(routerOpts);
const responder: Responder = new Responder();
const controller = new RoleController();

RoleHandler.post('/', AuthorizeMiddleware('some', RolePermissions.I.SAVE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new RoleRepRequest(ctx.request.body);

    const role: IRoleDomain = await controller.save(_request, AuthUser(ctx));
    const responseData = new DataResponseMessage(role.getId(), ResponseMessageEnum.CREATED);
    void await responder.send(responseData, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer());
});

RoleHandler.get('/', AuthorizeMiddleware('some', RolePermissions.I.LIST), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new RoleRequestCriteria(ctx.request.query, ctx.request.url);

    const paginator: IPaginator = await controller.list(_request);

    await responder.paginate(paginator, ctx, StatusCode.HTTP_OK, new RoleTransformer());
});

RoleHandler.get('/:id', AuthorizeMiddleware('some', RolePermissions.I.SHOW), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new IdRequest({ id: ctx.params.id });

    const role: IRoleDomain = await controller.getOne(_request);

    void await responder.send(role, ctx, StatusCode.HTTP_OK, new RoleTransformer());
});

RoleHandler.put('/:id', AuthorizeMiddleware('some', RolePermissions.I.UPDATE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new RoleUpdateRequest(ctx.request.body, ctx.params.id);

    const role: IRoleDomain = await controller.update(_request, AuthUser(ctx));
    const responseData = new DataResponseMessage(role.getId(), ResponseMessageEnum.UPDATED);
    void await responder.send(responseData, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer());
});

RoleHandler.delete('/:id', AuthorizeMiddleware('some', RolePermissions.I.DELETE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new IdRequest({ id: ctx.params.id });

    const role: IRoleDomain = await controller.remove(_request, AuthUser(ctx));

    void await responder.send(role, ctx, StatusCode.HTTP_CREATED, new RoleTransformer());
});

export default RoleHandler;
