import { Request, Response } from 'express';
import internal from 'stream';
import { Service } from 'typedi';
import ContextAdapter from '../adapters/context';
import { Image } from '../entity/Image';
import ResponseFactory from '../factories/response';

export type UsecaseHandler = (context: ContextAdapter<any>) => Promise<any>;

export interface IUsecaseInteractor {
    createOne(usecase: UsecaseHandler): (req: Request, res: Response) => Promise<void>
    getMany(usecase: UsecaseHandler): (req: Request, res: Response) => Promise<void>
    getOne(usecase: UsecaseHandler): (req: Request, res: Response) => Promise<void>
}

@Service()
class UsecaseInteractor implements IUsecaseInteractor {
    constructor(private _response: ResponseFactory) {}

    createOne =
        (usecase: UsecaseHandler) =>
        async (req: Request, res: Response): Promise<void> => {
            const context = new ContextAdapter<Image>(req, res);
            const image = await usecase(context);
            context.set('output', image);
            this._response.Create(context);
        };

    getMany =
        (usecase: UsecaseHandler) =>
        async (req: Request, res: Response): Promise<void> => {
            const context = new ContextAdapter<Array<Image>>(req, res);
            const images = await usecase(context);
            context.set('output', images);
            this._response.Create(context);
        };

    getOne =
        (usecase: UsecaseHandler) =>
        async (req: Request, res: Response): Promise<void> => {
            const context = new ContextAdapter<internal.Readable>(req, res);
            const stream = await usecase(context);
            context.set('output', stream);
            this._response.Create(context);
        };
}

export default UsecaseInteractor;
