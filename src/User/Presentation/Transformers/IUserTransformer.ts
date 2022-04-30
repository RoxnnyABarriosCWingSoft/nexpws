import IRoleTransformer from '../../../Role/Presentation/Transformers/IRoleTransformer';
import BaseTransformer, { BasePropertiesTransformer } from '../../../App/Presentation/Transformers/BaseTransformer';
import IUserDomain from '../../Domain/Entities/IUserDomain';
import IUrlFile from '../../../File/Domain/Services/IUrlFile';

type IUserTransformer = BaseTransformer<IUserDomain> & BasePropertiesTransformer &
{
    mainPicture: IUrlFile;
    age: number;
    roles: IRoleTransformer[];
}

export default IUserTransformer;
