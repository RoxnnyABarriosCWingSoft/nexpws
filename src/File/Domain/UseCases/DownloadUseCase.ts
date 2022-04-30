import IFileDTO from '../Models/IFileDTO';
import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import IFileDomain from '../Entities/IFileDomain';
import FileDTO from '../Models/FileDTO';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IFileRepository from '../../Infrastructure/Repositories/IFileRepository';
import FilesystemFactory from '../../../Shared/Factories/FilesystemFactory';

class DownloadUseCase
{
    @containerFactory(REPOSITORIES.IFileRepository)
    private readonly repository: IFileRepository;

    private readonly fileSystem = FilesystemFactory.create();

    async handle({ id }: IdPayload): Promise<IFileDTO>
    {
        const file: IFileDomain = await this.repository.getOne(id);
        const stream = await this.fileSystem.downloadStreamFile(file);

        return new FileDTO(file, stream);
    }
}

export default DownloadUseCase;
