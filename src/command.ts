import 'reflect-metadata';
import { exit } from 'shelljs';
import commander from 'commander';
import dotenv from 'dotenv';
dotenv.config(); // Need before get config

process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';


import CreateVapID from './File/Presentation/Commands/CreateVapID';

import SyncRolesPermissionCommand from './Auth/Presentation/Commands/SyncRolesPermissionCommand';
import CreateBucketCommand from './File/Presentation/Commands/CreateBucketCommand';
import Seed from './App/Presentation/Commands/SeedCommand';
import initCommand from './initCommand';
import Logger from './Shared/Logger/Logger';
import CreateFolderLogger from './App/Presentation/Commands/CreateFolderLogger';

void (async() =>
{
    try
    {
        await initCommand();

        const program = commander.program;

        program.addCommand(CreateVapID);
        program.addCommand(SyncRolesPermissionCommand);
        program.addCommand(CreateBucketCommand);
        program.addCommand(Seed);
        program.addCommand(CreateFolderLogger);

        await program.parseAsync(process.argv);
        exit();
    }
    catch (error)
    {
        // TODO: Add exception mapping to handle errors like server express
        Logger.error(error);
        exit();
    }
})();
