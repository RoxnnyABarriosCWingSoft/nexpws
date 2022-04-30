import Koa from 'koa';
import ITokenDecode from 'Shared/InterfaceAdapters/ITokenDecode';
import AuthService from '../../Domain/Services/AuthService';

const AuthenticationMiddleware = async(ctx: Koa.ParameterizedContext, next: Koa.Next) =>
{
    const authService =  new AuthService();

    const existMethodAndUrl = authService.checkWhitelist(ctx.method, ctx.path);

    if (!existMethodAndUrl)
    {
        const token = ctx.get('Authorization');

        ctx.tokenDecode = authService.validateToken(token);

        ctx.authUser = await authService.getByRut((<ITokenDecode>ctx.tokenDecode).rut);
    }

    await next();
};

export default AuthenticationMiddleware;
