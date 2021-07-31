import { Service } from 'typedi';
import { ContextAdapter } from '../../adapters/context';
import { Image } from '../../entity/Image';
import { SERVICE_DOMAIN } from '../../constants'

@Service()
export class ImageCollectionRetrived {
    Create = (context: ContextAdapter<Array<Image>>) => {
        const images = context.get<Array<Image>>('output');

        context._res.setHeader('Content-Type', 'application/json');
        context._res.header('X-Record-Count', images.length.toString());
        context._res.json(
            images.map((x) => ({
                created_at: x.created_at,
                id: x.generatedId,
                name: x.name,
                mimeType: x.mimeType,
                location: `${SERVICE_DOMAIN}/images/${x.generatedId}`
            }))
        );
    };
}
