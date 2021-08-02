import PostgresClient from '../adapters/postgres';
import MinioClient from '../adapters/minio';
import LoggerAdapter from '../adapters/logger';
import { Region } from 'minio';
import ImagesUsecases from './Images';
import { Image } from '../entity/Image';

describe('ImagesUsecases', () => {

    it('should not connect if the minio client cannot connect', async () => {
        // arrange
        const minioClient = new MockMinioClient(new Promise((resolve, reject) => resolve(false)));
        const logger = new MockLoggerAdapter();
        const imagesUsecases = new ImagesUsecases(minioClient, null, logger, null);

        // act
        const actual = await imagesUsecases.connect();

        // assert
        expect(actual).toEqual(false);
        expect(minioClient.MakeBucket).toHaveBeenCalledTimes(1)
        expect(logger.error.mock.calls).toEqual([
            ['could not connect to minio']
        ])
    });

    it('should not connect if the postgres client cannot connect', async () => {
        // arrange
        const minioClient = new MockMinioClient(new Promise((resolve, reject) => resolve(true)));
        const postgresClient = new MockPostgresClient(new Promise((resolve, reject) => resolve(false)));
        const logger = new MockLoggerAdapter();
        const imagesUsecases = new ImagesUsecases(minioClient, postgresClient, logger, null);

        // act
        const actual = await imagesUsecases.connect();

        // assert
        expect(actual).toEqual(false);
        expect(minioClient.MakeBucket).toHaveBeenCalledTimes(1)
        expect(postgresClient.connect).toHaveBeenCalledTimes(1)
        expect(logger.error.mock.calls).toEqual([
            ['could not connect to postgres']
        ])
    });

    it('should connect if the minio and postgres clients can connect', async () => {
        // arrange
        const minioClient = new MockMinioClient(new Promise((resolve, reject) => resolve(true)));
        const postgresClient = new MockPostgresClient(new Promise((resolve, reject) => resolve(true)));
        const logger = new MockLoggerAdapter();
        const imagesUsecases = new ImagesUsecases(minioClient, postgresClient, logger, null);

        // act
        const actual = await imagesUsecases.connect();

        // assert
        expect(actual).toEqual(true);
        expect(minioClient.MakeBucket).toHaveBeenCalledTimes(1)
        expect(postgresClient.connect).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledTimes(0)
        expect(logger.info.mock.calls).toEqual([
            ['connected to image data stores']
        ])
    });

    it.skip('should upload', async () => {
        // arrange
        // const minioClient = new MockMinioClient(new Promise((resolve, reject) => resolve(true)));
        // const postgresClient = new MockPostgresClient(new Promise((resolve, reject) => resolve(true)));
    
        // const imagesUsecases = new ImagesUsecases(minioClient, postgresClient, null, null);

        // act
        // const actual = await imagesUsecases.upload();

        // assert
        // expect(actual).toEqual(true);
        // expect(minioClient.MakeBucket).toHaveBeenCalledTimes(1)
        // expect(postgresClient.connect).toHaveBeenCalledTimes(1)

    });
    
});

jest.mock('../adapters/postgres')
class MockPostgresClient extends PostgresClient {
    private readonly _handler: Promise<boolean>;
    constructor(handler: Promise<boolean>) {
        super();
        this._handler = handler;
    }
    connect = jest.fn((): Promise<boolean> => this._handler);
}

jest.mock('../adapters/minio')
class MockMinioClient extends MinioClient {
    private readonly _handler: Promise<boolean>;
    constructor(handler: Promise<boolean>) {
        super();
        this._handler = handler;
    }
    MakeBucket = jest.fn((bucketName: string,region: Region): Promise<boolean> => this._handler)
}

jest.mock('../adapters/logger')
class MockLoggerAdapter extends LoggerAdapter {
    error = jest.fn((value: any): void => {})
    info = jest.fn((value: any): void => {})
}
