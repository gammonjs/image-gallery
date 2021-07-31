import { Service } from 'typedi';
import { ContextAdapter } from '../../adapters/context';
import { Image } from '../../entity/Image';

const SERVICE_DOMAIN = `${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}`;

@Service()
export class ImageCreated {
    Create = (context: ContextAdapter<Image>) => {
        const image = context.get<Image>('output');
        context._res.status(201).json({
            created_at: image.created_at,
            id: image.generatedId,
            name: image.name,
            location: `${SERVICE_DOMAIN}/images/${image.generatedId}`
        });
        return;
    };
}
