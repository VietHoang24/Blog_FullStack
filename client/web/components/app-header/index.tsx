import React from 'react';
import style from './style.module.scss';
import NavLink from '../nav-link';
import Link from '../link';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { SearchForm } from './search-form';
import { HomeOutlined, SettingOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons';
import { GithubIcon, MoonIcon, RssIcon, SunIcon } from '@blog/client/web/icons';
import { ReactSVG } from 'react-svg';
import { RootState } from '@blog/client/redux/store';
import scrollIntoView from '@blog/client/web/utils/scroll.into.view';
import { setTheme } from '@blog/client/redux/store';
import { useFetchConfigQuery } from '@blog/client/web/api';
import { useAppDispatch } from '@blog/client/web/hooks/app';

export const AppHeader = () => {
    const dispatch = useAppDispatch();
    const { data: config } = useFetchConfigQuery();
    const theme = useSelector((state: RootState) => state.app.theme);
    return (
        <header className={style.appHeader}>
            <Link href="/blog" passHref={true}>
                <a className={style.siteTitle}>
                    <div className={style.siteTileSvgWrap}>
                        <ReactSVG src={config.siteLogo} />
                    </div>
                    <h1>{config.siteTitle}</h1>
                </a>
            </Link>
            <nav className={style.nav}>
                {/* <a className={style.navA} onClick={() => scrollIntoView('app-footer')}>
                    <UserOutlined></UserOutlined>
                    <span>Cuối trang</span>
                </a> */}
                {/* <NavLink href="/blog">
                    <a className={style.navA}>
                        <HomeOutlined></HomeOutlined>
                        <span>Trang chủ</span>
                    </a>
                </NavLink> */}
                {/* <NavLink href="/blog/expore">
                    <a className={style.navA}>
                        <ShareAltOutlined />
                        <span>Tìm thấy</span>
                    </a>
                </NavLink> */}
                {/* <NavLink href="/blog/rss" target="_blank">
                    <a className={style.navA}>
                        <RssIcon className={style.branche}></RssIcon>
                        <span>Rss</span>
                    </a>
                </NavLink> */}
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <SearchForm style={{ marginRight: '15px' }} />
                {theme === 'light' ? (
                    <Button
                        type="link"
                        icon={<MoonIcon className={style.moonIcon}></MoonIcon>}
                        onClick={() => {
                            dispatch(setTheme({ theme: 'dark' }));
                        }}
                    ></Button>
                ) : (
                    <Button
                        type="link"
                        icon={<SunIcon className={style.sunIcon}></SunIcon>}
                        onClick={() => {
                            dispatch(setTheme({ theme: 'light' }));
                        }}
                    ></Button>
                )}
                {/* <a href="https://github.com/bs32g1038" target="__blank" style={{ marginLeft: '15px' }}>
                <GithubIcon name="github" width="24px" height="24px" className={style.githubIcon}></GithubIcon>
            </a> */}
                <NavLink href="/admin/dashboard">
                    <a className={style.navA}>
                        <UserOutlined></UserOutlined>
                        <span>Admin</span>
                    </a>
                </NavLink>
            </div>
        </header>
    );
};
