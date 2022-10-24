import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import axios from '@blog/client/admin/axios';
import { Input, Button, Alert, message, Form } from 'antd';
import { encrypt } from '@blog/client/admin/utils/crypto.util';
import useRequestLoading from '@blog/client/admin/hooks/useRequestLoading';
import { UserOutlined, LockOutlined, AliwangwangOutlined } from '@ant-design/icons';
import { ReactSVG } from 'react-svg';
import style from './style.module.scss';
import { useFetchConfigQuery } from '@blog/client/web/api';
import defaultConfig from '@blog/client/configs/admin.default.config';

export default function UserLogin() {
    const [data, setData] = useState({ message: '' });
    const { data: appConfig } = useFetchConfigQuery();
    const { loading, setLoading, injectRequestLoading } = useRequestLoading();
    const handleLogin = async (_data) => {
        const str = encrypt(JSON.stringify(_data));
        await injectRequestLoading(axios.post('/login', { key: str }))
            .then((res) => {
                message.success('Đăng nhập thành công!');
                localStorage.setItem(defaultConfig.userInfoKey, JSON.stringify(res.data));
                localStorage.setItem(defaultConfig.tokenKey, res.data.token);
                Router.push('/admin/dashboard');
            })
            .catch(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        axios.get('/getFirstLoginInfo').then((res) => {
            setData(res.data.data);
        });
    }, []);
    return (
        <div className={style.signIn}>
            <div className={style.signInMain}>
                <div className="header">
                    <ReactSVG className="brand" src={appConfig?.siteLogo} />
                    <div className="header-title">
                        <h2>{appConfig?.siteTitle}</h2>
                        <p>Đăng nhập vào salt blog</p>
                    </div>
                </div>
                <div className={style.signInPanel}>
                    <div className={style.signInHeader}>
                        <h3 className={style.signInTitle}>Đăng nhập</h3>
                    </div>
                    {data && <Alert message={data.message} type="warning" style={{ margin: '0 20px 20px 20px' }} />}
                    <Form onFinish={handleLogin} className="login-form">
                        {data && (
                            <Form.Item
                                name="userName"
                                label="Tên đăng nhập:"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 16 }}
                                rules={[{ required: true, message: 'Xin hãy điền tên đăng nhập!' }]}
                            >
                                <Input prefix={<AliwangwangOutlined />} placeholder="Vui lòng nhập" />
                            </Form.Item>
                        )}
                        <Form.Item
                            name="account"
                            label="Tài khoản:"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'Vui lòng nhập tài khoản của bạn!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Vui lòng nhập" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Mật khẩu:"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
                        >
                            <Input prefix={<LockOutlined />} type="password" placeholder="Vui lòng điền" />
                        </Form.Item>
                        <Form.Item label="Hành động:" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                            <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="nodeblog">
Được cung cấp bởi                    <a
                        href={appConfig?.siteDomain}
                        title="Hệ thống blog "
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                    Việt Salt
                    </a>
                </div>
            </div>
        </div>
    );
}
