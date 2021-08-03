import Server from '.';
import { FIELD, ROUTE, SERVICE_DOMAIN, SERVICE_PORT } from '../constants';
import { Request, RequestHandler, Response } from 'express';
import {
    IFramework,
    ILogger,
    IFormData,
    IImagesUsecase,
    UsecaseHandler,
    IUsecaseInteractor
} from '../contracts';

const mockFramework = (): IFramework => {
    const framework = <IFramework>{};
    framework.post = jest.fn();
    framework.get = jest.fn();
    framework.listen = jest.fn();
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
        const mockImagesUsecase = <IImagesUsecase>{};
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
        fields.set(FIELD.IMAGE, MULTER_MIDDLEWARE);

        const mockMulter = <IFormData>{};
        mockMulter.handler = (field: string): RequestHandler =>
            fields.get(field);

        const mockImagesUsecase = <IImagesUsecase>{};
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

        const mockMulter = <IFormData>{};
        mockMulter.handler = jest.fn();

        const mockImagesUsecase = <IImagesUsecase>{};
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

        const mockMulter = <IFormData>{};
        mockMulter.handler = jest.fn();

        const mockImagesUsecase = <IImagesUsecase>{};
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
        expect(framework.listen).toBeCalledTimes(1);
        expect(framework.listen).toBeCalledWith(SERVICE_PORT);

        expect(logger.info).toBeCalledTimes(1);
        expect(logger.info).toBeCalledWith(
            `⚡️[server]: Server is running at ${SERVICE_DOMAIN}`
        );
    });
});
