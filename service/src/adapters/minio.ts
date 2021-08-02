import { Client, ItemBucketMetadata, Region } from 'minio';
import { Readable as ReadableStream } from 'stream';
import { Service } from 'typedi';

@Service()
export class MinoClient {
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

    Download = async (
        bucketName: string,
        objectName: string
    ): Promise<ReadableStream> => {
        try {
            return await this.client.getObject(bucketName, objectName);
        } catch(e) {
            return null
        }
    }
}

export default MinoClient;
