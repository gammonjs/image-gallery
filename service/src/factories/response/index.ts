import internal from 'stream';
import { Service } from 'typedi';
import { ContextAdapter } from '../../adapters/context';
import { Image } from '../../entity/Image';
import { ImageCollectionRetrived } from './ImageCollectionRetrived';
import { ImageCreated } from './ImageCreated';
import { ImageRetrived } from './ImageRetrieved';

@Service()
export class ResponseFactory {
    constructor(
        private _imageCreated: ImageCreated,
        private _imageRetrived: ImageRetrived,
        private _imageCollectionRetrived: ImageCollectionRetrived
    ) {}

    Create = (context: ContextAdapter<any>) => {
        const output = context.get('output');

        if (output instanceof Image) {
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
