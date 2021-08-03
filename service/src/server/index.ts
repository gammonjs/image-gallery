import { Inject, Service } from 'typedi';
import { Images, Interactor } from '../usecases';
import { FIELD, ROUTE, SERVICE_DOMAIN, SERVICE_PORT } from '../constants';
import {
    IFramework,
    IImagesUsecase,
    ILogger,
    IFormData,
    IServer,
    IUsecaseInteractor
} from '../contracts';
import {
    MulterAdapter,
    ConsoleLoggerAdapter,
    ExpressAdapter
} from '../adapters';

@Service()
class Server implements IServer {
    constructor(
        @Inject(/* istanbul ignore next */ () => ExpressAdapter)
        private readonly _framework: IFramework,

        @Inject(/* istanbul ignore next */ () => MulterAdapter)
        private readonly _formData: IFormData,

        @Inject(/* istanbul ignore next */ () => ConsoleLoggerAdapter)
        private readonly _logger: ILogger,

        @Inject(/* istanbul ignore next */ () => Interactor)
        private readonly _interactor: IUsecaseInteractor,

        @Inject(/* istanbul ignore next */ () => Images)
        private readonly _images: IImagesUsecase
    ) {}

    connect = () => this._images.connect();

    route = (): void => {
        this._framework.post(
            ROUTE.IMAGES,
            this._formData.handler(FIELD.IMAGE),
            this._interactor.createOne(this._images.upload)
        );
        this._framework.get(
            ROUTE.IMAGES,
            this._interactor.getMany(this._images.getMany)
        );
        this._framework.get(
            ROUTE.IMAGES_BY_ID,
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
