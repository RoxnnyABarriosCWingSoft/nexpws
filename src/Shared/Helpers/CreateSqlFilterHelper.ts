import { IFilter } from '@digichanges/shared-experience/src/InterfacesAdapters/Criteria';
import { SelectQueryBuilder, Brackets } from 'typeorm';
import _ from 'lodash';
import Parse from './ParseHelper';

export declare type AttributeConfig<E = any> = {
    attribute: string;
    dbAttribute?: KeyAttribute<E>;
    isBoolean?: boolean;
    toLower?: boolean;
} | string;

export declare type KeyAttribute<F = any> = (keyof F);

export declare type SearchConfig<E = any> = {
    attributesDB: string | string[] | KeyAttribute<E> | KeyAttribute<E>[] | AttributeDBConfig<E>[];
    partialMatch?: boolean;
}

export declare type AttributeDBConfig<E = any> = {
    name: string |  KeyAttribute<E>;
    coalesce?: boolean;
    tableAlias?: string;
    setWeight?: SetWeightRelevance;
}

export declare type SetWeightRelevance = 'A' |  'B' |'C' |'D';

export declare type FilterCondition = 'andWhere' | 'orWhere' | 'where';

export declare type FilterOperator = '=' | 'ilike' | '>' | '>=' | '<=' | 'in';

export declare type MultiFilterOperator = '=' | 'ilike';

class CreateFilterHelper<T = any>
{
    private readonly _filter: IFilter;
    private readonly queryBuilder: SelectQueryBuilder<T>;

    constructor(filter: IFilter, queryBuilder: SelectQueryBuilder<T>)
    {
        this._filter = filter;
        this.queryBuilder = queryBuilder;
    }

    filter(attr: AttributeConfig<T> | string, condition: FilterCondition, operator: FilterOperator, alias = 'i'): void
    {
        let attribute: string = attr as string;
        let dbAttribute: string = attr as string;
        let booleanAttribute = false;
        let toLower = false;

        if (_.isObject(attr))
        {
            attribute = attr.attribute;
            dbAttribute = <string> attr?.dbAttribute ?? attribute;
            booleanAttribute = attr?.isBoolean ?? booleanAttribute;
            toLower = attr?.toLower ?? toLower;
        }

        if (this._filter.has(attribute))
        {
            let valueAttr: string | string[] | boolean = this._filter.get(attribute);
            let aliasAttr = `:${attribute}`;

            if (booleanAttribute)
            {
                valueAttr = Parse((<string> valueAttr));
            }

            if (operator === 'in')
            {
                aliasAttr = `(:...${attribute})`;
                valueAttr = this.getMultiFilter(attribute);
            }

            if (operator === 'ilike')
            {
                aliasAttr = `:${attr}`;
                valueAttr = `%${valueAttr}%`;
            }

            if (toLower)
            {
                this.queryBuilder[condition](`LOWER(${alias}.${dbAttribute}) ${operator} LOWER(${aliasAttr})`);
            }

            else
            {
                this.queryBuilder[condition](`${alias}.${dbAttribute} ${operator} ${aliasAttr}`);
            }

            void this.queryBuilder.setParameter(attribute, valueAttr);
        }
    }

    getMultiFilter(attr: string): string[]
    {
        const filters: string[] = [];

        if (this._filter.has(attr))
        {
            this._filter.get(attr)?.trim().split(',').map((_attr: string) =>
            {
                if (_attr?.trim().length > 0)
                {
                    filters.push(_attr.trim());
                }
            });
        }

        return filters;
    }

    booleanMultiFilter(attr: string, value = true, condition: FilterCondition = 'andWhere', alias = 'i'): void
    {
        if (this._filter.has(attr))
        {
            this.queryBuilder[condition](new Brackets(qb =>
            {
                const values: string[] = this.getMultiFilter(attr);

                values.forEach((_attr: string, index: number) =>
                {
                    const where: 'where' |  'orWhere' = index === 0 ? 'where' : 'orWhere';

                    const aliasAttr = `${attr}_${index}`;

                    qb[where](`${alias}.${_attr?.trim()} = :${aliasAttr} `, { [aliasAttr]: value });
                });
            }));
        }
    }

    multiFilter(attr: string | AttributeConfig, condition: FilterCondition, operator: MultiFilterOperator, alias = 'i'): void
    {
        let attribute: string = attr as string;
        let dbAttribute: string = attr as string;
        let toLower = false;

        if (_.isObject(attr))
        {
            attribute = attr.attribute;

            if (attr?.dbAttribute)
            {
                dbAttribute = <string> attr.dbAttribute;
            }
            else
            {
                dbAttribute = attribute;
            }

            if (attr?.toLower)
            {
                toLower = attr.toLower;
            }
        }

        if (this._filter.has(attribute))
        {
            this.queryBuilder[condition](new Brackets(qb =>
            {
                const values: string[] = this.getMultiFilter(attribute);

                values.map((_attr: string, index: number) =>
                {
                    const where: 'where' | 'orWhere' = index === 0 ? 'where' : 'orWhere';

                    const aliasAttr = `${attribute}_${index}`;
                    let valueAttr: string = _attr?.trim();

                    if (operator === 'ilike')
                    {
                        valueAttr = `%${valueAttr}%`;
                    }

                    if (valueAttr.length > 0)
                    {
                        if (toLower)
                        {
                            qb[where](`LOWER(${alias}.${dbAttribute}) ${operator} LOWER(:${aliasAttr})`, { [aliasAttr]: valueAttr });
                        }

                        else
                        {
                            qb[where](`${alias}.${dbAttribute} ${operator} :${aliasAttr}`, { [aliasAttr]: valueAttr });
                        }
                    }
                });
            }));
        }
    }

    async search(attr: string, searchConfig: SearchConfig<T>, condition: FilterCondition, alias = 'i'): Promise<void>
    {
        if (this._filter.has(attr))
        {
            const cloneQuery = this.queryBuilder.clone();

            const countSearch = async(): Promise<number> =>
            {
                this.vectorSearch(cloneQuery, attr, searchConfig, condition, alias);
                return await cloneQuery.getCount();
            };

            const count = await countSearch();

            if (count !== 0)
            {
                void this.vectorSearch(this.queryBuilder, attr, searchConfig, condition, alias);
            }
            else
            {
                void this.iLikeSearch(this.queryBuilder, attr, searchConfig, condition, alias);
            }
        }
    }

    private vectorSearch(queryBuilder: SelectQueryBuilder<T>, attr: string, searchConfig: SearchConfig<T>, condition: FilterCondition, alias = 'i'): void
    {
        const aliasAttr = `:${attr}`;

        const partialMatch: boolean =  _.isUndefined(searchConfig?.partialMatch) ? true : searchConfig.partialMatch;

        const attrsDB = searchConfig.attributesDB;

        let searchAtt: string | string[];

        if (_.isString(attrsDB))
        {
            searchAtt = `to_tsvector(${alias}.${attrsDB})`;
        }

        if (_.isObject(attrsDB))
        {
            if (_.isString(attrsDB[0]))
            {
                searchAtt = (<string[]>attrsDB).map((attrDB: string) => `to_tsvector(${alias}.${attrDB})`).join(' || ');
            }

            if (_.isObject(attrsDB[0]))
            {
                searchAtt = (<AttributeDBConfig[]>attrsDB).map((attrDB: AttributeDBConfig) =>
                {
                    const coalesce: boolean = _.isUndefined(attrDB?.coalesce) ? false : attrDB.coalesce;
                    const setWeight: boolean | SetWeightRelevance = _.isUndefined(attrDB?.setWeight) ? false : attrDB.setWeight;
                    const tableAlias: string = _.isUndefined(attrDB?.tableAlias) ? alias : attrDB.tableAlias;

                    const _attr = `${tableAlias}.${(<string>attrDB.name)}`;

                    let attrDBSearch = `to_tsvector(${_attr})`;

                    if (coalesce)
                    {
                        attrDBSearch = attrDBSearch.replace(_attr, `coalesce(${_attr},'')`);
                    }

                    if (setWeight)
                    {
                        attrDBSearch = `setweight(${attrDBSearch}, '${setWeight}')`;
                    }

                    return attrDBSearch;
                }).join(' || ');
            }
        }

        if (this._filter.has(attr))
        {
            let valueAttr: string | string[] = (<string> this._filter.get(attr))?.trim();

            if (valueAttr.length > 0)
            {
                if (partialMatch)
                {
                    valueAttr = valueAttr.split(' ').map((value) => `${value}:*`).join(' | ');
                }

                queryBuilder.addSelect(`ts_rank_cd( (${searchAtt}) , to_tsquery(${aliasAttr}))`, 'rank');
                queryBuilder[condition](`to_tsquery(${aliasAttr}) @@ (${searchAtt})`);
                queryBuilder.setParameter(attr, valueAttr);
                queryBuilder.orderBy('rank', 'DESC');
            }
        }
    }

    private iLikeSearch(queryBuilder: SelectQueryBuilder<T>, attr: string, searchConfig: SearchConfig, condition: FilterCondition, alias = 'i'): void
    {
        const aliasAttr = `:${attr}`;

        const attrsDB = searchConfig.attributesDB;

        let searchAtt: string | string[];

        if (_.isString(attrsDB))
        {
            searchAtt = `${alias}.${attrsDB}`;
        }

        if (_.isObject(attrsDB))
        {
            if (_.isString(attrsDB[0]))
            {
                searchAtt = (<string[]>attrsDB).map((attrDB: string) => `${alias}.${attrDB}`).join(' || ');
            }

            if (_.isObject(attrsDB[0]))
            {
                searchAtt = (<AttributeDBConfig[]>attrsDB).map((attrDB: AttributeDBConfig) =>
                {
                    const coalesce: boolean = attrDB?.coalesce ?? false;
                    const tableAlias: string = attrDB?.tableAlias ?? alias;

                    const _attr = `${tableAlias}.${<string>attrDB.name}`;

                    let attrDBSearch = `${_attr}`;

                    if (coalesce)
                    {
                        attrDBSearch = attrDBSearch.replace(_attr, `coalesce(${_attr},'')`);
                    }

                    return attrDBSearch;
                }).join(' || ');
            }
        }

        if (this._filter.has(attr))
        {
            const valueAttr: string | string[] = this._filter.get(attr)?.trim().split(' ').map((_attr: string) => `%${_attr}%`).join(' ');

            if (valueAttr.length > 0)
            {
                queryBuilder[condition](`${searchAtt} ILIKE ${aliasAttr}`);
                queryBuilder.setParameter(attr, valueAttr);
            }
        }
    }

    async filterCustom(fn: (filter: IFilter, queryBuilder: SelectQueryBuilder<T>) => Promise<void>): Promise<void>
    {
        void await fn(this._filter, this.queryBuilder);
    }
}

export default CreateFilterHelper;
