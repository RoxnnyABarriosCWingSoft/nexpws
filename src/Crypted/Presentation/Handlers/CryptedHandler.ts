import Koa from 'koa';
import Router from 'koa-router';
import { StatusCode } from '@digichanges/shared-experience';
import Responder from '../../../App/Presentation/Shared/Responder';
import CryptedController from '../Controllers/CryptedController';
import CryptedTransformer from '../Transformers/CryptedTransformer';
import CryptedRepRequest from '../Request/CryptedRepRequest';
import ICryptedDomain from '../../Domain/Entities/ICryptedDomain';

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/crypted'
};

const CryptedHandler: Router = new Router(routerOpts);
const responder: Responder = new Responder();
const controller = new CryptedController();

CryptedHandler.post('/symmetric-encrypt', async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new CryptedRepRequest(ctx.request.body);

    const crypted: ICryptedDomain = await controller.encrypt(_request);

    void await responder.send(crypted, ctx, StatusCode.HTTP_OK, new CryptedTransformer());
});

CryptedHandler.post('/symmetric-decrypt', async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new CryptedRepRequest(ctx.request.body);

    const crypted: ICryptedDomain = await controller.decrypt(_request);

    void await responder.send(crypted, ctx, StatusCode.HTTP_OK, new CryptedTransformer());
});

export default CryptedHandler;
