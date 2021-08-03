import { Readable } from 'stream';
import { Image } from '../../entity/Image';

export const image: Image = {
    id: 1234,
    created_at: new Date(),
    generatedId: 'wxyz',
    name: 'fake image',
    mimeType: 'foo/bar'
};

export const images: Array<Image> = [
    {
        id: 1234,
        created_at: new Date(),
        generatedId: 'wxyz',
        name: 'fake image',
        mimeType: 'foo/bar'
    }
];

export const stream = new Readable();
