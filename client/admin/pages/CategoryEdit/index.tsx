import React, { useEffect } from 'react';
import axios from '@blog/client/admin/axios';
import { Form, Input, Button, message } from 'antd';
import Router, { useRouter } from 'next/router';
import BasicLayout from '@blog/client/admin/layouts';

export default function Index() {
    const router = useRouter();
    const [form] = Form.useForm();
    useEffect(() => {
        const { id } = router.query;
        if (id) {
            axios.get('/categories/' + id).then((res) => {
                const category = res.data;
                form.setFieldsValue(category);
            });
        }
    }, [1]);
    const createCategory = (data) => {
        return axios.post('/categories', data);
    };
    const updateCategory = (id, data) => {
        return axios.put('/categories/' + id, data);
    };
    const publish = (data) => {
        const { id } = router.query;
        const p = id ? updateCategory(id, data) : createCategory(data);
        p.then(() => {
            message.success('Gửi thành công');
            Router.push('/admin/content/categories');
        });
    };
    return (
        <BasicLayout>
            <div className="main-content">
                <Form form={form} onFinish={publish} style={{ marginTop: '20px' }}>
                    <Form.Item
                        name="name"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 10 }}
                        label="Tên danh mục:"
                        rules={[
                            {
                                required: true,
                                message: 'Độ dài của tên danh mục nằm trong khoảng 1-25 ký tự！',
                                min: 1,
                                max: 25,
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="Hành động:">
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </BasicLayout>
    );
}
