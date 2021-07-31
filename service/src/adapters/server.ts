import { Service } from 'typedi';
import express, { Express } from 'express';
import cors from 'cors';
import Multer from 'multer';
import { UsecaseInteractor } from '../usecases/Interactor';
import { ORIGIN } from '../constants';

const MULTER = Multer({ storage: Multer.memoryStorage() }).single('IMAGE');

export interface IServer {
    connect(): void;
    route(): void;
    run(): Promise<void>;
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
