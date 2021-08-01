import { Service } from 'typedi';
import { SERVICE_DOMAIN, SERVICE_PORT } from './constants';
import UsecaseInteractor from './usecases/interactor';
import Express from './adapters/express';
import Multer from './adapters/multer';
import Logger from './adapters/logger';

export interface IServer {
    connect(): void;
    route(): void;
    run(): Promise<void>;
}

@Service()
class Server implements IServer {
    constructor(
        private readonly _usecaseInteractor: UsecaseInteractor,
        private readonly _framework: Express,
        private readonly _multer: Multer,
        private readonly _logger: Logger
    ) {}

    connect = () => {
        this._usecaseInteractor.connect();
    };

    route = (): void => {
        this._framework.post(
            '/images',
            this._multer.handler('IMAGE'),
            this._usecaseInteractor.createOne
        );
        this._framework.get('/images', this._usecaseInteractor.getMany);
        this._framework.get('/images/:id', this._usecaseInteractor.getOne);
    };

    run = async (): Promise<void> => {
        this._logger.info(`⚡️[server]: Server is running at ${SERVICE_DOMAIN}`);
        this._framework.listen(SERVICE_PORT)
    };
}

export default Server;
