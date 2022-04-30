import Koa from 'koa';
import Router from 'koa-router';
import { IPaginator, StatusCode } from '@digichanges/shared-experience';
import Responder from '../../../App/Presentation/Shared/Responder';
import LogTransformer from '../Transformers/LogTransformer';
import LogRequestCriteria from '../Requests/LogRequestCriteria';
import LogController from '../Controllers/LogController';
import AuthorizeMiddleware from '../../../Auth/Presentation/Middlewares/AuthorizeMiddleware';
import LogPermissions from '../../Domain/Shared/LogPermissions';
import LogDomainsRequestCriteria from '../Requests/LogDomainsRequestCriteria';
import User from '../../../User/Domain/Entities/User';
import Role from '../../../Role/Domain/Entities/Role';

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/logs'
};

const LogHandler: Router = new Router(routerOpts);
const responder: Responder = new Responder();
const controller = new LogController();

LogHandler.get('/', AuthorizeMiddleware('some', LogPermissions.I.LIST), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new LogRequestCriteria(ctx.request.query, ctx.request.url);

    const paginator: IPaginator = await controller.list(_request);

    await responder.paginate(paginator, ctx, StatusCode.HTTP_OK, new LogTransformer());
});

LogHandler.get('/users/:id', AuthorizeMiddleware('some', LogPermissions.I.LIST, LogPermissions.I.LIST_USERS), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new LogDomainsRequestCriteria(ctx.request.query, ctx.request.url, ctx.params.id);

    const paginator: IPaginator = await controller.list(_request, { entity: User.name, entityId: _request.id });

    await responder.paginate(paginator, ctx, StatusCode.HTTP_OK, new LogTransformer());
});

LogHandler.get('/roles/:id', AuthorizeMiddleware('some', LogPermissions.I.LIST, LogPermissions.I.LIST_ROLES), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new LogDomainsRequestCriteria(ctx.request.query, ctx.request.url, ctx.params.id);

    const paginator: IPaginator = await controller.list(_request, { entity: Role.name, entityId: _request.id });

    await responder.paginate(paginator, ctx, StatusCode.HTTP_OK, new LogTransformer());
});

export default LogHandler;
