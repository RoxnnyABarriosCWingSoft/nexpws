import { Document, FilterQuery, Model, PopulateOptions, UpdateQuery } from 'mongoose';
import { injectable, unmanaged } from 'inversify';
import { connection } from '../../../Shared/Database/MongooseCreateConnection';
import NotFoundException from '../../../Shared/Exceptions/NotFoundException';
import IByOptions from '../../InterfaceAdapters/IByOptions';
import IBaseRepository from '../../InterfaceAdapters/IBaseRepository';
import IBaseDomain from '../../InterfaceAdapters/IBaseDomain';

export declare type IPopulate = string | PopulateOptions | (PopulateOptions | string)[];

interface IPopulateOptions
{
    populate?: IPopulate;
    getOne?: IPopulate;
    update?: IPopulate;
    delete?: IPopulate;
}

@injectable()
abstract class BaseMongoRepository<T extends IBaseDomain, D extends Document & T> implements IBaseRepository<T>
{
    protected readonly entityName: string;
    protected repository: Model<D>;
    protected populate: IPopulate;
    protected getOnePopulate: IPopulate;
    protected updatePopulate: IPopulate;
    protected deletePopulate: IPopulate;

    constructor(@unmanaged() entityName: string, @unmanaged() populateOptions: IPopulateOptions = { populate: [] })
    {
        this.entityName = entityName;
        this.repository = connection.model<D>(entityName);
        this.populate = populateOptions?.populate ?? null;
        this.getOnePopulate = populateOptions?.getOne ?? this.populate;
        this.updatePopulate = populateOptions?.update ?? this.populate;
        this.deletePopulate = populateOptions?.delete ?? this.populate;
    }

    async save(entity: T): Promise<T>
    {
        return await this.repository.create(entity);
    }

    async getOne(id: string): Promise<T>
    {
        const entity = await this.repository.findOne({ _id: id } as FilterQuery<T>).populate(<any> this.getOnePopulate ?? this.populate);

        if (!entity)
        {
            throw new NotFoundException(this.entityName);
        }

        return entity as any;
    }

    async update(entity: T): Promise<T>
    {
        return this.repository
            .findOneAndUpdate({ _id: entity.getId() } as FilterQuery<T>, { $set: entity } as UpdateQuery<T>, { new: true })
            .populate(<any> this.updatePopulate ?? this.populate) as any;
    }

    async delete(id: string): Promise<T>
    {
        const entity = await this.repository.findByIdAndDelete({ _id: id } as any).populate(<any> this.deletePopulate ?? this.populate);

        if (!entity)
        {
            throw new NotFoundException(this.entityName);
        }

        return entity as any;
    }

    async getOneBy(condition: Record<string, any>, options: IByOptions = {}): Promise<T>
    {
        const { initThrow = true, populate = this.populate } = options;

        const entity = await this.repository.findOne(condition as FilterQuery<T>).populate(populate as string | string[]).exec();

        if (initThrow && !entity)
        {
            throw new NotFoundException(this.entityName);
        }

        return entity as any;
    }

    async getBy(condition: Record<string, any>, options: IByOptions = { initThrow: false, populate: null }): Promise<T[]>
    {
        const { initThrow = false, populate = this.populate } = options;

        const entities = await this.repository.find(condition as FilterQuery<T>).populate(populate as string | string[]).exec();

        if (initThrow && entities.length === 0)
        {
            throw new NotFoundException(this.entityName);
        }

        return entities;
    }

    async getInBy(condition: Record<string, string[]>): Promise<T[]>
    {
        const [key] = Object.keys(condition);

        return await this.getBy({ [key]: { $in: condition[key] } });
    }

    async exist(condition: Record<string, any>, select: string[], initThrow = false): Promise<any>
    {
        const exist = await this.repository.findOne(condition as FilterQuery<T>, select.join(' '));

        if (initThrow && !exist)
        {
            throw new NotFoundException(this.entityName);
        }

        return exist;
    }
}

export default BaseMongoRepository;
