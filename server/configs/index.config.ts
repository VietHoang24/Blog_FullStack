export const environment = process.env.NODE_ENV ;
export const isDevMode = Object.is(environment, 'development');
export const isProdMode = Object.is(environment, 'production');
export const isTestMode = Object.is(environment, 'test');

export const APP_SERVER = {
    hostname: 'localhost',
    port: '8080',
    environment,
};

export const MONGODB = {
    uri: isDevMode
        ? 'mongodb+srv://Vietsalt:Emgaimua1@cluster0.nhyzzlj.mongodb.net/?retryWrites=true&w=majority'
        : isTestMode
        ? 'mongodb+srv://Vietsalt:Emgaimua1@cluster0.nhyzzlj.mongodb.net/?retryWrites=true&w=majority'
        : "mongodb+srv://Vietsalt:Emgaimua1@cluster0.nhyzzlj.mongodb.net/?retryWrites=true&w=majority"||process.env.MONGODB_URL ||
          `mongodb://${process.env.MONGODB_HOSTNAME || 'localhost'}:${process.env.MONGODB_PORT || '27017'}/blog`,
    username: process.env.MONGODB_USERNAME || '',
    password: process.env.MONGODB_PASSWORD || '',
};

export const TOKEN_SECRET_KEY = 'NODEBLOG/bs32g1038@163.com/TOKEN';

export const GITHUB_SECRET_KEY = 'Github/bs32g1038@163.com/TOKEN';

export const ADMIN_USER_INFO = {
    nickName: 'Viet Salt',
    email: 'vietprock@gmail.com',
    location: 'Vietnam',
};

export const RSS = {
    title: 'Salt Blog',
    link: 'http://www.lizc.net',
    language: 'zh-cn',
    description:
        'Trạm blog, tập trung vào phát triển web, đặc biệt là phát triển mặt trận.Tôi thích phát triển với những người trong Đạo!',
    maxRssItems: 50,
};

/**
 * 间隔时间 1 个小时 (60 * 60 * 1000毫秒)
 * 每个 ip 最多 30 条
 */
export const API_COMMENT_POST_RATE_LIMIT = {
    windowMs: 60 * 60 * 1000,
    max: 30,
};

/**
 * 间隔时间 1 个小时 (60 * 60 * 1000毫秒)
 * 每个 ip 最多 5000 次请求
 */
export const API_REQUEST_RATE_LIMIT = {
    windowMs: 60 * 60 * 1000,
    max: 5000,
};
