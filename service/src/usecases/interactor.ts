import { Request, Response } from 'express';
import internal from 'stream';
import { Service } from 'typedi';
import { ContextAdapter } from '../adapters/context';
import { Image } from '../entity/Image';
import { ResponseFactory } from '../factories/response';
import { ImagesUsecases } from './Images';

@Service()
class UsecaseInteractor {
    constructor(
        private _images: ImagesUsecases,
        private _response: ResponseFactory
    ) {}

    connect = this._images.connect;

    createOne = async (req: Request, res: Response) => {
        const context = new ContextAdapter<Image>(req, res);
        const image = await this._images.upload(context);

        context.set('output', image);

        this._response.Create(context);
    };

    getMany = async (req: Request, res: Response) => {
        const context = new ContextAdapter<Array<Image>>(req, res);
        const images = await this._images.getMany(context);
        context.set('output', images);
        this._response.Create(context);
    };

    getOne = async (req: Request, res: Response) => {
        const context = new ContextAdapter<internal.Readable>(req, res);
        const stream = await this._images.getOne(context);

        context.set('output', stream);
        // if (!stream.readable) {
        //     return res.status(500).send('not readable');
        // }

        this._response.Create(context);
    };
}

export default UsecaseInteractor;
