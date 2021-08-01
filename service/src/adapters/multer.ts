import { RequestHandler } from 'express';
import { Service } from 'typedi';
import Multer from 'multer';

@Service()
class MulterAdapter {
    public readonly _multer: Multer.Multer;

    constructor() {
        this._multer = Multer({ storage: Multer.memoryStorage() });
    }

    handler = (field: string): RequestHandler => this._multer.single(field);
}

export default MulterAdapter;
