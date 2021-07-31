import { Service } from 'typedi';
import express, { Express, Request, Response } from 'express';
import MinioClient, { IMinioClient } from './minio';
import PostgresClient, { IPostgresClient } from './postgres';
import { Image } from '../entity/Image';
import cors from 'cors';
import Multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';

const ORIGIN = `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`;
const MULTER = Multer({ storage: Multer.memoryStorage() }).single('IMAGE');

export interface IApplication {
    connect(): void;
    route(): void;
    run(): Promise<void>;
}

@Service()
class ApplicationAdapter {
    private _repository: Repository<Image>;
    constructor(
        // because we annotated ExampleInjectedService with the @Service()
        // decorator TypeDI will automatically inject an instance of
        // ExampleInjectedService here when the ExampleService class is requested
        // from TypeDI.
        private _minioClient: MinioClient,
        private _postgresClient: PostgresClient
    ) {}

    connect = async () => {
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

    upload = async (req: Request, res: Response) => {
        const generatedId = uuidv4();

        await this._minioClient.Upload('images', generatedId, req.file.buffer);

        const image = new Image();
        image.name = req.file.originalname;
        image.generatedId = generatedId;
        image.mimeType = req.file.mimetype;

        const images = this._repository.create(image);
        const result = await this._repository.save(images);

        res.status(201).json({
            created_at: result.created_at,
            id: result.generatedId,
            name: result.name,
            location: `${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/images/${result.generatedId}`
        });
    };

    getCollection = async (req: Request, res: Response) => {
        const images = await this._repository.find();
        res.setHeader('Content-Type', 'application/json');
        res.header('X-Record-Count', images.length.toString());
        res.json(
            images.map((x) => ({
                created_at: x.created_at,
                id: x.generatedId,
                name: x.name,
                mimeType: x.mimeType,
                location: `${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/images/${x.generatedId}`
            }))
        );
    };

    getOne = async (req: Request, res: Response) => {
        const readableStream = await this._minioClient.Download(
            'images',
            req.params.id
        );

        if (!readableStream.readable) {
            return res.status(500).send('not readable');
        }
        // const contentType = stream.headers['content-type'];

        res.setHeader('Content-Type', 'image/jpeg');
        readableStream.pipe(res);
    };
}

@Service()
class Application implements IApplication {
    private _framework: Express;
    constructor(private _application: ApplicationAdapter) {}

    connect = () => {
        this._application.connect();
    }

    route = (): void => {
        this._framework = express();
        this._framework.use(cors({ origin: ORIGIN }));
        this._framework.use(express.json());
        this._framework.use(express.urlencoded({ extended: true }));
        this._framework.post('/images', MULTER, this._application.upload);
        this._framework.get('/images', this._application.getCollection);
        this._framework.get('/images/:id', this._application.getOne);
    }

    run = async (): Promise<void> => {
        this._framework.listen(process.env.SERVICE_PORT, () => {
            console.log(
                `⚡️[server]: Server is running at ${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}`
            );
        });
    }
}

export default Application;
