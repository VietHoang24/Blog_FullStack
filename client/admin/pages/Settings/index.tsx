import React, { useEffect, useState } from 'react';
import BasicLayout from '@blog/client/admin/layouts';
import { message } from 'antd';
import isFQDN from 'validator/lib/isFQDN';
import axios from '@blog/client/admin/axios';
import useRequestLoading from '@blog/client/admin/hooks/useRequestLoading';
import EditableInput from '@blog/client/admin/components/EditableInput';
import EmailInput from './EmailInput';
import style from './style.module.scss';

const fetchConfig = () => {
    return axios.get('/configs/admin');
};

const updateConfig = (data) => {
    return axios.put('/configs', data);
};

export default function Settings() {
    const [data, setData] = useState<any>({});
    const { loading, injectRequestLoading } = useRequestLoading();

    const onFinish = (values) => {
        const data = values;
        if (data.siteLogo) {
            Object.assign(data, {
                siteLogo: data.siteLogo[0].url,
            });
        }
        injectRequestLoading(updateConfig(data)).then(() => {
            message.success('Hoàn thành cập nhật');
        });
    };

    useEffect(() => {
        fetchConfig().then((res) => {
            setData(res.data);
        });
    }, []);
    return (
        <BasicLayout>
            <div className={style.wrap}>
                <div className={style.tip}>Trang web thông tin cơ bản</div>
                <EditableInput
                    value={data.siteTitle}
                    label="Trang Tiêu đề"
                    name="siteTitle"
                    placeholder="Vui lòng nhập tiêu đề trang web"
                    loading={loading}
                    onFinish={onFinish}
                ></EditableInput>
                <EditableInput
                    value={data.siteDomain}
                    label="Tên miền trang web"
                    name="siteDomain"
                    placeholder="Vui lòng nhập tên miền trang web"
                    loading={loading}
                    onFinish={onFinish}
                    rules={[
                        {
                            validator: (rule, value) => {
                                if (isFQDN(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    'Vui lòng nhập đúng tên miền trang web, chẳng hạn như www.saltblog.io'
                                );
                            },
                        },
                    ]}
                ></EditableInput>
                <EditableInput
                    value={data.siteIcp}
                    label="Nộp trang web ICP"
                    name="siteIcp"
                    placeholder="Vui lòng nhập ICP nộp đơn"
                    loading={loading}
                    onFinish={onFinish}
                ></EditableInput>
                <EditableInput
                    type="upload"
                    extra="Hiện tại, chỉ các tệp SVG được tải lên. Sử dụng logo tệp SVG có thể tương thích với chủ đề."
                    value={data.siteLogo}
                    label="Logo trang web"
                    name="siteLogo"
                    loading={loading}
                    onFinish={onFinish}
                ></EditableInput>
                <div className={style.tip}>Cấu hình meta trang web</div>
                <EditableInput
                    type="textarea"
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    value={data.siteMetaKeyWords}
                    label="META keywords"
                    name="siteMetaKeyWords"
                    placeholder="Vui lòng nhập từ khóa"
                    loading={loading}
                    onFinish={onFinish}
                ></EditableInput>
                <EditableInput
                    type="textarea"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    value={data.siteMetaDescription}
                    label="Mô tả meta"
                    name="siteMetaDescription"
                    placeholder="Vui lòng nhập mô tả"
                    loading={loading}
                    onFinish={onFinish}
                ></EditableInput>
                <EmailInput data={data}></EmailInput>
            </div>
        </BasicLayout>
    );
}
