/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import style from './style.module.scss';
import BackTopBtn from '../back-top-button';
import BlogRuningTime from '../blog-runing-time';
import { ReactSVG } from 'react-svg';
import { EmailIcon, WechatIcon, QQIcon, GithubIcon, FacebookIcon } from '../../icons';
import icpPng from '@blog/client/assets/images/icp.png';
import { useFetchConfigQuery } from '../../api';

export const AppFooter = () => {
    const { data: config } = useFetchConfigQuery();
    return (
        <footer className={style.appFooter} id="app-footer">
            <BackTopBtn></BackTopBtn>
            <section className={style.content}>
                <div className={style.siteInfo}>
                    <div className={style.svgWrap}>
                        <ReactSVG src={config.siteLogo} />
                        <p className={style.siteTitle}>Chào mừng bạn đến {config.siteTitle} 😀</p>
                    </div>
                    <p className={style.siteTitle}>
                    {config.siteMetaDescription}
                    </p>
                </div>
                <div className={style.contact}>
                    <div className={style.contactTitle}>Liên hệ với tôi: </div>
                    <div className={style.contactList}>
                        <a href="mailto:viethoangquoc2312@gmail.com" target="_blank">
                            <EmailIcon></EmailIcon>
                        </a>
                        <a href="https://www.facebook.com/Viethaui/" target="_blank">
                            <FacebookIcon></FacebookIcon>
                        </a>
                        <a href={config.projectGithub || 'https://github.com/VietHoang24'} target="_blank">
                            <GithubIcon></GithubIcon>
                        </a>
                    </div>
                </div>
                <div className={style.statement}>
                    {/* <BlogRuningTime></BlogRuningTime> */}
                    Bản quyền © 2021-{new Date().getFullYear()} {config.siteTitle}
                    {/* <a href={config.icpGovCn}>
                        <img src={icpPng.src} alt={icpPng.src} />
                        <span>{config.siteIcp}</span>
                    </a> */}
                </div>
            </section>
            {/* <section className={style.support}>
                <h3>Hợp tác kinh doanh</h3>
                <p>Hợp đồng Front -end Business, trước khi liên hệ, xin vui lòng làm rõ nhu cầu của bạn, báo giá tối thiểu, thời gian xây dựng.</p>
                <div className={style.supportList}>
                    <a href="https://nestjs.com">
                        <img src={require('@blog/client/assets/svgs/logo-nestjs.svg')} />
                    </a>
                    <a href="https://react.docschina.org">
                        <img src={require('@blog/client/assets/svgs/logo-react.svg')} />
                    </a>
                    <a href="https://nodejs.org/en">
                        <img src={require('@blog/client/assets/svgs/logo-nodejs.svg')} />
                    </a>
                    <a href="https://ant.design">
                        <img src={require('@blog/client/assets/svgs/logo-ant-design.svg')} />
                    </a>
                </div>
            </section> */}
        </footer>
    );
};
