import { Readable } from 'stream';
import ContextAdapter from '../../adapters/context';
import { Image } from '../../entity/Image';
import ImagesUsecases from '../../usecases/Images';

jest.mock('../../usecases/Images');

class MockImagesUsecases extends ImagesUsecases {
    constructor(
        private readonly _image: Image,
        private readonly _images: Array<Image>,
        private readonly _stream: Readable
    ) {
        super(null, null, null, null);
    }
    connect = jest.fn();
    upload = jest.fn(
        (context: ContextAdapter<Image>): Promise<Image> =>
            new Promise((resolve, reject) => resolve(this._image))
    );
    getMany = jest.fn(
        (context: ContextAdapter<Image>): Promise<Array<Image>> =>
            new Promise((resolve, reject) => resolve(this._images))
    );
    getOne = jest.fn(
        (context: ContextAdapter<Readable>): Promise<Readable> =>
            new Promise((resolve, reject) => resolve(this._stream))
    );
}

export default MockImagesUsecases;
