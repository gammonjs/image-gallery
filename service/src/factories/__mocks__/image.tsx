import { Image } from '../../entity/Image';
import ImageFactory from '../ImageFactory';

jest.mock('../../factories/ImageFactory');

class MockImageFactory extends ImageFactory {
    private readonly _image: Image;
    constructor(image: Image) {
        super(null);
        this._image = image;
    }
    Create = jest.fn((name: string, mimeType: string): Image => this._image);
}

export default MockImageFactory;
