import internal from 'stream';
import { Service } from 'typedi';
import ContextAdapter from '../adapters/context';
import { IResponseFactory } from '../contracts';
import { Image } from '../entity/Image';
import { ImageCollectionRetrived } from './responses/ImageCollectionRetrived';
import { ImageCreated } from './responses/ImageCreated';
import { ImageRetrived } from './responses/ImageRetrieved';

@Service()
class ResponseFactory implements IResponseFactory {
    constructor(
        private _imageCreated: ImageCreated,
        private _imageRetrived: ImageRetrived,
        private _imageCollectionRetrived: ImageCollectionRetrived
    ) {}

    Create = (context: ContextAdapter<any>): void => {
        const output = context.get('output');

        if (output === null) {
            context._res.sendStatus(404)
        }
        else if (output instanceof Image) {
            this._imageCreated.Create(context);
        } else if (output instanceof Array) {
            this._imageCollectionRetrived.Create(context);
        } else if (output instanceof internal.Readable) {
            this._imageRetrived.Create(context);
        } else {
            context._res.status(500).send();
        }
    };
}

export default ResponseFactory;
