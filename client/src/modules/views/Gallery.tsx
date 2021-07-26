import React, { useEffect, useState } from 'react';
import { Input, Spin, Divider, Alert } from 'antd';
import PictureCard from '../components/PictureCard';
import { IGalleryViewModel } from '../../contracts/components';
import PictureUploader from '../components/PictureUploader';

const { Search } = Input;

const GalleryView: React.FC<IGalleryViewModel> = (props: IGalleryViewModel) => {
    const [search, setSearch] = useState<string>();

    useEffect(() => {
        props.fetchImages();
    }, [props.fetchImages]);

    return (
        <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
            <div style={{ flex: '0 1 auto' }}>
                <div style={{ display: 'flex' }}>
                    <Search
                        placeholder="input search text"
                        onSearch={setSearch}
                        enterButton
                        style={{ marginRight: '5%' }}
                    />

                    <PictureUploader {...props} />
                </div>
                <Divider />
            </div>
            <div style={{ flex: '1 1 auto' }}>
                {props.images ? (
                    props.images
                        .filter((x) => x.name.includes(search ?? ''))
                        .map((x) => <PictureCard key={x.name} {...x} />)
                ) : (
                    <Spin tip="Loading..." style={{ height: '100%' }}>
                        <Alert
                            message="Retreiving Images"
                            description="Image buffers are being transmitted (instead of hrefs to minio bucket) and without paging."
                            type="info"
                        />
                    </Spin>
                )}
            </div>
            <div style={{ flex: '0 1 40px' }}>
                <Divider />
            </div>
        </div>
    );
};

export default GalleryView;
