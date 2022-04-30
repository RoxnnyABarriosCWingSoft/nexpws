import { REPOSITORIES } from '../../Config/Injects/repositories';

interface IUniqueConfig<T = any>
{
    repository: REPOSITORIES;
    validate: { [P in keyof T]?: T[P] }
    refValue?: string;
}

export interface IUniqueEmbedConfig<T = any>
{
    embededs: T[]
    validate: { [P in keyof T]?: T[P] }
    refValue?: string;
}

export default IUniqueConfig;
