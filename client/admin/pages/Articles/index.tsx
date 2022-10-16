import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import axios from '@blog/client/admin/axios';
import queryString from 'query-string';
import { parseTime } from '@blog/client/libs/time';
import scrollIntoView from '@blog/client/admin/utils/scroll.into.view';
import { Table, Button, Popconfirm, message, Input, Row, Tag, Typography, Image, Space } from 'antd';
import { PlusOutlined, DeleteFilled, EditFilled, SearchOutlined, HighlightOutlined } from '@ant-design/icons';
import BasicLayout from '@blog/client/admin/layouts';
import ActionCard from '@blog/client/admin/components/ActionCard';

export default function Index() {
    const [state, setState] = useState({
        articles: [],
        pagination: {
            current: 1,
            total: 0,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Dữ liệu bài viết`,
        },
        selectedRowKeys: [],
        loading: false,
        visible: false,
        searchKey: '',
        isResetFetch: false,
    });
    const fetchData = (page = 1, limit = 10) => {
        setState((data) => {
            return { ...data, isResetFetch: false, loading: true };
        });
        const query = {
            limit,
            page,
        };
        if (state.searchKey) {
            Object.assign(query, {
                title: state.searchKey,
            });
        }
        axios.get('/articles?' + queryString.stringify(query)).then((res) => {
            const pagination = { ...state.pagination, current: page, total: res.data.totalCount };
            setState((data) => ({
                ...data,
                articles: res.data.items,
                loading: false,
                pagination,
            }));
            scrollIntoView('article-panel');
        });
    };
    const deleteArticle = (_id) => {
        axios.delete('/articles/' + _id).then(() => {
            message.success('Xóa bài viết thành công!');
            fetchData();
        });
    };
    const batchDeleteArticle = () => {
        axios
            .delete('/articles', {
                data: { articleIds: state.selectedRowKeys },
            })
            .then((res) => {
                if (res && res.data && res.data.deletedCount > 0) {
                    message.success('Xóa bài viết thành công!');
                    setState((data) => ({
                        ...data,
                        selectedRowKeys: [],
                    }));
                    return fetchData();
                }
                return message.error('Xóa bài viết không thành công, vui lòng thử lại。');
            });
    };
    const getTableColums = () => {
        return [
            {
                title: 'Tóm tắt',
                dataIndex: 'title',
                render: (text, record) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '15px' }}>
                            <a href={'/blog/articles/' + record._id} className="thumbnail">
                                <Image
                                    preview={false}
                                    alt=""
                                    src={record.screenshot}
                                    width="100px"
                                    height="60px"
                                    fallback="data:image/png;base64,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"
                                />
                            </a>
                        </div>
                        <div>
                            <Typography.Paragraph style={{ fontSize: '14px', fontWeight: 'normal' }}>
                                {text}
                            </Typography.Paragraph>
                            <div>
                                <Button
                                    size="small"
                                    title="Chỉnh sửa"
                                    type="link"
                                    icon={<EditFilled />}
                                    onClick={() => Router.push('/admin/content/articles/edit/' + record._id)}
                                >
                                    Chỉnh sửa
                                </Button>
                                <Popconfirm
                                    title="Xác nhận rằng bạn muốn xóa?"
                                    onConfirm={() => deleteArticle(record._id)}
                                >
                                    <Button danger type="link" size="small" title="Xóa bỏ" icon={<DeleteFilled />}>
                                        Xóa
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                title: 'Danh mục',
                dataIndex: 'category',
                width: 100,
                render: (text, record) => (record.category ? record.category.name : 'Chưa được phân loại'),
            },
            {
                title: 'Lượt xem',
                dataIndex: 'viewsCount',
                width: 80,
            },
            {
                title: 'Lượt comments',
                dataIndex: 'commentCount',
                width: 80,
            },
            {
                title: 'Trạng thái',
                dataIndex: 'isDraft',
                render: (text, record) =>
                    record.isDraft ? (
                        <Tag color="rgb(229, 239, 245);">Dự thảo</Tag>
                    ) : (
                        <Tag color="default">Được phát hành</Tag>
                    ),
            },
            {
                title: 'Thời điểm tạo',
                dataIndex: 'createdAt',
                width: 160,
                render: (text, record) => parseTime(record.createdAt),
            },
        ];
    };
    const handleTableChange = (pagination) => {
        const pager = { ...state.pagination };
        pager.current = pagination.current;
        setState((data) => ({
            ...data,
            pagination: pager,
        }));
        fetchData(pagination.current, pagination.pageSize);
    };
    const onSelectChange = (selectedRowKeys) => {
        setState((data) => ({
            ...data,
            selectedRowKeys,
        }));
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
        <Row justify="space-between">
            <Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => Router.push('/admin/content/articles/edit')}
                >
                    Thêm bài viết
                </Button>
                <Popconfirm
                    title="Xác nhận rằng bạn muốn xóa?"
                    placement="right"
                    visible={state.visible}
                    onConfirm={() => batchDeleteArticle()}
                    onVisibleChange={() => {
                        if (state.selectedRowKeys.length <= 0) {
                            message.info('Vui lòng chọn một bài viết sẽ bị xóa');
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
            <Space>
                <Input
                    type="text"
                    name="searchTitle"
                    placeholder="Vui lòng nhập từ khóa tiêu đề bài viết"
                    value={state.searchKey}
                    onChange={(e) => {
                        const value = e.currentTarget.value;
                        setState((val) => ({
                            ...val,
                            searchKey: value,
                        }));
                    }}
                />
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => {
                        fetchData();
                    }}
                >
                    Tìm kiếm
                </Button>
                <Button
                    type="primary"
                    icon={<HighlightOutlined />}
                    onClick={() => {
                        setState((value) => ({
                            ...value,
                            searchKey: '',
                            isResetFetch: true,
                        }));
                    }}
                >
                    Nhập lại
                </Button>
            </Space>
        </Row>
    );
    return (
        <BasicLayout>
            <ActionCard title={CTitle} bodyStyle={{ padding: 0 }}>
                <Table
                    rowKey={(record) => record._id}
                    rowSelection={rowSelection}
                    columns={getTableColums()}
                    dataSource={state.articles}
                    pagination={state.pagination}
                    loading={state.loading}
                    onChange={(pagination) => handleTableChange(pagination)}
                />
            </ActionCard>
        </BasicLayout>
    );
}
