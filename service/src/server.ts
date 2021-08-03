import { Inject, Service } from 'typedi';
import { SERVICE_DOMAIN, SERVICE_PORT } from './constants';
import UsecaseInteractor, { IUsecaseInteractor } from './usecases/interactor';
import MulterAdapter, { IMulterAdapter } from './adapters/multer';
import LoggerAdapter, { ILogger } from './adapters/logger';
import ImagesUsecases, { IImagesUsecases } from './usecases/Images';
import ExpressAdapter, { IFramework } from './adapters/express';

export interface IServer {
    connect(): Promise<boolean>;
    route(): void;
    run(): Promise<void>;
}

export enum ROUTE {
    IMAGES = '/images',
    IMAGES_BY_ID = '/images/:id'
}

@Service()
class Server implements IServer {
    constructor(
        @Inject(() => ExpressAdapter)
        private readonly _framework: IFramework,

        @Inject(() => MulterAdapter)
        private readonly _multer: IMulterAdapter,

        @Inject(() => LoggerAdapter)
        private readonly _logger: ILogger,

        @Inject(() => UsecaseInteractor)
        private readonly _interactor: IUsecaseInteractor,

        @Inject(() => ImagesUsecases)
        private readonly _usecase: IImagesUsecases
    ) {}

    connect = () => this._usecase.connect();

    route = (): void => {
        this._framework.post(
            ROUTE.IMAGES,
            this._multer.handler('IMAGE'),
            this._interactor.createOne(this._usecase.upload)
        );
        this._framework.get(
            ROUTE.IMAGES,
            this._interactor.getMany(this._usecase.getMany)
        );
        this._framework.get(
            ROUTE.IMAGES_BY_ID,
            this._interactor.getOne(this._usecase.getOne)
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
