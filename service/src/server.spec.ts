import Server from './server';
import { SERVICE_DOMAIN, SERVICE_PORT } from './constants';
import UsecaseInteractor, { UsecaseHandler } from './usecases/interactor';
import ImagesUsecases from './usecases/Images';
import { NextFunction, Request, Response } from 'express';
import Express from './adapters/express';
import Multer from './adapters/multer';
import Logger from './adapters/logger';

describe('Server', () => {
    it('should call the usecase interactor connect method', async () => {
        // arrange
        const images = new MockImagesUsecases(null, null, null, null);
        const server = new Server(null, null, null, null, images);

        // act
        server.connect();

        // assert
        expect(images.connect).toBeCalledTimes(1);
    });

    it('should route the correct paths to the correct handlers', async () => {
        // arrange
        const interactor = new MockUsecaseInteractor(null);
        const images = new MockImagesUsecases(null, null, null, null);
        const framework = new MockExpress();
        const multer = new MockMulter();
        const server = new Server(framework, multer, null, interactor, images);

        // act
        server.route();

        // assert
        expect(framework.post.mock.calls).toEqual([
            ['/images', multer.Handler, interactor.MockCreateOne]
        ]);

        expect(framework.get.mock.calls).toEqual([
            ['/images', interactor.MockGetMany],
            ['/images/:id', interactor.MockGetOne]
        ]);

        expect(framework.listen).toHaveBeenCalledTimes(0);
    });

    it('should log and listen', async () => {
        // arrange
        const framework = new MockExpress();
        const logger = new MockLogger();
        const server = new Server(framework, null, logger, null, null);

        // act
        await server.run();

        // assert
        expect(logger.info.mock.calls).toEqual([
            [`⚡️[server]: Server is running at ${SERVICE_DOMAIN}`]
        ]);
        expect(framework.listen.mock.calls).toEqual([[SERVICE_PORT]]);
        expect(framework.post).toHaveBeenCalledTimes(0);
        expect(framework.get).toHaveBeenCalledTimes(0);
    });
});

type Handler = (req: Request, res: Response) => Promise<void>;

jest.mock('./usecases/interactor');
class MockUsecaseInteractor extends UsecaseInteractor {
    public readonly MockCreateOne = (
        req: Request,
        res: Response
    ): Promise<void> => new Promise((resolve, reject) => resolve());

    public readonly MockGetMany = (
        req: Request,
        res: Response
    ): Promise<void> => new Promise((resolve, reject) => resolve());

    public readonly MockGetOne = (
        req: Request,
        res: Response
    ): Promise<void> => new Promise((resolve, reject) => resolve());

    connect = jest.fn();

    createOne = jest.fn(
        (usecase: UsecaseHandler): Handler => this.MockCreateOne
    );

    getMany = jest.fn(
        (usecase: UsecaseHandler): Handler => this.MockGetMany
    );

    getOne = jest.fn(
        (usecase: UsecaseHandler): Handler => this.MockGetOne
    );
}

jest.mock('./usecases/Images');
class MockImagesUsecases extends ImagesUsecases {
    connect = jest.fn(
        (): Promise<boolean> => new Promise((resolve, reject) => resolve(true))
    );
    upload = jest.fn();
    getMany = jest.fn();
    getOne = jest.fn();
}

jest.mock('./adapters/express');
class MockExpress extends Express {
    public readonly Listen = (port: string, callback?: () => void): any => {};
    post = jest.fn();
    get = jest.fn();
    listen = jest.fn(this.Listen);
}

jest.mock('./adapters/multer');
class MockMulter extends Multer {
    public readonly Handler = (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {};
    handler = jest.fn((field: string) => this.Handler);
}

jest.mock('./adapters/logger');
class MockLogger extends Logger {
    public readonly Info = () => {};
    info = jest.fn((value: any) => this.Info);
}
