import React, { useState } from 'react';
import { IPictureModel } from '../../contracts/models';
import GalleryView from '../views/Gallery';

const IMAGES_RESOURCE = `${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/images`;

const GalleryViewModel: React.FC = () => {
    const [images, setImages] = useState<Array<IPictureModel>>();

    const fetchImages = async () => {
        const response = await fetch(IMAGES_RESOURCE);

        if (response.status !== 200) {
            return;
        }

        const data = await response.json();

        setImages(data);
    };

    const addImage = (image: IPictureModel) =>
        setImages((prev) => (prev ? [...prev, image] : [image]));

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
