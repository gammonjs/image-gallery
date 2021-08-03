import { RequestHandler } from 'express';
import { Service } from 'typedi';
import Multer from 'multer';

export interface IMulterAdapter {
    handler(field: string): RequestHandler;
}

@Service()
class MulterAdapter implements IMulterAdapter {
    public readonly _multer: Multer.Multer;

    constructor() {
        this._multer = Multer({ storage: Multer.memoryStorage() });
    }

    handler = (field: string): RequestHandler => this._multer.single(field);
}

export default MulterAdapter;
