import { Client, ItemBucketMetadata, Region } from 'minio';
import { Readable as ReadableStream } from 'stream';
import { Service } from 'typedi';

export interface IMinioClient {
    MakeBucket: (bucketName: string, region: Region) => Promise<boolean>;
    Upload: (
        bucketName: string,
        objectName: string,
        stream: ReadableStream | Buffer | string,
        metaData?: ItemBucketMetadata
    ) => Promise<string>;
    Download: (
        bucketName: string,
        objectName: string
    ) => Promise<ReadableStream>;
}

@Service()
class MinoClient implements IMinioClient {
    client: Client;

    constructor() {
        this.client = new Client({
            endPoint: 'localhost',
            port: 9000,
            useSSL: false,
            accessKey: 'test',
            secretKey: 'testtest'
        });
    }

    MakeBucket = async (
        bucketName: string,
        region: Region
    ): Promise<boolean> => {
        try {
            const exists = await this.client.bucketExists(bucketName);

            if (exists == false) {
                this.client.makeBucket(bucketName, region);
                console.log(`bucket made: ${bucketName}`);
                return true;
            }

            console.log(`bucket exists: ${bucketName}`);
            return true;
        } catch (exception) {
            console.log(`bucket error: ${exception}`);
            return false;
        }
    };
    Upload = (
        bucketName: string,
        objectName: string,
        stream: string | ReadableStream | Buffer,
        metaData?: ItemBucketMetadata
    ): Promise<string> =>
        this.client.putObject(bucketName, objectName, stream, metaData);

    Download = (
        bucketName: string,
        objectName: string
    ): Promise<ReadableStream> => this.client.getObject(bucketName, objectName);
}

export default MinoClient;
