import { Request, RequestHandler, Response } from 'express';
import { ItemBucketMetadata, Region } from 'minio';
import { Readable } from 'stream';
import ContextAdapter from './adapters/context';
import { Image } from './entity/Image';
import { Readable as ReadableStream } from 'stream';

export interface IServer {
    connect(): Promise<boolean>;
    route(): void;
    run(): Promise<void>;
}

export interface IFramework {
    use(args: any): void;
    post(path: string, ...args: any[]): void;
    get(path: string, ...args: any[]): void;
    listen(port: string, callback?: () => void): void;
}

export interface ILogger {
    trace(value: any): void;
    info(value: any): void;
    error(value: any): void;
}

export type UsecaseHandler = (context: ContextAdapter<any>) => Promise<any>;

export interface IUsecaseInteractor {
    createOne(
        usecase: UsecaseHandler
    ): (req: Request, res: Response) => Promise<void>;
    getMany(
        usecase: UsecaseHandler
    ): (req: Request, res: Response) => Promise<void>;
    getOne(
        usecase: UsecaseHandler
    ): (req: Request, res: Response) => Promise<void>;
}

export interface IFormData {
    handler(field: string): RequestHandler;
}

export interface IImagesUsecase {
    connect(): Promise<boolean>;
    upload(context: ContextAdapter<Image>): Promise<Image>;
    getMany(context: ContextAdapter<Array<Image>>): Promise<Array<Image>>;
    getOne(context: ContextAdapter<Readable>): Promise<Readable>;
}

export interface IResponseFactory {
    Create(context: ContextAdapter<any>): void;
}

export interface IMinioClient {
    MakeBucket(bucketName: string, region: Region): Promise<boolean>;
    Upload(
        bucketName: string,
        objectName: string,
        stream: string | ReadableStream | Buffer,
        metaData?: ItemBucketMetadata
    ): Promise<string>
    Download(
        bucketName: string,
        objectName: string
    ): Promise<ReadableStream>
}
