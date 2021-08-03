import { RequestHandler } from 'express';
import { Service } from 'typedi';
import Multer from 'multer';
import { IFormData } from '../contracts';

@Service()
class MulterAdapter implements IFormData {
    public readonly _multer: Multer.Multer;

    constructor() {
        this._multer = Multer({ storage: Multer.memoryStorage() });
    }

    handler = (field: string): RequestHandler => this._multer.single(field);
}

export default MulterAdapter;
