import React, { useState, useEffect } from 'react';
import axios from '@blog/client/admin/axios';
import { parseTime } from '@blog/client/libs/time';
import { Form, Input, Button, message } from 'antd';
import Router, { useRouter } from 'next/router';
import BasicLayout from '@blog/client/admin/layouts';

export default function Index() {
    const [comment, setComment] = useState({
        article: {
            _id: '',
            title: '',
        },
        content: '',
        nickName: '',
        email: '',
        createdAt: '',
        parentId: '',
    });
    const router = useRouter();
    const [form] = Form.useForm();
    useEffect(() => {
        const { id } = router.query;
        if (id) {
            axios.get('/comments/' + id).then((res) => {
                const comment = res.data;
                form.setFieldsValue({
                    article: comment.article._id,
                });
                setComment(comment);
            });
        }
    }, [form, router.query]);

    const publish = (data) => {
        const { id } = router.query;
        if (comment.parentId) {
            Object.assign(data, { reply: id, parentId: comment.parentId });
        } else {
            Object.assign(data, { parentId: id });
        }
        axios.post('/admin/reply-comment/', data).then(() => {
            message.success('gửi thành công');
            Router.push('/admin/content/comments');
        });
    };

    return (
        <BasicLayout>
            <div className="main-content">
                <Form form={form} onFinish={publish} style={{ marginTop: '20px' }}>
                    <Form.Item name="article" style={{ display: 'none' }}>
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="Tên:">
                        <span className="ant-form-text">{comment.nickName}</span>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="Email：">
                        <span className="ant-form-text">{comment.email}</span>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="Thời điểm tạo:">
                        <span className="ant-form-text">{parseTime(comment.createdAt)}</span>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="Tiêu đề:">
                        <span className="ant-form-text">{comment.article && comment.article.title}</span>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="Nội dung:">
                        <span className="ant-form-text" dangerouslySetInnerHTML={{ __html: comment.content }}></span>
                    </Form.Item>
                    <Form.Item
                        name="content"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 10 }}
                        label="Nội dung trả lời:"
                        rules={[
                            {
                                required: true,
                                message: 'Nội dung trả lời không thể trống!',
                                min: 1,
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Vui lòng nhập nội dung trả lời"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        ></Input.TextArea>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="vận hành:">
                        <Button type="primary" htmlType="submit">
                            Gửi
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </BasicLayout>
    );
}
