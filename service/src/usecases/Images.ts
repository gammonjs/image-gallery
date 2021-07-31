import internal from 'stream';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { ContextAdapter } from '../adapters/context';
import PostgresClient from '../adapters/postgres';
import MinioClient from '../adapters/minio';
import { Image } from '../entity/Image';
import { v4 as uuidv4 } from 'uuid';

@Service()
export class ImagesUsecases {
    private _repository: Repository<Image>;
    constructor(
        private _minioClient: MinioClient,
        private _postgresClient: PostgresClient
    ) {}

    connect = async (): Promise<void> => {
        let success = await this._minioClient.MakeBucket('images', 'us-east-1');
        if (success == false) {
            console.log('could not connect to minio');
            return;
        }

        success = await this._postgresClient.connect();

        if (success == false) {
            console.log('could not connect to postgres');
            return;
        }

        this._repository = this._postgresClient
            .connection()
            .getRepository(Image);
    };

    upload = async (context: ContextAdapter<Image>): Promise<Image> => {
        const generatedId = uuidv4();

        await this._minioClient.Upload(
            'images',
            generatedId,
            context._req.file.buffer
        );
        const image = new Image();
        image.name = context._req.file.originalname;
        image.generatedId = generatedId;
        image.mimeType = context._req.file.mimetype;

        const images = this._repository.create(image);
        return this._repository.save(images);
    };

    getMany = (
        context: ContextAdapter<Array<Image>>
    ): Promise<Array<Image>> => {
        return this._repository.find();
    };

    getOne = async (
        context: ContextAdapter<internal.Readable>
    ): Promise<internal.Readable> => {
        return this._minioClient.Download('images', context._req.params.id);
    };
}
