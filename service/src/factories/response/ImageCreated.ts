import { Service } from 'typedi';
import { ContextAdapter } from '../../adapters/context';
import { SERVICE_DOMAIN } from '../../constants';
import { Image } from '../../entity/Image';

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
