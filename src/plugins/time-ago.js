import TimeAgo from 'javascript-time-ago'
import zh_Hant from 'javascript-time-ago/locale/zh-Hant'

TimeAgo.addDefaultLocale(zh_Hant);

const timeAgo = new TimeAgo('zh-Hant');

// 使用方式:
// import timeAgo from "@/plugins/time-ago";
// timeAgo.format(new Date(...));

export default timeAgo;