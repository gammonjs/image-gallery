import { Service } from 'typedi';
import UUID from '../adapters/uuid';
import { Image } from '../entity/Image';

@Service()
class ImageFactory {
    constructor(private readonly _generatedId: UUID) {}
    Create = (name: string, mimeType: string): Image => {
        const image: Image = new Image();
        image.name = name;
        image.mimeType = mimeType;
        image.generatedId = this._generatedId.Create();
        return image;
    };
}

export default ImageFactory;
