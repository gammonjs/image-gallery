import internal from 'stream';
import { Inject, Service } from 'typedi';
import { ContextAdapter, PostgresClient, MinioClient } from '../adapters';
import { Image } from '../entity/Image';
import ConsoleLoggerAdapter from '../adapters/logger';
import ImageFactory from '../factories/ImageFactory';
import { IImagesUsecase, IMinioClient } from '../contracts';

@Service()
class ImagesUsecases implements IImagesUsecase {
    constructor(
        @Inject(/* istanbul ignore next */ () => MinioClient)
        private readonly _minioClient: IMinioClient,

        @Inject(/* istanbul ignore next */ () => PostgresClient)
        private readonly _postgresClient: PostgresClient,

        @Inject(/* istanbul ignore next */ () => ConsoleLoggerAdapter)
        private readonly _logger: ConsoleLoggerAdapter,

        @Inject(/* istanbul ignore next */ () => ImageFactory)
        private readonly _imageFactory: ImageFactory
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
        const image = this._imageFactory.Create(
            context._req.file.originalname,
            context._req.file.mimetype
        );

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
