import CreateBucketPayload from '../Payloads/CreateBucketPayload';
import FilesystemFactory from '../../../Shared/Factories/FilesystemFactory';

class CreateBucketUseCase
{
    private readonly fileSystem = FilesystemFactory.create();

    async handle(payload: CreateBucketPayload): Promise<void>
    {
        const name = payload.name;
        const bucketNamePrivate = `${name}.private`;
        const bucketNamePublic = `${name}.public`;

        const region = payload.region;
        const bucketPrivatePolicy = payload.privateBucketPolicy;
        const bucketPublicPolicy = payload.publicBucketPolicy;

        await this.fileSystem.createBucket(bucketNamePrivate, region);
        await this.fileSystem.setBucketPolicy(bucketPrivatePolicy, bucketNamePrivate);

        await this.fileSystem.createBucket(bucketNamePublic, region);
        await this.fileSystem.setBucketPolicy(bucketPublicPolicy, bucketNamePublic);
    }
}

export default CreateBucketUseCase;
