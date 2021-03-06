import Koa from 'koa';
import MainConfig from '../../../Config/mainConfig';

import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import ForbiddenHttpException from '../Exceptions/ForbiddenHttpException';
import AuthService from '../../Domain/Services/AuthService';

const AuthorizeMiddleware = (method: 'some' | 'every', ...handlerPermissions: string[]) =>
{
    return async(ctx: Koa.ParameterizedContext, next: Koa.Next) =>
    {
        const authService = new AuthService();
        const config = MainConfig.getInstance();

        let isAllowed: boolean = config.getConfig().auth.authorization !== true;
        const authUser = ctx.authUser as IUserDomain;

        const authorize = await authService.authorize(authUser, handlerPermissions, method);

        if (authorize)
        {
            isAllowed = true;
        }

        if (isAllowed)
        {
            await next();
        }
        else
        {
            throw new ForbiddenHttpException();
        }
    };
};

export default AuthorizeMiddleware;
