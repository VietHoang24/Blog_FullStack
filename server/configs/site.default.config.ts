const smptConfig = {
    isEnableSmtp: false,
    smtpHost: 'smtp.163.com',
    smtpSecure: true,
    smtpPort: 465,
    smtpAuthUser: 'your email address like : bs32g1038@163.com',
    smtpAuthpass: 'your email password',
};

export type SmptConfigType = typeof smptConfig;

const config = {
    siteTitle: 'Salt Blog ',
    siteMetaKeyWords:
        'Trang web cá nhân của Việt Salt, blog của Việt Salt, phát triển web, NodeJS Full Stack, Front -end Engineer, Back -end Development, Docker Container, Daily Life',
    siteMetaDescription:
        'Trang web cá nhân của Việt Salt tập trung vào phát triển web, đặc biệt là phát triển front-end.Tôi thích làm công nghệ và thích chia sẻ công nghệ.Trang web này chủ yếu để chia sẻ nội dung của các bài viết liên quan đến Web, cũng như các bản ghi liên quan đến công việc cá nhân!',
    siteLogo: '/static/logo.svg',

    siteIcp: 'Hà Nội Việt Nam',
    icpGovCn: 'http://www.beian.miit.gov.cn',

    github: 'https://github.com/bs32g1038',
    projectGithub: 'https://github.com/bs32g1038/node-blog',

    siteDomain: process.env.NODE_ENV === 'production' ? 'http://www.lizc.net' : 'http://127.0.0.1:3000',

    ...smptConfig,
};

export type configType = typeof config;

export default config;
