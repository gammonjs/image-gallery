import { IServer } from './server';
import { Application } from './app';

describe('Application', () => {
    it('should get server from container, connect, route and run', async () => {
        // arrange
        const mock = new Mock(new Promise((resolve, reject) => resolve(true)));

        // act
        await Application(mock);

        // assert
        expect(mock.connect).toBeCalledTimes(1);
        expect(mock.route).toBeCalledTimes(1);
        expect(mock.run).toBeCalledTimes(1);
    });

    it('should not route or run if unable to connect', async () => {
        // arrange
        const mock = new Mock(new Promise((resolve, reject) => resolve(false)));

        // act
        await Application(mock);

        // assert
        expect(mock.connect).toBeCalledTimes(1);
        expect(mock.route).toBeCalledTimes(0);
        expect(mock.run).toBeCalledTimes(0);
    });
});

class Mock implements IServer {
    private _handler: Promise<boolean>;
    constructor(handler: Promise<boolean>) {
        this._handler = handler
    }
    connect = jest.fn((): Promise<boolean> => this._handler);
    route = jest.fn();
    run = jest.fn((): Promise<void> => new Promise((res, rej) => res()));
}