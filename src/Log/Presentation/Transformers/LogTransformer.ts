import moment from 'moment';
import { Transformer } from '@digichanges/shared-experience';

import ILogDomain from '../../Domain/Entities/ILogDomain';
import ILogTransformer from './ILogTransformer';
import UserMinimalDataTransformer from '../../../User/Presentation/Transformers/UserMinimalDataTransformer';
import _ from 'lodash';
import UrlFileService from '../../../File/Domain/Services/UrlFileService';

class LogTransformer extends Transformer
{
    private readonly userMinimalDataTransformer: UserMinimalDataTransformer;

    constructor()
    {
        super();
        this.userMinimalDataTransformer = new UserMinimalDataTransformer();
    }

    public async transform(log: ILogDomain): Promise<ILogTransformer>
    {
        return {
            id: log.getId(),
            action: log.action,
            entity: log.entity,
            entityId: log.entityId,
            description: log.description,
            metadata: this.omit(log.metadata),
            files: <any> await UrlFileService.handle(log?.files),
            createdBy: await this.validate(log.createdBy, this.userMinimalDataTransformer),
            createdAt: moment(log.createdAt).utc().unix(),
            updatedAt: moment(log.updatedAt).utc().unix()
        };
    }

    private omit(metadata: Record<string, any>): any
    {
        if (metadata?.differences && metadata?.ignored)
        {
            metadata.differences = _.omit(metadata.differences, metadata.ignored);
        }

        return metadata;
    }
}

export default LogTransformer;
