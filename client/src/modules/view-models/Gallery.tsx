import React, { useCallback, useState } from 'react';
import { IPictureModel } from '../../contracts/models';
import GalleryView from '../views/Gallery';

const IMAGES_RESOURCE = `${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/images`;

const GalleryViewModel: React.FC = () => {
    const [images, setImages] = useState<Array<IPictureModel>>();

    const fetchImages = useCallback(async () => {
        const response = await fetch(IMAGES_RESOURCE);

        if (response.status !== 200) {
            return;
        }

        const data = await response.json();

        setImages(data);
    }, [setImages]);

    const addImage = useCallback(
        (image: IPictureModel) =>
            setImages((prev) => (prev ? [...prev, image] : [image])),
        [setImages]
    );

    return (
        <GalleryView
            images={images}
            fetchImages={fetchImages}
            addImage={addImage}
            imageResourceUrl={IMAGES_RESOURCE}
        />
    );
};

export default GalleryViewModel;
