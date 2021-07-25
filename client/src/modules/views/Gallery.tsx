import React, { useEffect, useState } from 'react';
import { Upload, message, Button, Input, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { IPictureModel } from '../../contracts/models';
import PictureCard from '../components/PictureCard';
import styled from 'styled-components';
interface IGalleryViewModel {
    images: Array<IPictureModel>;
    fetchImages: () => void;
    addImage: (image: IPictureModel) => void;
    imageResourceUrl: string;
}

const { Search } = Input;

const StyledGallery = styled.div`
    margin: 20px 0;
    margin-bottom: 20px;
    padding: 30px 50px;
    text-align: center;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
`;

const imageMimeType = /^image\/.*$/;

const GalleryView: React.FC<IGalleryViewModel> = (props: IGalleryViewModel) => {
    const [search, setSearch] = useState<string>();

    useEffect(() => {
        props.fetchImages();
    }, []);

    const stuff = {
        name: 'IMAGE',
        action: props.imageResourceUrl,
        beforeUpload: (file) => {
            if (imageMimeType.test(file.type)) {
                return true;
            }

            message.error(`${file.name} is not an image file`);
            return false;
        },
        onChange(info: UploadChangeParam) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                const image: IPictureModel = {
                    data: info.file.response.data,
                    name: info.file.response.name,
                    mimeType: info.file.response.mimeType
                };
                props.addImage(image);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        showUploadList: false
    };

    return (
        <div style={{ padding: '5%' }}>
            <div style={{ display: 'flex' }}>
                <Search
                    placeholder="input search text"
                    onSearch={setSearch}
                    enterButton
                    style={{ marginRight: '10%' }}
                />

                <Upload {...stuff}>
                    <Button type="primary" icon={<UploadOutlined />}>
                        Upload
                    </Button>
                </Upload>
            </div>
            <StyledGallery>
                {props.images ? (
                    props.images
                        .filter((x) => x.name.includes(search ?? ''))
                        .map((x) => <PictureCard key={x.name} {...x} />)
                ) : (
                    <Spin />
                )}
            </StyledGallery>
        </div>
    );
};

export default GalleryView;
