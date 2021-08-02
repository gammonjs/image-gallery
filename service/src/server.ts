import { Service } from 'typedi';
import { SERVICE_DOMAIN, SERVICE_PORT } from './constants';
import UsecaseInteractor from './usecases/interactor';
import Express from './adapters/express';
import Multer from './adapters/multer';
import Logger from './adapters/logger';
import ImagesUsecases from './usecases/Images';

export interface IServer {
    connect(): Promise<boolean>;
    route(): void;
    run(): Promise<void>;
}

@Service()
class Server implements IServer {
    constructor(
        private readonly _framework: Express,
        private readonly _multer: Multer,
        private readonly _logger: Logger,
        private readonly _interactor: UsecaseInteractor,
        private readonly _images: ImagesUsecases
    ) {}

    connect = () => this._images.connect();

    route = (): void => {
        this._framework.post(
            '/images',
            this._multer.handler('IMAGE'),
            this._interactor.createOne(this._images.upload)
        );
        this._framework.get(
            '/images',
            this._interactor.getMany(this._images.getMany)
        );
        this._framework.get(
            '/images/:id',
            this._interactor.getOne(this._images.getOne)
        );
    };

    run = async (): Promise<void> => {
        this._logger.info(
            `⚡️[server]: Server is running at ${SERVICE_DOMAIN}`
        );
        this._framework.listen(SERVICE_PORT);
    };
}

export default Server;
