import React from 'react';
import {
    DashboardOutlined,
    FormOutlined,
    CommentOutlined,
    AppstoreOutlined,
    FileOutlined,
    UserOutlined,
    SettingOutlined,
    ShareAltOutlined,
} from '@ant-design/icons';

const menuConfig = [
    {
        path: '/admin/dashboard',
        title: 'Dashboard',
        icon: <DashboardOutlined />,
    },

    {
        path: '/admin/content/articles',
        title: 'Quản lý bài viết',
        icon: <FormOutlined />,
        childMenus: [
            {
                title: 'Thêm bài viết',
                path: '/admin/content/articles/edit',
                exact: true,
            },
            {
                title: 'Chỉnh sửa bài viết',
                path: '/admin/content/articles/edit/:id',
                exact: true,
            },
        ],
    },
    {
        path: '/admin/content/categories',
        title: 'Quản lý danh mục',
        icon: <AppstoreOutlined />,
        childMenus: [
            {
                title: 'Thêm doanh mục',
                path: '/admin/content/categories/edit',
                exact: true,
            },
            {
                title: 'Chỉnh sửa danh mục',
                path: '/admin/content/categories/edit/:id',
                exact: true,
            },
        ],
    },
    {
        path: '/admin/content/comments',
        title: 'Quản lý bình luận',
        icon: <CommentOutlined />,
        childMenus: [
            {
                title: 'Trả lời bình luận',
                path: '/admin/content/comments/reply/:id',
                exact: true,
            },
        ],
    },
    {
        path: '/admin/explore',
        title: 'Khám phá quản lý',
        icon: <ShareAltOutlined />,
        exact: true,
    },
    {
        path: '/admin/code/static-files',
        title: 'Quản lỳ files',
        icon: <FileOutlined />,
        exact: true,
    },
    {
        path: '/admin/code/static-files/:folderId',
        exact: true,
    },
    {
        path: '/admin/user/person',
        icon: <UserOutlined />,
        title: 'Thông tin người dùng',
        hidden: true,
        exact: true,
    },
    {
        path: '/admin/settings',
        icon: <SettingOutlined />,
        title: 'Cấu hình hệ thông',
        exact: true,
    },
];

export default menuConfig;
