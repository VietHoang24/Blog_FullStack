import axios from 'axios';
import { message } from 'antd';
import Router from 'next/router';
import config from '@blog/client/configs/admin.default.config';

axios.defaults.baseURL = '/api';

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
    const { response = {}, code, message: msg } = error;
    if (code === 'ECONNABORTED' || msg.includes('timeout')) {
        message.error('Hết thời gian kết nối');
        return Promise.reject(error);
    }
    const { status } = response;
    switch (status) {
        case 401:
            // Trả về 401 để xóa thông tin mã thông báo và nhảy vào trang đăng nhập
            localStorage.removeItem(config.tokenKey);
            Router.push('/admin/login');
            return Promise.reject(error);
        case 403:
            // Trả về 401 để xóa thông tin mã thông báo và nhảy vào trang đăng nhập
            localStorage.removeItem(config.tokenKey);
            Router.push('/admin/login');
            return Promise.reject(error);
        default:
            break;
    }
    if (response.data) {
        message.error(response.data.message);
    }
    return Promise.reject(error);
};

axios.interceptors.request.use(
    function (c) {
        const tokenKey = config.tokenKey;
        const token = localStorage.getItem(tokenKey);
        if (!(c.url && (c.url.includes('getFirstLoginInfo') || c.url.includes('login')))) {
            if (!token) {
                Router.push('/admin/login');
            }
        }
        c.headers.authorization = token || '';
        return c;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return errorHandler(error);
    }
);

export default axios;
