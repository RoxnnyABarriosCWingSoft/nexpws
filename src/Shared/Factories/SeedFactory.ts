import Logger from '../Logger/Logger';
import _ from 'lodash';

import seeds from '../../seed';

class SeedFactory
{
    private seeds: Record<string, any> = {
        ...seeds
    };

    public async execute(name: string): Promise<any>
    {
        return !_.isUndefined(name) ? await this.one(name) : await this.all();
    }

    public list(): void
    {
        Logger.info('⬐ Seed List');
        Object.keys(this.seeds).forEach(name =>  Logger.info(`↳ ${name}`));
    }

    public async init(): Promise<void>
    {
        await this.all();
    }

    private async one(name: string): Promise<void>
    {
        this.validateSeedName(name);
        Logger.info(`┌ Running ${name}!`);
        try
        {
            await (new this.seeds[name]()).init();
        }
        catch (e)
        {
            Logger.info(`├ Error ${e}`);
        }
        Logger.info(`└ ${name} has ended!`);
    }

    private async all(): Promise<void>
    {
        Logger.info('⬐\tAll Seed Run');
        for await (const name of Object.keys(this.seeds))
        {
            Logger.info(`┌ Running ${name}!`);
            try
            {
                await (new this.seeds[name]()).init();
            }
            catch (e)
            {
                Logger.info(`├ Error ${e}`);
            }
            Logger.info(`└ ${name} has ended!`);
        }
    }

    private validateSeedName(name: string): void
    {
        if (Object.prototype.hasOwnProperty.call(this.seeds, name))
        {
            return;
        }

        const invalidSeedMessage = (
            text: TemplateStringsArray,
            seed: string
        ) => `The seed '${seed}' is not defined or does not exist.`;

        throw new Error(invalidSeedMessage`${name}`);
    }
}

export default SeedFactory;
