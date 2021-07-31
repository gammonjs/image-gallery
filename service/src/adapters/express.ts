import { Service } from 'typedi';
import express, { Express, Request, Response } from 'express';
import MinioClient from './minio';
import PostgresClient from './postgres';
import { Image } from '../entity/Image';
import cors from 'cors';
import Multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import internal from 'stream';
import { ResponseFactory } from '../factories/response';
import { ContextAdapter } from './context';

const ORIGIN = `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`;
const MULTER = Multer({ storage: Multer.memoryStorage() }).single('IMAGE');

export interface IServer {
    connect(): void;
    route(): void;
    run(): Promise<void>;
}

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

@Service()
class UsecaseInteractor {
    constructor(
        private _images: ImagesUsecases,
        private _response: ResponseFactory
    ) {}

    connect = this._images.connect;

    post = async (req: Request, res: Response) => {
        const context = new ContextAdapter<Image>(req, res);
        const image = await this._images.upload(context);

        context.set('output', image);

        this._response.Create(context);
    };

    getMany = async (req: Request, res: Response) => {
        const context = new ContextAdapter<Array<Image>>(req, res);
        const images = await this._images.getMany(context);
        context.set('output', images);
        this._response.Create(context);
    };

    getOne = async (req: Request, res: Response) => {
        const context = new ContextAdapter<internal.Readable>(req, res);
        const stream = await this._images.getOne(context);

        context.set('output', stream);
        // if (!stream.readable) {
        //     return res.status(500).send('not readable');
        // }

        this._response.Create(context);
    };
}

@Service()
class Server implements IServer {
    private _framework: Express;
    constructor(private _images: UsecaseInteractor) {}

    connect = () => {
        this._images.connect();
    };

    route = (): void => {
        this._framework = express();
        this._framework.use(cors({ origin: ORIGIN }));
        this._framework.use(express.json());
        this._framework.use(express.urlencoded({ extended: true }));
        this._framework.post('/images', MULTER, this._images.post);
        this._framework.get('/images', this._images.getMany);
        this._framework.get('/images/:id', this._images.getOne);
    };

    run = async (): Promise<void> => {
        this._framework.listen(process.env.SERVICE_PORT, () => {
            console.log(
                `⚡️[server]: Server is running at ${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}`
            );
        });
    };
}

export default Server;
