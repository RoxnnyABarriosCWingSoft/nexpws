import ListObjectsPayload from '../Payloads/ListObjectsPayload';
import FilesystemFactory from '../../../Shared/Factories/FilesystemFactory';

class ListObjectsUseCase
{
    private readonly fileSystem = FilesystemFactory.create();

    async handle(payload: ListObjectsPayload): Promise<any>
    {
        return await this.fileSystem.listObjects(payload);
    }
}

export default ListObjectsUseCase;
