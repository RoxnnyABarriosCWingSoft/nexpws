import ContainerFactory from '../../../Shared/Factories/ContainerFactory';
import IBaseRepository from '../../InterfaceAdapters/IBaseRepository';
import IUniqueConfig, { IUniqueEmbedConfig } from '../../InterfaceAdapters/IUniqueConfig';
import UniqueAttributeException from '../Exceptions/UniqueAttributeException';

class UniqueService
{
    static async validate<T = any>(config: IUniqueConfig<T>): Promise<void>
    {
        const { repository, validate, refValue } = config;

        const _repository = ContainerFactory.create<IBaseRepository<any>>(repository);

        const attrs = Object.keys(validate);

        for await (const attr of attrs)
        {
            if (validate[<keyof T> attr])
            {
                const exist = await _repository.exist({ [attr]: validate[<keyof T> attr] }, ['_id'], false);

                if (refValue && exist && exist._id !== refValue)
                {
                    throw new UniqueAttributeException(attr);
                }
                else if (!refValue && exist)
                {
                    throw new UniqueAttributeException(attr);
                }
            }
        }
    }

    static async validateMulti<T = any>(config: IUniqueConfig<T>): Promise<void>
    {
        const { repository, validate, refValue } = config;

        const _repository = ContainerFactory.create<IBaseRepository<any>>(repository);

        const attrs = Object.keys(validate);

        const validateObj = {};
        const props = [];

        for await (const attr of attrs)
        {
            if (validate[<keyof T> attr])
            {
                props.push(attr);
                Object.assign(validateObj, { [attr]: validate[<keyof T> attr] });
            }
        }

        const exist = await _repository.exist(validateObj, ['_id'], false);

        if (refValue && exist && exist._id !== refValue)
        {
            throw new UniqueAttributeException(props.join(), true);
        }
        else if (!refValue && exist)
        {
            throw new UniqueAttributeException(props.join(), true);
        }
    }

    static async validateEmbed<T = any>(config: IUniqueEmbedConfig<T>): Promise<void>
    {
        const { embededs, validate, refValue } = config;

        const attrs = Object.keys(validate);

        for await (const attr of attrs)
        {
            if (validate[<keyof T> attr])
            {
                const exist = <any> embededs.find(embed => embed[<keyof T> attr] === validate[<keyof T> attr]);

                if (refValue && exist && exist._id !== refValue)
                {
                    throw new UniqueAttributeException(attr);
                }
                else if (!refValue && exist)
                {
                    throw new UniqueAttributeException(attr);
                }
            }
        }
    }
}


export default UniqueService;
