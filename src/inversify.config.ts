import { Container } from 'inversify';

import FormatResponder from './App/Presentation/Shared/FormatResponder';
import IFormatResponder from './Shared/InterfaceAdapters/IFormatResponder';
import Responder from './App/Presentation/Shared/Responder';

import IUserRepository from './User/Infrastructure/Repositories/IUserRepository';
import IRoleRepository from './Role/Infrastructure/Repositories/IRoleRepository';
import IFileRepository from './File/Infrastructure/Repositories/IFileRepository';

import { REPOSITORIES } from './Config/Injects/repositories';
import { TYPES } from './Config/Injects/types';

import UserRepository from './User/Infrastructure/Repositories/UserRepository';
import RoleRepository from './Role/Infrastructure/Repositories/RoleRepository';
import FileRepository from './File/Infrastructure/Repositories/FileRepository';

import TokenRedisRepository from './Auth/Infrastructure/Repositories/TokenRedisRepository';
import { ITokenRepository } from '@digichanges/shared-experience';
import ITokenDomain from './Auth/Domain/Entities/ITokenDomain';
import INotificationFactory from './Notification/Shared/INotificationFactory';
import { FACTORIES } from './Config/Injects/factories';
import NotificationFactory from './Notification/Shared/NotificationFactory';
import INotificationRepository from './Notification/InterfaceAdapters/INotificationRepository';
import INotificationDomain from './Notification/InterfaceAdapters/INotificationDomain';
import NotificationRepository from './Notification/Infrastructure/Repositories/NotificationRepository';
import ILogRepository from 'Log/Infrastructure/Repositories/ILogRepository';
import LogRepository from './Log/Infrastructure/Repositories/LogRepository';


const container = new Container();

/* Libs */
container.bind<Responder>(TYPES.Responder).to(Responder);
container.bind<IFormatResponder>(TYPES.IFormatResponder).to(FormatResponder);


container.bind<IUserRepository>(REPOSITORIES.IUserRepository).to(UserRepository).inSingletonScope();
container.bind<IRoleRepository>(REPOSITORIES.IRoleRepository).to(RoleRepository).inSingletonScope();
container.bind<IFileRepository>(REPOSITORIES.IFileRepository).to(FileRepository).inSingletonScope();
container.bind<INotificationRepository<INotificationDomain>>(REPOSITORIES.INotificationRepository).to(NotificationRepository).inSingletonScope();
container.bind<ILogRepository>(REPOSITORIES.ILogRepository).to(LogRepository).inSingletonScope();

container.bind<ITokenRepository<ITokenDomain>>(REPOSITORIES.ITokenRepository).to(TokenRedisRepository);

/* Factories */
container.bind<INotificationFactory>(FACTORIES.INotificationFactory).to(NotificationFactory);

export default container;
