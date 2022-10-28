import React, { useState, useCallback } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import config from '@blog/client/configs/admin.default.config';
import { isEqual } from 'lodash';
import { RcFile } from 'antd/lib/upload';

function svgBeforeUpload(file) {
    const isSvg = file.type === 'image/svg+xml';
    if (!isSvg) {
        message.error('Chỉ có thể tải lên các tệp SVG!');
    }
    const isLt100K = file.size / 1024 < 100;
    if (!isLt100K) {
        message.error('SVG chỉ có thể tải lên 100k!');
    }
    return isSvg && isLt100K;
}

function beforeUpload(file) {
    const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/svg+xml';
    if (!isJpgOrPng) {
        message.error('Chỉ có thể tải lên hình ảnh JPG hoặc PNG!');
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
        message.error('Hình ảnh tối đa chỉ có thể tải lên 10MB!');
    }
    return isJpgOrPng && isLt10M;
}
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  })

interface Props {
    style?: object;
    disabled?: boolean;
    type?: 'image' | 'svg';
}

const isImage = (type) => isEqual(type, 'image');
const isSvg = (type) => isEqual(type, 'svg');

const Index = (props: Props) => {
    const { style = {}, disabled = false, type = 'image' } = props;
    const [isUploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleUpload =(info) => {
        
        let {file} = info;
        const getUrl= async (file) => {
            let  b64Url =await getBase64(file.originFileObj as RcFile)
   
            setImageUrl(b64Url)
        }
       
        
        if (Array.isArray(info)) {
            return info;
        }
        if (info.file.status === 'uploading') {
            setUploading(true);
        }
        if (info.file.status === 'done') {
            getUrl(file)
            // setImageUrl(info.file.response.url);
            setUploading(false);
            const fileList =
                info &&
                info.fileList.slice(-1).map((file) => {
                    if (file.response) {
                        file.url = file.response.url;
                    }
                    return file;
                });
            return fileList;
        }

        return info && info.fileList;
    };

    const UploadButton = useCallback(
        (props) => (
            <Upload
                disabled={disabled}
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/api/files/upload"
                accept={isImage(type) ? '.jpg,.jpeg,.png' : isSvg(type) && '.svg'}
                headers={{
                    authorization: typeof localStorage !== 'undefined' && localStorage.getItem(config.tokenKey),
                }}
                {...props}
                beforeUpload={(file) => {
                    if (isImage(type) && beforeUpload(file)) {
                        return props?.beforeUpload?.(file) || true;
                    }
                    if (isSvg(type) && svgBeforeUpload(file)) {
                        return props?.beforeUpload?.(file) || true;
                    }
                }}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt="" style={style} />
                ) : (
                    <div>
                        {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div className="ant-upload-text">Tải lên</div>
                    </div>
                )}
            </Upload>
        ),
        [imageUrl]
    );
    return {
        UploadButton,
        handleUpload,
        setImageUrl,
    };
};

export default Index;
