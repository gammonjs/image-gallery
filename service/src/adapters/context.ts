import { Request, Response } from 'express';

export class ContextAdapter<T> {
    public readonly _req: Request;
    public readonly _res: Response;
    private readonly _dictionary: Map<any, any>;

    constructor(req: Request, res: Response) {
        this._req = req;
        this._res = res;
        this._dictionary = new Map<any, any>();
    }

    set = <T>(key: any, value: T) => {
        this._dictionary.set(key, value);
    };

    get = <T>(key: any): T => {
        return this._dictionary.get(key);
    };
}
