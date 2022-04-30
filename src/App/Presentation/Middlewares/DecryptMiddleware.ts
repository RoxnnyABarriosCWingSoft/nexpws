import Koa from 'koa';
import symmetricEncryptOrDecryptEachNestedField from '../../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';
import Parse from '../../../Shared/Helpers/ParseHelper';

const DecryptMiddleware = async(ctx: Koa.ParameterizedContext, next: Koa.Next) =>
{
    const symmetricEncrypt = Parse(ctx.get('symmetric-encrypt'));

    if (symmetricEncrypt && Object.keys(ctx.request.body).length > 0)
    {
        ctx.request.body = symmetricEncryptOrDecryptEachNestedField(ctx.request.body, 'decrypt', true);
    }

    await next();
};

export default DecryptMiddleware;
