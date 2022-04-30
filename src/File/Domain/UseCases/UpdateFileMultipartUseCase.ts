import FileUpdateMultipartPayload from '../Payloads/FileUpdateMultipartPayload';
import IFileDomain from '../Entities/IFileDomain';
import FileService from '../Services/FileService';

class UpdateFileMultipartUseCase
{
    private readonly fileService = new FileService();

    async handle(payload: FileUpdateMultipartPayload): Promise<any>
    {
        const { id } = payload;
        let file: IFileDomain = await this.fileService.repository.getOne(id);
        file = await this.fileService.persist(file, payload);
        return await this.fileService.uploadFileMultipart(file, payload);
    }
}

export default UpdateFileMultipartUseCase;
