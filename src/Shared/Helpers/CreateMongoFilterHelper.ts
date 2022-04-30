import { IFilter } from '@digichanges/shared-experience/src/InterfacesAdapters/Criteria';
import { Query } from 'mongoose';

interface ISearchConfig
{
    $caseSensitive?: boolean,
    $diacriticSensitive?: boolean,
    $language?: string
}


class CreateMongoFilterHelper<T = any>
{
    private readonly _filter: IFilter;
    private readonly documentQuery: Query<T[], T>;

    constructor(filter: IFilter, queryBuilder: Query<T[], T>)
    {
        this._filter = filter;
        this.documentQuery = queryBuilder;
    }

    filter(attr: string, method: 'equals' | 'regex', fn: (value: any) => any): void
    {
        if (this._filter.has(attr))
        {
            const _value = this._filter.get(attr);
            const value: any = fn(_value);

            void this.documentQuery.where(attr)[method](value);
        }
    }

    filterDate(attr: string, method: '$gte' | '$lte'): void
    {
        if (this._filter.has(attr))
        {
            const _value = this._filter.get(attr);

            void this.documentQuery.where({ createdAt: { [method]: new Date(_value).toISOString() } });
        }
    }

    async filterCustom(fn: (filter: IFilter, documentQuery: Query<T[], T>) => Promise<void>): Promise<void>
    {
        void await fn(this._filter, this.documentQuery);
    }

    async search(attr: string, path: (keyof T | string)[], searchConfig: ISearchConfig = {}): Promise<void>
    {
        if (this._filter.has(attr))
        {
            const query = this._filter.get(attr);
            const cloneQuery = this.documentQuery.clone();

            const countSearch = async(): Promise<number> =>
            {
                this.scoreSearch(cloneQuery, query);
                return await cloneQuery.count();
            };

            const count  = await countSearch();

            if (count !== 0)
            {
                void this.scoreSearch(this.documentQuery, query, searchConfig);
            }
            else
            {
                void this.regexSearch(this.documentQuery, query, path);
            }
        }
    }

    private scoreSearch(documentQuery: Query<T[], T>, query: string, searchConfig: ISearchConfig = {}): void
    {
        void documentQuery.where({ $text: { $search: query, ...searchConfig } }).projection({ score: { $meta: 'textScore' } });
        void documentQuery.sort({ score: { $meta: 'textScore' } });
    }

    private regexSearch(documentQuery: Query<T[], T>, query: string, path: (keyof T | string)[]): void
    {
        const orQuery: any[] = path.map((_path) =>
        {
            const rsearch = new RegExp(query, 'gi');
            return { [_path]: rsearch };
        });
        void documentQuery.where({
            $or: orQuery
        });
    }
}

export default CreateMongoFilterHelper;
