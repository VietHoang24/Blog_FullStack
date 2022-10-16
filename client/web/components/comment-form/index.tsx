import React, { useEffect, useState } from 'react';
import isLength from 'validator/lib/isLength';
import { nanoid } from 'nanoid';
import Emoji from './emoji';
import { USER_COMMENT_INFO_KEY } from './constant';
import axios from '@blog/client/web/utils/axios';
import { Alert, Tooltip, Input, Button } from 'antd';
import style from './style.module.scss';
import dynamic from 'next/dynamic';

const Avatar = dynamic(() => import('./avatar'), {
    ssr: false,
});

interface Props {
    url: string;
    parentId?: string;
    replyId?: string;
    articleId?: string;
}

export const CommentForm = (props: Props) => {
    const [userInfo, setUserInfo] = useState<{ nickName: string; email: string }>({
        nickName: '',
        email: '',
    });
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);
    const onEmojiInput = (text: string) => {
        setContent((val) => {
            return val + text;
        });
    };
    useEffect(() => {
        const info = localStorage.getItem(USER_COMMENT_INFO_KEY);
        if (info) {
            const data: any = JSON.parse(info);
            setUserInfo(data);
        } else {
            const nickName = nanoid(6);
            const data = {
                nickName,
                email: 'visitor@lizc.email',
            };
            localStorage.setItem(USER_COMMENT_INFO_KEY, JSON.stringify(data));
            setUserInfo(data);
        }
    }, []);

    const submit = () => {
        const data = {
            nickName: userInfo.nickName,
            email: userInfo.email,
            article: props.articleId,
            content,
        };
        if (props.parentId) {
            Object.assign(data, {
                parentId: props.parentId,
            });
        }
        if (props.replyId) {
            Object.assign(data, {
                reply: props.replyId,
            });
        }
        if (!isLength(data.content, { min: 1 })) {
            return setErrorMessage('最少输入6个字符！');
        } else if (!isLength(data.content, { max: 490 })) {
            return setErrorMessage('最多只能输入490个字符！');
        }
        setButtonLoading(true);
        axios
            .post(props.url, data)
            .then(() => {
                location.reload();
            })
            .catch(() => {
                setErrorMessage('服务器开小差去了，请尝试刷新页面，再进行提交！');
            });
    };
    return (
        <div>
            {/* <Alert
                message={
                    <div>
                        Chế độ nhận xét hiện tại: Chế độ du lịch, hệ thống sẽ tự động tạo thông tin dữ liệu liên quan.
                        <Tooltip
                            placement="topLeft"
                            title="Khi xuất bản bình luận, xin vui lòng tuân thủ luật pháp và
                             quy định của đất nước bạn và luật pháp Việt Nam, và cấm phát hành nội dung liên quan đến chính trị; 
                            nội dung của các bình luận nên liên quan đến nội dung của trang, cấm tất cả các nội dung Vô nghĩa và nghiêm túc chạy; xin vui lòng tôn trọng người khác và bình luận thân thiện. Xin hãy duy trì sự tôn trọng đối với người khác như thể nói chuyện với người khác đối mặt với -Face; cấm phát hành quảng cáo thương mại."
                        >
                            <a>Để biết chi tiết.</a>
                        </Tooltip>
                    </div>
                }
                type="warning"
                showIcon
            /> */}
            <div className={style.userInfo}>
                <span className={style.userInfoText}>Tài khoản:</span>
                <Avatar nickName={userInfo.nickName}></Avatar>
                <span className={style.userInfoText}>{userInfo.nickName}</span>
            </div>
            <div className={style.inputWrap}>
                {errorMessage && <Alert message={errorMessage} type="warning" showIcon />}
                <Input.TextArea
                    value={content}
                    placeholder="Để lại một số trống cho bạn~"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                    onChange={(event) => {
                        setContent(event.target.value);
                    }}
                />
                <Emoji
                    onInput={(text) => {
                        onEmojiInput(text);
                    }}
                ></Emoji>
                <div className={style.commentFormFooter}>
                    <Button loading={buttonLoading} size="small" type="primary" onClick={() => submit()}>
                        Gửi đi
                    </Button>
                </div>
            </div>
        </div>
    );
};
