import { Transformer } from '@digichanges/shared-experience';

import IToken from '../../Domain/Models/IToken';
import AuthUserTransformer from './AuthUserTransformer';

class AuthTransformer extends Transformer
{
    private authUserTransformer: AuthUserTransformer;

    constructor()
    {
        super();
        this.authUserTransformer = new AuthUserTransformer();
    }

    public async transform(token: IToken)
    {
        return {
            user: await this.authUserTransformer.handle(token.getUser()),
            expires: token.getExpires(),
            token: token.getHash()
        };
    }
}

export default AuthTransformer;
