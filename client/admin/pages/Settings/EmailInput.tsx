import React, { useEffect, useState } from 'react';
import { Input, Form, Button, Switch, message } from 'antd';
import { EditOutlined, SendOutlined, CloseOutlined, CheckOutlined, SoundOutlined } from '@ant-design/icons';
import useRequestLoading from '@blog/client/admin/hooks/useRequestLoading';
import axios from '@blog/client/admin/axios';
import style from './style.module.scss';

interface Props {
    data?: object;
}

const testEmail = () => {
    return axios.post('/email/test');
};

const updateEmailConfig = (data) => {
    return axios.put('/email', data);
};

export default function EmailInput(props: Props) {
    const { data } = props;
    const [disabled, setDisabled] = useState(true);
    const { loading, injectRequestLoading } = useRequestLoading();
    const [form] = Form.useForm();
    const onFinish = (values) => {
        injectRequestLoading(updateEmailConfig(values)).then(() => {
            message.success('hoàn thành cập nhật');
        });
    };
    useEffect(() => {
        form.setFieldsValue(data);
    }, [data, form]);
    return (
        <Form form={form} className="form" layout="vertical" onFinish={onFinish} wrapperCol={{ span: 16 }}>
            <div className={style.tip}>
                Cấu hình thông báo dịch vụ hộp thư trang web
                {disabled && (
                    <Button
                        type="link"
                        danger={true}
                        onClick={() => {
                            setDisabled(!disabled);
                        }}
                    >
                        <EditOutlined></EditOutlined>chỉnh sửa
                    </Button>
                )}
            </div>
            <Form.Item label="Hộp thư địa chỉ SMTP" name="smtpHost">
                <Input size="large" placeholder="Vui lòng nhập địa chỉ SMTP hộp thư" disabled={disabled} />
            </Form.Item>
            <Form.Item label="Địa chỉ email" name="smtpAuthUser">
                <Input size="large" placeholder="Vui lòng nhập địa chỉ email" disabled={disabled} />
            </Form.Item>
            <Form.Item label="Mật khẩu ủy quyền hộp thư" name="smtpAuthpass">
                <Input.Password
                    size="large"
                    placeholder="Vui lòng nhập mật khẩu ủy quyền hộp thư"
                    disabled={disabled}
                />
            </Form.Item>
            <Form.Item
                name="isEnableSmtp"
                valuePropName="checked"
                label="Có mở dịch vụ thông báo hộp thư không"
                extra="Kiểm tra, hệ thống sẽ gửi cho bạn email thông báo khi có nhận xét mới"
            >
                <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} disabled={disabled} />
            </Form.Item>
            {!disabled && (
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '10px' }}>
                        <SendOutlined></SendOutlined>Lưu cấu hình hộp thư
                    </Button>
                    <Button
                        loading={loading}
                        onClick={() => {
                            injectRequestLoading(testEmail()).then((res) => {
                                if (res && res.data === true) {
                                    return message.success('Cấu hình hộp thư là bình thường!');
                                }
                                message.error('Cấu hình email!');
                            });
                        }}
                    >
                        <SoundOutlined />
                        Kiểm tra gửi email
                    </Button>
                </Form.Item>
            )}
        </Form>
    );
}
