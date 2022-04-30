import IUrlFile from '../../../File/Domain/Services/IUrlFile';

interface IUserMinimalDataTransformer
{
    id: string;
    firstName: string;
    lastName: string;
    rut: string;
    email: string;
    phoneNumber: string;
    localPhoneNumber: string;
    age: number;
    mainPicture: IUrlFile;
}

export default IUserMinimalDataTransformer;
