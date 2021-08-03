import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import ContextAdapter from '../adapters/context';
import ResponseFactory from '../factories/response'
import {
    IResponseFactory,
    IUsecaseInteractor,
    UsecaseHandler
} from '../contracts';

// TODO: update the interactors with appropriate response headers
//       or turn this into a shared function in the server

@Service()
class UsecaseInteractor implements IUsecaseInteractor {

    constructor(
        @Inject( /* istanbul ignore next */ () => ResponseFactory)
        private _response: IResponseFactory
    ) {}

    createOne = (usecase: UsecaseHandler) =>
        async (req: Request, res: Response): Promise<void> => {
            const context = new ContextAdapter<any>(req, res);
            const output = await usecase(context);
            context.set('output', output);
            this._response.Create(context);
        };

    getMany = (usecase: UsecaseHandler) =>
        async (req: Request, res: Response): Promise<void> => {
            const context = new ContextAdapter<any>(req, res);
            const output = await usecase(context);
            context.set('output', output);
            this._response.Create(context);
        };

    getOne = (usecase: UsecaseHandler) =>
        async (req: Request, res: Response): Promise<void> => {
            const context = new ContextAdapter<any>(req, res);
            const output = await usecase(context);
            context.set('output', output);
            this._response.Create(context);
        };
}

export default UsecaseInteractor;
