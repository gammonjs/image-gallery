import { IServer } from './server';
import { Application } from './app';

describe('Application', () => {
    it('should get server from container, connect, route and run', async () => {
        // arrange
        class Mock implements IServer {
            connect = jest.fn();
            route = jest.fn();
            run = jest.fn((): Promise<void> => new Promise((res, rej) => res()));
        }

        const mock = new Mock();

        // act
        await Application(mock);

        // assert
        expect(mock.connect).toBeCalledTimes(1);
        expect(mock.route).toBeCalledTimes(1);
        expect(mock.run).toBeCalledTimes(1);
    });
});
