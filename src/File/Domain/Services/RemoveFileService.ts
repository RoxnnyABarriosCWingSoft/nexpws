import FileService from './FileService';
import IFileDomain from '../Entities/IFileDomain';

class RemoveFileService
{
    private static readonly fileService = new FileService();

    static async update<T = any>(fileId: string, oldFile: IFileDomain): Promise<IFileDomain | null>
    {
        const oldId = oldFile?.getId();

        if (fileId)
        {
            if (fileId === oldId)
            {
                return oldFile;
            }
            else if (fileId !== oldId)
            {
                return await this.fileService.repository.getOne(fileId);
            }
        }
        else
        {
            return null;
        }
    }

    static async remove(newFileId: string, oldFileId: string): Promise<void>
    {
        if (oldFileId && newFileId !== oldFileId)
        {
            await this.fileService.removeFile(oldFileId);
        }
    }
}

export default RemoveFileService;
