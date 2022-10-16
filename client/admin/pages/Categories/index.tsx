import React, { useEffect, useState } from 'react';
import axios from '@blog/client/admin/axios';
import { parseTime } from '@blog/client/libs/time';
import { Table, Button, Popconfirm, message, Space } from 'antd';
import Router from 'next/router';
import { PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import BasicLayout from '@blog/client/admin/layouts';
import queryString from 'query-string';
import ActionCard from '@blog/client/admin/components/ActionCard';

export default function Index() {
    const [state, setState] = useState({
        categories: [],
        selectedRowKeys: [],
        visible: false,
        loading: false,
    });
    const fetchData = () => {
        setState((data) => {
            return { ...data, isResetFetch: false, loading: true };
        });
        const query = {
            page: 1,
            limit: 100,
        };
        axios.get('/categories?' + queryString.stringify(query)).then((res) => {
            setState((data) => ({
                ...data,
                categories: res.data,
                loading: false,
            }));
        });
    };
    const deleteCategory = (_id) => {
        axios.delete('/categories/' + _id).then((res) => {
            message.success(`Xóa phân loại ${res.data.name} thành công!`);
            fetchData();
        });
    };
    const batchDeleteCategory = () => {
        axios
            .delete('/categories', {
                data: { categoryIds: state.selectedRowKeys },
            })
            .then((res) => {
                if (res && res.data && res.data.deletedCount > 0) {
                    message.success(`Xóa phân loại thành công!`);
                    setState((data) => ({
                        ...data,
                        selectedRowKeys: [],
                    }));
                    return fetchData();
                }
                return message.error('Xóa lỗi phân loại, vui lòng thử lại.');
            });
    };
    const onSelectChange = (selectedRowKeys) => {
        setState((data) => ({
            ...data,
            selectedRowKeys,
        }));
    };
    const getTableColums = () => {
        return [
            {
                title: 'Tên',
                dataIndex: 'name',
            },
            {
                title: 'Thời điểm tạo',
                dataIndex: 'createdAt',
                render: (text, record) => parseTime(record.createdAt),
            },
            {
                title: 'Số lượng bài viết',
                dataIndex: 'articleCount',
            },
            {
                title: 'Hành động',
                key: 'operation',
                width: 180,
                render: (text, record) => (
                    <div>
                        <Button
                            type="primary"
                            size="small"
                            title="chỉnh sửa"
                            icon={<EditFilled />}
                            onClick={() => Router.push('/admin/content/categories/edit/' + record._id)}
                        >
                            Chỉnh sửa
                        </Button>

                        <Popconfirm title="Xác nhận rằng bạn muốn xóa?" onConfirm={() => deleteCategory(record._id)}>
                            <Button danger={true} size="small" title="Xóa" icon={<DeleteFilled />}>
                                Xóa
                            </Button>
                        </Popconfirm>
                    </div>
                ),
            },
        ];
    };
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const { selectedRowKeys } = state;
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange.bind(this),
    };
    const CTitle = (
        <Space>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => Router.push('/admin/content/categories/edit')}
            >
                Thêm danh mục
            </Button>
            <Popconfirm
                title="Xác nhận rằng bạn muốn xóa?"
                placement="right"
                visible={state.visible}
                onConfirm={() => batchDeleteCategory()}
                onVisibleChange={() => {
                    if (state.selectedRowKeys.length <= 0) {
                        message.info('Vui lòng chọn phân loại để xóa');
                        return;
                    }
                    setState((data) => ({
                        ...data,
                        visible: !state.visible,
                    }));
                }}
            >
                <Button danger={true} icon={<DeleteFilled />}>
                    Xóa hàng loạt
                </Button>
            </Popconfirm>
        </Space>
    );
    return (
        <BasicLayout>
            <ActionCard title={CTitle} bodyStyle={{ padding: 0 }}>
                <Table
                    rowKey={(record: any) => record._id}
                    rowSelection={rowSelection}
                    columns={getTableColums()}
                    loading={state.loading}
                    dataSource={state.categories as any}
                />
            </ActionCard>
        </BasicLayout>
    );
}
