import { Request, RequestHandler, Response } from 'express';
import { IFramework } from './adapters/express';
import { ILogger } from './adapters/logger';
import { IMulterAdapter } from './adapters/multer';
import { SERVICE_DOMAIN } from './constants';
import Server, { ROUTE } from './server';
import { IImagesUsecases } from './usecases/Images';
import { IUsecaseInteractor, UsecaseHandler } from './usecases/interactor';

const mockFramework = (): IFramework => {
    const framework = <IFramework>{};
    framework.post = jest.fn();
    framework.get = jest.fn();
    return framework;
};

const UPLOAD = (req: Request, res: Response): Promise<void> =>
    new Promise((resolve, reject) => resolve());
const GET_MANY = (req: Request, res: Response): Promise<void> =>
    new Promise((resolve, reject) => resolve());
const GET_ONE = (req: Request, res: Response): Promise<void> =>
    new Promise((resolve, reject) => resolve());
const MULTER_MIDDLEWARE = null;

describe('Server', () => {
    it('should call the usecase interactor connect method', async () => {
        // arrange
        const mockImagesUsecase = <IImagesUsecases>{};
        mockImagesUsecase.connect = jest.fn();

        const server = new Server(null, null, null, null, mockImagesUsecase);

        // act
        server.connect();

        // assert
        expect(mockImagesUsecase.connect).toBeCalledTimes(1);
    });

    it('should route "POST: /images" with multer middleware and image upload usecase', async () => {
        // arrange
        const framework = mockFramework();

        const fields = new Map();
        fields.set('IMAGE', MULTER_MIDDLEWARE);

        const mockMulter = <IMulterAdapter>{};
        mockMulter.handler = (field: string): RequestHandler =>
            fields.get(field);

        const mockImagesUsecase = <IImagesUsecases>{};
        mockImagesUsecase.upload = jest.fn();

        const interactions = new Map();
        interactions.set(mockImagesUsecase.upload, UPLOAD);

        const usecase = (
            usecase: UsecaseHandler
        ): ((req: Request, res: Response) => Promise<void>) =>
            interactions.get(usecase);

        const mockUsecaseInteractor = <IUsecaseInteractor>{};
        mockUsecaseInteractor.createOne = usecase;
        mockUsecaseInteractor.getMany = jest.fn();
        mockUsecaseInteractor.getOne = jest.fn();

        const server = new Server(
            framework,
            mockMulter,
            null,
            mockUsecaseInteractor,
            mockImagesUsecase
        );

        // act
        server.route();

        // assert
        expect(framework.post).toHaveBeenCalledWith(
            ROUTE.IMAGES,
            MULTER_MIDDLEWARE,
            UPLOAD
        );
    });

    it('should route "GET: /images" with image getMany usecase', async () => {
        // arrange
        const framework = mockFramework();

        const mockMulter = <IMulterAdapter>{};
        mockMulter.handler = jest.fn();

        const mockImagesUsecase = <IImagesUsecases>{};
        mockImagesUsecase.getMany = jest.fn();

        const interactions = new Map();
        interactions.set(mockImagesUsecase.getMany, GET_MANY);

        const usecase = (
            usecase: UsecaseHandler
        ): ((req: Request, res: Response) => Promise<void>) =>
            interactions.get(usecase);

        const mockUsecaseInteractor = <IUsecaseInteractor>{};
        mockUsecaseInteractor.createOne = jest.fn();
        mockUsecaseInteractor.getMany = usecase;
        mockUsecaseInteractor.getOne = jest.fn();

        const server = new Server(
            framework,
            mockMulter,
            null,
            mockUsecaseInteractor,
            mockImagesUsecase
        );

        // act
        server.route();

        // assert
        expect(framework.get).toHaveBeenCalledWith(ROUTE.IMAGES, GET_MANY);
    });

    it('should route "GET: /images/:id" with multer image getOne usecase', async () => {
        // arrange
        const framework = mockFramework();

        const mockMulter = <IMulterAdapter>{};
        mockMulter.handler = jest.fn();

        const mockImagesUsecase = <IImagesUsecases>{};
        mockImagesUsecase.getOne = jest.fn();

        const interactions = new Map();
        interactions.set(mockImagesUsecase.getOne, GET_ONE);

        const usecase = (
            usecase: UsecaseHandler
        ): ((req: Request, res: Response) => Promise<void>) =>
            interactions.get(usecase);

        const mockUsecaseInteractor = <IUsecaseInteractor>{};
        mockUsecaseInteractor.createOne = jest.fn();
        mockUsecaseInteractor.getMany = jest.fn();
        mockUsecaseInteractor.getOne = usecase;

        const server = new Server(
            framework,
            mockMulter,
            null,
            mockUsecaseInteractor,
            mockImagesUsecase
        );

        // act
        server.route();

        // assert
        expect(framework.get).toHaveBeenCalledWith(ROUTE.IMAGES_BY_ID, GET_ONE);
    });

    it('should log and listen', async () => {
        // arrange
        const framework = mockFramework();

        const logger = <ILogger>{};
        logger.info = jest.fn();

        const server = new Server(framework, null, logger, null, null);

        // act
        await server.run();

        // assert
        expect(logger.info).toBeCalledWith(
            `⚡️[server]: Server is running at ${SERVICE_DOMAIN}`
        );
        expect(logger.info).toBeCalledTimes(0);
    });
});
