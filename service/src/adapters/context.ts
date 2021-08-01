import { Request, Response } from 'express';

class ContextAdapter<T> {
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

    toString = () => {
        const dictionary = [];
        this._dictionary.forEach((value, key) =>
            dictionary.push({ key, value })
        );
        return JSON.stringify({
            req: JSON.stringify(this._req),
            res: JSON.stringify(this._res),
            dictionary
        });
    };
}

export default ContextAdapter;
