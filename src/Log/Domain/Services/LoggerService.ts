import jsonDiff from 'json-diff';
import IBuildLog from '../Entities/IBuildLog';
import { Transformer } from '@digichanges/shared-experience';
import Log from '../Entities/Log';
import ILogDomain from '../Entities/ILogDomain';
import LogActionEnum from '../Enums/LogActionEnum';
import Locales from '../../../App/Presentation/Shared/Locales';
import _ from 'lodash';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import ILogRepository from '../../Infrastructure/Repositories/ILogRepository';

export declare interface ILogSaveProps extends IBuildLog
{
    metadata?: {
        [key: string]: any;
        action?: string;
    };
    description?: string;
}

export declare interface ILogLoginProps extends ILogSaveProps {}
export declare interface ILogLogoutProps extends ILogSaveProps {}

declare interface ILogTransformer {
    transformer: Transformer;
}

export declare interface ILogRemoveProps<T = any> extends ILogSaveProps, ILogTransformer
{
    removeEntity: T;
}

export declare interface ILogUpdateProps<T = any> extends ILogSaveProps, ILogTransformer
{
    oldEntity: T;
    newEntity: T;
    ignore?: (keyof T) [];
}

declare interface IDiff {
    [key: string]: Record<string, any>;
}

export declare interface IDifferences {
    differences: IDiff;
    ignored: any[];
}

class LoggerService
{
    @containerFactory(REPOSITORIES.ILogRepository)
    private static readonly repository: ILogRepository;

    private static readonly locales = Locales.getInstance().getLocales();


    static async login(props: ILogLoginProps): Promise<void>
    {
        let { description } = props;

        const log: ILogDomain = new Log(props);

        log.action = LogActionEnum.LOGIN;
        log.metadata = props?.metadata ?? null;

        if (!description)
        {
            const key = 'log.domain.service.loggerService.login';
            description = this.locales.__(key, { rut: log.createdBy.rut });
        }

        log.description = description;

        await this.repository.save(log);
    }

    static async logout(props: ILogLogoutProps): Promise<void>
    {
        let { description } = props;

        const log: ILogDomain = new Log(props);

        log.action = LogActionEnum.LOGOUT;
        log.metadata = props?.metadata ?? null;

        if (!description)
        {
            const key = 'log.domain.service.loggerService.logout';
            description = this.locales.__(key, { rut: log.createdBy.rut });
        }

        log.description = description;

        await this.repository.save(log);
    }

    static async save(props: ILogSaveProps): Promise<void>
    {
        let { description } = props;

        const log: ILogDomain = new Log(props);

        log.action = LogActionEnum.SAVE;
        log.metadata = props?.metadata ?? null;

        if (!description)
        {
            const key = 'log.domain.service.loggerService.save';
            description = this.locales.__(key, { rut: log.createdBy.rut, entity: log.entity });
        }

        log.description = description;

        await this.repository.save(log);
    }

    static async update<T = any>(props: ILogUpdateProps<T>): Promise<void>
    {
        const { transformer, ignore } = props;
        let { metadata, description, oldEntity, newEntity  } = props;

        if (transformer)
        {
            newEntity = await transformer.handle(newEntity);
            oldEntity = await transformer.handle(oldEntity);
        }

        const diff: IDiff = jsonDiff.diff(oldEntity, newEntity);

        if (diff)
        {
            const differences = this.differences(diff, ignore);

            if (_.isUndefined(metadata) || _.isNull(metadata))
            {
                metadata = differences;
            }
            else
            {
                metadata = _.merge(differences, metadata);
            }

            const log: ILogDomain = new Log(props);

            log.action = LogActionEnum.UPDATE;
            log.metadata = metadata;

            if (!description)
            {
                const key = 'log.domain.service.loggerService.update';
                description = this.locales.__(key, { rut: log.createdBy.rut, entity: log.entity });
            }

            log.description = description;

            await this.repository.save(log);
        }
    }

    static async remove<T = any>(props: ILogRemoveProps<T>): Promise<void>
    {
        const { transformer } = props;
        let { metadata, description, removeEntity } = props;

        if (transformer)
        {
            removeEntity = await transformer.handle(removeEntity);
        }

        const removed = { removed: removeEntity };

        if (_.isUndefined(metadata) || _.isNull(metadata))
        {
            metadata = removed;
        }
        else
        {
            metadata = _.merge(removed, metadata);
        }

        const log: ILogDomain = new Log(props);

        log.action = LogActionEnum.REMOVE;
        log.metadata = metadata;

        if (!description)
        {
            const key = 'log.domain.service.loggerService.remove';
            description = this.locales.__(key, { rut: log.createdBy.rut, entity: log.entity });
        }

        log.description = description;

        await this.repository.save(log);
    }

    private static differences(differ: IDiff, ignore: any[]): IDifferences
    {
        const diffMap = (diff: IDiff) =>
        {
            const keyValues = Object.keys(diff).map(key =>
            {
                let newKey: any;

                if (key === '__old')
                {
                    newKey = 'old';
                }

                else if (key === '__new')
                {
                    newKey = 'new';
                }

                else
                {
                    newKey = key;

                    if (!_.isArray(diff[key]))
                    {
                        diff[key] = diffMap(diff[key]);
                    }
                }

                return { [newKey]: diff[key] };
            });

            return Object.assign({}, ...keyValues);
        };

        const differences =  diffMap(differ);
        const ignored: any[] = [];

        if (!_.isUndefined(ignore))
        {
            ignore = _.uniq(ignore);
            _.map(ignore, _ignore =>
            {
                _.mapKeys(differences, (value, key) =>
                {
                    if (_ignore === key)
                    {
                        ignored.push(key);
                    }
                });
            });
        }

        return { differences, ignored } as IDifferences;
    }
}

export default LoggerService;
