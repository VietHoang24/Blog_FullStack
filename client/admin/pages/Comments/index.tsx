import React, { useEffect, useState } from 'react';
import axios from '@blog/client/admin/axios';
import queryString from 'query-string';
import { timeAgo } from '@blog/client/libs/time';
import { Table, Button, Popconfirm, message } from 'antd';
import { gernateAvatarImage } from '@blog/client/common/helper.util';
import scrollIntoView from '@blog/client/admin/utils/scroll.into.view';
import Router from 'next/router';
import { DeleteFilled, EditFilled, SendOutlined, CommentOutlined, BranchesOutlined } from '@ant-design/icons';
import BasicLayout from '@blog/client/admin/layouts';
import style from './style.module.scss';
import ActionCard from '@blog/client/admin/components/ActionCard';

export default function Comments() {
    const [state, setState] = useState({
        pagination: { current: 1, total: 0 },
        comments: [],
        selectedRowKeys: [],
        loading: false,
        visiable: false,
    });
    const fetchData = (page = 1, limit = 10) => {
        setState((data) => ({
            ...data,
            loading: true,
        }));
        const query = {
            limit,
            page,
        };
        axios.get('/admin-comments?' + queryString.stringify(query)).then((res) => {
            const pagination = { ...state.pagination };
            pagination.total = res.data.totalCount;
            setState((data) => ({
                ...data,
                comments: res.data.items,
                loading: false,
                pagination,
            }));
            scrollIntoView('comments-panel');
        });
    };
    const deleteComment = (_id) => {
        axios.delete('/comments/' + _id).then(() => {
            message.success('Xóa bình luận thành công');
            fetchData();
        });
    };
    const batchDeleteComment = () => {
        axios
            .delete('/comments', {
                data: { commentIds: state.selectedRowKeys },
            })
            .then((res) => {
                if (res && res.data && res.data.deletedCount > 0) {
                    message.success('Xóa các ý kiến ​​thành công!');
                    setState((data) => ({
                        ...data,
                        selectedRowKeys: [],
                    }));
                    return fetchData();
                }
                return message.error('Xóa bình luận không thành công, vui lòng thử lại.');
            });
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
    const getTableColums = () => {
        return [
            {
                title: 'Tên ',
                dataIndex: 'nickName',
                width: 160,
            },
            {
                title: 'Email',
                dataIndex: 'email',
                width: 100,
            },
            {
                title: 'Thời gian',
                dataIndex: 'createdAt',
                width: 140,
                render: (text, record) => timeAgo(record.createdAt),
            },
            {
                title: 'Tiêu đề bài viết',
                dataIndex: 'article',
                render: (text, record) => (record.article && record.article.title) || '--',
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
                            onClick={() => Router.push('/admin/content/comments/reply/' + record._id)}
                        >
                            Phản hồi
                        </Button>
                        ,
                        <Popconfirm title="Xác nhận rằng bạn muốn xóa?" onConfirm={() => deleteComment(record._id)}>
                            <Button danger={true} size="small" title="Xóa bỏ" icon={<DeleteFilled />}>
                                Xóa
                            </Button>
                        </Popconfirm>
                    </div>
                ),
            },
        ];
    };
    const { selectedRowKeys } = state;
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange.bind(this),
    };
    const expandedRowKeys = state.comments.map((item) => item._id);
    const CTitle = (
        <Popconfirm
            title="Xác nhận rằng bạn muốn xóa?"
            placement="right"
            visible={state.visiable}
            onVisibleChange={() => {
                if (state.selectedRowKeys.length <= 0) {
                    message.info('Vui lòng chọn nhận xét sẽ bị xóa');
                    return;
                }
                setState((data) => ({
                    ...data,
                    visiable: !state.visiable,
                }));
            }}
            onConfirm={() => batchDeleteComment()}
        >
            <Button danger={true} icon={<DeleteFilled />}>
                Xóa hàng loạt
            </Button>
        </Popconfirm>
    );
    return (
        <BasicLayout>
            <ActionCard title={CTitle} bodyStyle={{ padding: 0 }}>
                <Table
                    rowKey={(record) => record._id}
                    rowSelection={rowSelection}
                    columns={getTableColums()}
                    loading={state.loading}
                    dataSource={state.comments}
                    onChange={(pagination) => handleTableChange(pagination)}
                    pagination={{
                        showTotal: (total) => `Phổ thông ${total} xem xét dữ liệu`,
                    }}
                    expandedRowRender={(record) => {
                        return (
                            <React.Fragment>
                                {record.reply && (
                                    <div>
                                        <div className={style.tip}>
                                            <BranchesOutlined />
                                            Trích dẫn:
                                        </div>
                                        <div className={style.replyListItem}>
                                            <div className={style.userAvatar}>
                                                <img src={gernateAvatarImage(record.reply.nickName)} />
                                            </div>
                                            <div className={style.replyContent}>
                                                <div className={style.replyInfo}>
                                                    <div className={style.baseInfo}>
                                                        <div className="reply-author">{record.reply.nickName}</div>
                                                        <a className="reply-time">
                                                            Hiện hữu {timeAgo(record.reply.createdAt)} Bình luận
                                                        </a>
                                                    </div>
                                                    <div className={style.userAction}>
                                                        <Button
                                                            size="small"
                                                            icon={<SendOutlined />}
                                                            onClick={() => {
                                                                Router.push(
                                                                    '/admin/content/comments/reply/' + record.reply._id
                                                                );
                                                            }}
                                                        >
                                                            Phản hồi
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div
                                                    className={style.markdownText}
                                                    dangerouslySetInnerHTML={{
                                                        __html: record.reply.content,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div style={{ padding: '0 20px' }}>
                                    <div className={style.tip}>
                                        <CommentOutlined />
                                        Bình luận:
                                    </div>
                                    <div
                                        className="markdown-body"
                                        dangerouslySetInnerHTML={{
                                            __html: record.content,
                                        }}
                                    ></div>
                                </div>
                            </React.Fragment>
                        );
                    }}
                    expandedRowKeys={expandedRowKeys}
                />
            </ActionCard>
        </BasicLayout>
    );
}
