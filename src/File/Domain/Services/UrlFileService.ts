import FileService from './FileService';
import MainConfig from '../../../Config/mainConfig';
import IFileDomain from '../Entities/IFileDomain';
import IUrlFile from './IUrlFile';

class UrlFileService
{
    private static readonly fileService = new FileService();
    private static config = MainConfig.getInstance().getConfig();

    static async handle(data: IFileDomain[] | IFileDomain): Promise<IUrlFile | IUrlFile[]>
    {
        const expiry = this.config.filesystem.expiry;

        const transform = async(file: IFileDomain): Promise<IUrlFile> =>
        {
            if (file)
            {
                const url = await this.fileService.getFileUrl(file, expiry);
                return { id: file.getId(), url };
            }
            else
            {
                return null;
            }
        };

        if (data instanceof Array)
        {
            return await Promise.all(data.map(async(_data) =>
            {
                return await transform(_data);
            }));
        }
        else
        {
            return await transform(data);
        }
    }
}

export default UrlFileService;
