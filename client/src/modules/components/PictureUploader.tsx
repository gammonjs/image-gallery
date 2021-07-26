import React, { useCallback } from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { IPictureModel } from '../../contracts/models';
import { IPictureUploader } from '../../contracts/components';

const imageMimeType = /^image\/.*$/;

const PictureUploader: React.FC<IPictureUploader> = (
    props: IPictureUploader
) => {
    const validate = useCallback((file) => {
        if (imageMimeType.test(file.type)) {
            return true;
        }

        message.error(`${file.name} is not an image file`);
        return false;
    }, []);

    const onChange = useCallback(
        (info: UploadChangeParam) => {
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
        [props.addImage]
    );

    return (
        <Upload
            name="IMAGE"
            action={props.imageResourceUrl}
            beforeUpload={validate}
            onChange={onChange}
            showUploadList={false}
        >
            <Button type="primary" icon={<UploadOutlined />}>
                Upload
            </Button>
        </Upload>
    );
};

export default PictureUploader;
