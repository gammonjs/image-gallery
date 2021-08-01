import { Service } from 'typedi';
import express, { Express } from 'express';
import cors from 'cors';
import { ORIGIN } from '../constants';

@Service()
class ExpressAdapter {
    private readonly _express: Express
    constructor() {
        this._express = express();
        this._express.use(cors({ origin: ORIGIN }));
        this._express.use(express.json());
        this._express.use(express.urlencoded({ extended: true }));
    }

    use = (args: any) => this._express.use(args);
    post = (path: string, ... args : any[]) => this._express.post(path, args)
    get = (path: string, ... args : any[]) => this._express.get(path, args)
    listen = (port: string, callback?: () => void) => this._express.listen(port, callback)
}

export default ExpressAdapter;
