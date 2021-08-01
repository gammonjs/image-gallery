import internal from 'stream';
import { Service } from 'typedi';
import ContextAdapter from '../../adapters/context';

@Service()
export class ImageRetrived {
    Create = (context: ContextAdapter<internal.Readable>) => {
        const stream = context.get<internal.Readable>('output');
        context._res.setHeader('Content-Type', 'image/jpeg');
        stream.pipe(context._res);
        return;
    };
}
