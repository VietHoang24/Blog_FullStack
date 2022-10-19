/**
 * 时间函数
 */
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.locale('vi');
dayjs.extend(relativeTime);

export const timeAgo = (timestamp: string) => {
    return dayjs(timestamp).fromNow();
};

export const parseTime = (timestamp: string, format = 'HH:mm DD-MM-YYYY ') => {
    return dayjs(timestamp).format(format);
};
