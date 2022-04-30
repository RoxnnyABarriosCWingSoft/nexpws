import IFileDomain from '../Entities/IFileDomain';
import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import FileService from '../Services/FileService';

class RemoveFileUseCase
{
    private readonly fileService = new FileService();

    async handle({ id }: IdPayload): Promise<IFileDomain>
    {
        return await this.fileService.removeFile(id);
    }
}

export default RemoveFileUseCase;
