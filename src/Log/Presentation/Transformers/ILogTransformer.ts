import BaseTransformer, { BasePropertiesTransformer } from '../../../App/Presentation/Transformers/BaseTransformer';
import ILogDomain from '../../Domain/Entities/ILogDomain';
import IUserMinimalDataTransformer from '../../../User/Presentation/Transformers/IUserMinimalDataTransformer';
import IUrlFile from '../../../File/Domain/Services/IUrlFile';

type ILogTransformer = BaseTransformer<ILogDomain> & BasePropertiesTransformer & {
    files: IUrlFile[];
    createdBy: IUserMinimalDataTransformer;
};

export default ILogTransformer;
