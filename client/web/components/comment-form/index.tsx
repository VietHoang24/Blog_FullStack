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
            return setErrorMessage('????????????6????????????');
        } else if (!isLength(data.content, { max: 490 })) {
            return setErrorMessage('??????????????????490????????????');
        }
        setButtonLoading(true);
        axios
            .post(props.url, data)
            .then(() => {
                location.reload();
            })
            .catch(() => {
                setErrorMessage('?????????????????????????????????????????????????????????????????????');
            });
    };
    return (
        <div>
            {/* <Alert
                message={
                    <div>
                        Ch??? ????? nh???n x??t hi???n t???i: Ch??? ????? du l???ch, h??? th???ng s??? t??? ?????ng t???o th??ng tin d??? li???u li??n quan.
                        <Tooltip
                            placement="topLeft"
                            title="Khi xu???t b???n b??nh lu???n, xin vui l??ng tu??n th??? lu???t ph??p v??
                             quy ?????nh c???a ?????t n?????c b???n v?? lu???t ph??p Vi???t Nam, v?? c???m ph??t h??nh n???i dung li??n quan ?????n ch??nh tr???; 
                            n???i dung c???a c??c b??nh lu???n n??n li??n quan ?????n n???i dung c???a trang, c???m t???t c??? c??c n???i dung V?? ngh??a v?? nghi??m t??c ch???y; xin vui l??ng t??n tr???ng ng?????i kh??c v?? b??nh lu???n th??n thi???n. Xin h??y duy tr?? s??? t??n tr???ng ?????i v???i ng?????i kh??c nh?? th??? n??i chuy???n v???i ng?????i kh??c ?????i m???t v???i -Face; c???m ph??t h??nh qu???ng c??o th????ng m???i."
                        >
                            <a>????? bi???t chi ti???t.</a>
                        </Tooltip>
                    </div>
                }
                type="warning"
                showIcon
            /> */}
            <div className={style.userInfo}>
                <span className={style.userInfoText}>T??i kho???n:</span>
                <Avatar nickName={userInfo.nickName}></Avatar>
                <span className={style.userInfoText}>{userInfo.nickName}</span>
            </div>
            <div className={style.inputWrap}>
                {errorMessage && <Alert message={errorMessage} type="warning" showIcon />}
                <Input.TextArea
                    value={content}
                    placeholder="????? l???i m???t s??? tr???ng cho b???n~"
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
                        G???i ??i
                    </Button>
                </div>
            </div>
        </div>
    );
};
