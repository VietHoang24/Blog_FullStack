import React, { useEffect } from 'react';
import { message } from 'antd';
import { Form, Input, Alert, Button, Divider } from 'antd';
import axios from '@blog/client/admin/axios';
import useImageUpload from '@blog/client/admin/hooks/useImageUpload';
import useRequestLoading from '@blog/client/admin/hooks/useRequestLoading';

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const getLoginInfo = () => {
    return axios.get('/user/login-info');
};

const updateUserInfo = (data) => {
    return axios.put('/user/update', data);
};

export default function InfoForm() {
    const { loading, injectRequestLoading } = useRequestLoading();
    const { setImageUrl, UploadButton, handleUpload } = useImageUpload({
        style: {
            width: '70px',
            height: '70px',
            borderRadius: '50%',
        },
    });
    const [form] = Form.useForm();

    useEffect(() => {
        getLoginInfo().then((res) => {
            const avatar = [
                {
                    uid: -1,
                    status: 'done',
                    url: res.data.avatar,
                },
            ];
            setImageUrl(res.data.avatar);
            form.setFieldsValue({ ...res.data, avatar });
        });
    }, [form, setImageUrl]);

    const onFinish = (values) => {
        return injectRequestLoading(updateUserInfo({ ...values, avatar: values.avatar[0].url })).then(() => {
            message.success('Hoàn thành cập nhật!');
        });
    };

    return (
        <Form
            layout="vertical"
            form={form}
            name="UserForm"
            onFinish={onFinish}
            scrollToFirstError
            style={{ maxWidth: '540px', margin: '0 auto', width: '100%' }}
        >
            <Alert
                message="Sau khi dữ liệu được thay đổi, nó sẽ có hiệu lực vào lần tới!"
                type="warning"
                showIcon={true}
                style={{ marginBottom: '10px' }}
            />
            <Form.Item
                required={true}
                label="Hình đại diện"
                name="avatar"
                valuePropName="fileList"
                getValueFromEvent={handleUpload}
                rules={[{ required: true, message: 'Ảnh bìa không thể trống!' }]}
            >
                <UploadButton></UploadButton>
            </Form.Item>
            <Form.Item
                name="userName"
                label="Tên tài khoản"
                extra="Nên sử dụng tên người dùng dễ dàng để tạo điều kiện cho mọi người biết bạn"
                rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
            >
                <Input size="large" placeholder="Vui lòng nhập tên người dùng" />
            </Form.Item>
            <Form.Item
                name="email"
                label="Thư"
                extra="Hộp thư được sử dụng để nhận thông báo hệ thống"
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}
            >
                <Input size="large" placeholder="Vui lòng nhập email của bạn" />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button loading={loading} type="primary" htmlType="submit">
                    giữ cho
                </Button>
            </Form.Item>
            <Divider />
        </Form>
    );
}
