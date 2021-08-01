import Server from './server';
import { SERVICE_DOMAIN, SERVICE_PORT } from './constants';
import UsecaseInteractor from './usecases/interactor';
import { NextFunction, Request, Response } from 'express';
import Express from './adapters/express';
import Multer from './adapters/multer';
import Logger from './adapters/logger';

describe('Server', () => {
    it('should call the usecase interactor connect method', async () => {
        // arrange
        const usecaseInteractor = new MockUsecaseInteractor(null, null);
        const server = new Server(usecaseInteractor, null, null, null);

        // act
        server.connect();

        // assert
        expect(usecaseInteractor.connect).toBeCalledTimes(1);
    });

    it('should route the correct paths to the correct handlers', async () => {
        // arrange
        const usecaseInteractor = new MockUsecaseInteractor(null, null);
        const framework = new MockExpress();
        const multer = new MockMulter();
        const server = new Server(usecaseInteractor, framework, multer, null);

        // act
        server.route();

        // assert
        expect(framework.post.mock.calls).toEqual([
            ['/images', multer.Handler, usecaseInteractor.createOne]
        ]);
        expect(framework.get.mock.calls).toEqual([
            ['/images', usecaseInteractor.getMany],
            ['/images/:id', usecaseInteractor.getOne]
        ]);
        expect(framework.listen).toHaveBeenCalledTimes(0)
    });

    it('should log and listen', async () => {
        // arrange
        const framework = new MockExpress();
        const logger = new MockLogger();
        const server = new Server(null, framework, null, logger);

        // act
        await server.run();

        // assert
        expect(logger.info.mock.calls).toEqual([
            [`⚡️[server]: Server is running at ${SERVICE_DOMAIN}`]
        ])
        expect(framework.listen.mock.calls).toEqual([
            [SERVICE_PORT]
        ])
        expect(framework.post).toHaveBeenCalledTimes(0)
        expect(framework.get).toHaveBeenCalledTimes(0)

    });
});

jest.mock('./usecases/interactor');
class MockUsecaseInteractor extends UsecaseInteractor {
    connect = jest.fn();
    createOne = jest.fn();
    getMany = jest.fn();
    getOne = jest.fn();
}

jest.mock('./adapters/express');
class MockExpress extends Express {
    public readonly Listen = (port: string, callback?: () => void): any => {}
    post = jest.fn();
    get = jest.fn();
    listen = jest.fn(this.Listen)
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
    public readonly Info = () => {}
    info = jest.fn((value: any) => this.Info);
}
