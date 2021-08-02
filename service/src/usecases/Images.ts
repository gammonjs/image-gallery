import internal from 'stream';
import { Service } from 'typedi';
import ContextAdapter from '../adapters/context';
import PostgresClient from '../adapters/postgres';
import MinioClient from '../adapters/minio';
import { Image } from '../entity/Image';
import LoggerAdapter from '../adapters/logger';
import ImageFactory from '../factories/ImageFactory';

@Service()
class ImagesUsecases {
    constructor(
        private readonly _minioClient: MinioClient,
        private readonly _postgresClient: PostgresClient,
        private readonly _logger: LoggerAdapter,
        private readonly _image: ImageFactory
    ) {}

    connect = async (): Promise<boolean> => {
        let success = await this._minioClient.MakeBucket('images', 'us-east-1');
        if (success == false) {
            this._logger.error('could not connect to minio');
            return false;
        }

        success = await this._postgresClient.connect();

        if (success == false) {
            this._logger.error('could not connect to postgres');
            return false;
        }

        this._logger.info('connected to image data stores');
        return true;
    };

    upload = async (context: ContextAdapter<Image>): Promise<Image> => {
        
        const image = this._image.Create(context._req.file.originalname, context._req.file.mimetype)

        await this._minioClient.Upload(
            'images',
            image.generatedId,
            context._req.file.buffer
        );
        
        const repository = this._postgresClient.getRepository(Image);
        const images = repository.create(image);
        return repository.save(images);
    };

    getMany = (
        context: ContextAdapter<Array<Image>>
    ): Promise<Array<Image>> => {
        return this._postgresClient.getRepository(Image).find();
    };

    getOne = async (
        context: ContextAdapter<internal.Readable>
    ): Promise<internal.Readable> => {
        return this._minioClient.Download('images', context._req.params.id);
    };
}

export default ImagesUsecases;
