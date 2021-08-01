import UsecaseInteractor from './interactor';
import ResponseFactory from '../factories/response';
import { ImagesUsecases } from './Images';
import ContextAdapter from '../adapters/context';
import { Image } from '../entity/Image';
import internal from 'stream';

describe('UsecaseInteractor', () => {
    it('should connect', () => {
        // arrange
        const imagesUsecases = new MockImagesUsecases(null, null);
        const usecaseInteractor = new UsecaseInteractor(imagesUsecases, null);

        // act
        usecaseInteractor.connect();

        // assert
        expect(imagesUsecases.connect).toHaveBeenCalledTimes(1);
    });

    it('should create one', async () => {
        // arrange
        const context = new ContextAdapter(req, res);
        context.set('output', image);
        const imagesUsecases = new MockImagesUsecases(null, null);
        const responseFactory = new MockResponseFactory(null, null, null);
        const usecaseInteractor = new UsecaseInteractor(
            imagesUsecases,
            responseFactory
        );

        // act
        await usecaseInteractor.createOne(req, res);

        let actual = imagesUsecases.upload.mock.calls.toString();
        const expected = [[context]].toString();
        expect(actual).toEqual(expected);

        actual = responseFactory.Create.mock.calls.toString();
        expect(actual).toEqual(expected);
    });

    it('should get many', async () => {
        // arrange
        const context = new ContextAdapter(req, res);
        context.set('output', images);
        const imagesUsecases = new MockImagesUsecases(null, null);
        const responseFactory = new MockResponseFactory(null, null, null);
        const usecaseInteractor = new UsecaseInteractor(
            imagesUsecases,
            responseFactory
        );

        // act
        await usecaseInteractor.getMany(req, res);

        let actual = imagesUsecases.getMany.mock.calls.toString();
        const expected = [[context]].toString();
        expect(actual).toEqual(expected);

        actual = responseFactory.Create.mock.calls.toString();
        expect(actual).toEqual(expected);
    });

    it('should get one', async () => {
        // arrange
        const context = new ContextAdapter(req, res);
        context.set('output', stream);
        const imagesUsecases = new MockImagesUsecases(null, null);
        const responseFactory = new MockResponseFactory(null, null, null);
        const usecaseInteractor = new UsecaseInteractor(
            imagesUsecases,
            responseFactory
        );

        // act
        await usecaseInteractor.getOne(req, res);

        let actual = imagesUsecases.getOne.mock.calls.toString();
        const expected = [[context]].toString();
        expect(actual).toEqual(expected);

        actual = responseFactory.Create.mock.calls.toString();
        expect(actual).toEqual(expected);
    });
});

jest.mock('../factories/response');
class MockResponseFactory extends ResponseFactory {
    Create = jest.fn();
}

jest.mock('./Images');
class MockImagesUsecases extends ImagesUsecases {
    connect = jest.fn();
    upload = jest.fn(
        (context: ContextAdapter<Image>): Promise<Image> =>
            new Promise((resolve, reject) => resolve(image))
    );
    getMany = jest.fn(
        (context: ContextAdapter<Image>): Promise<Array<Image>> =>
            new Promise((resolve, reject) => resolve(images))
    );
    getOne = jest.fn(
        (
            context: ContextAdapter<internal.Readable>
        ): Promise<internal.Readable> =>
            new Promise((resolve, reject) => resolve(stream))
    );
}

const image: Image = {
    id: 1234,
    created_at: new Date(),
    generatedId: 'wxyz',
    name: 'fake image',
    mimeType: 'foo/bar'
};

const images: Array<Image> = [
    {
        id: 1234,
        created_at: new Date(),
        generatedId: 'wxyz',
        name: 'fake image',
        mimeType: 'foo/bar'
    }
];

const stream = new internal.Readable();

const req: any = {
    get: jest.fn((name) => {
        if (name === 'content-type') return 'text/plain';
    })
};
const res: any = {
    send: jest.fn()
};
