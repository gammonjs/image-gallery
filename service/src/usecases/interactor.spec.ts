import { Request, Response } from 'express';
import { ContextAdapter } from '../adapters';
import { IResponseFactory } from '../contracts';
import UsecaseInteractor from './interactor';

const req = <Request>{};
const res = <Response>{};
const expected = {};

const usecase = (context: ContextAdapter<any>): Promise<any> =>
    new Promise((resolve, reject) => resolve(expected));

describe('UsecaseInteractor', () => {
    it('should interact with creaate one usecase', async () => {
        // arrange
        let actual = null;
        const responseFactory = <IResponseFactory>{};
        responseFactory.Create = (context: ContextAdapter<any>): void => {
            actual = context.get('output');
        };
        const usecaseInteractor = new UsecaseInteractor(responseFactory);

        // act
        const handler = usecaseInteractor.getMany(usecase);
        await handler(req, res);

        // assert
        expect(actual).toEqual(expected);
    });

    it('should interact with getMany one usecase', async () => {
        // arrange
        let actual = null;
        const responseFactory = <IResponseFactory>{};
        responseFactory.Create = (context: ContextAdapter<any>): void => {
        actual = context.get('output');
    };
        const usecaseInteractor = new UsecaseInteractor(responseFactory);

        // act
        const handler = usecaseInteractor.createOne(usecase);
        await handler(req, res);

        // assert
        expect(actual).toEqual(expected);
    });

    it('should interact with getOne one usecase', async () => {
        // arrange
        let actual = null;
        const responseFactory = <IResponseFactory>{};
        responseFactory.Create = (context: ContextAdapter<any>): void => {
        actual = context.get('output');
    };
        const usecaseInteractor = new UsecaseInteractor(responseFactory);

        // act
        const handler = usecaseInteractor.getOne(usecase);
        await handler(req, res);

        // assert
        expect(actual).toEqual(expected);
    });
});
