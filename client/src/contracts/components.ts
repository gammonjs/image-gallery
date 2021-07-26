import { IPictureModel } from './models';

export interface IPictureUploader {
    addImage: (image: IPictureModel) => void;
    imageResourceUrl: string;
}

export interface IGalleryViewModel extends IPictureUploader {
    images: Array<IPictureModel>;
    fetchImages: () => void;
}
