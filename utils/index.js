/**
 *  对Date的扩展，将 Date 转化为指定格式的String
    月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    例子：
    (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    (new Date()).Format("yyyy-M-d h:m:s.S")   ==> 2006-7-2 8:9:4.18
 * @param {*} fmt 格式
 */
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
			"00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
//弹框
var hasshowmsg = false
var showmsg = null
const showmessage = (msg) => {
	showmsg = msg
	if (hasshowmsg) {
		return new Promise(() => {})
	}
	hasshowmsg = true
	var showmsgtime = (new Date()).getTime()
	while ((new Date()).getTime() - showmsgtime < 20) {
		continue
	}
	setTimeout(() => {
		hasshowmsg = false
	}, 1000)
	console.log('showmsg', showmsg);
	return uni.showModal({
		title: '',
		showCancel: false,
		content: showmsg,
		confirmColor: "#0E5FEB"
	})
}
const getRandomStr = () => {
	return Math.random().toString(36).substr(2)
}
const navigateBack = () => {
	let pages = getCurrentPages()
	console.log(pages)
	if (pages?.length > 1) {
		uni.navigateBack()
	} else {
		uni.reLaunch({
			url: `/pages/index/index`
		})
	}
}
const getMonthBetween = (start, end) => {
    let result = [];
        let min = new Date(start);
        let max = new Date(end);
        let curr = min;
        do{
            let month = new Date(curr).getMonth() + 1;
            let t = ""
            if (month < 10) {
                t = '0' + month
            } else t = month
            let str = curr.getFullYear() + "-" + (t);
            result.push(str);
            if (month == 12) {
                curr.setFullYear(new Date(curr).getFullYear() + 1)
                curr.setMonth(0)
            } else curr.setMonth(month);
        } while (curr <= max)

        return result;
}
export default {
	getMonthBetween,
	showmessage,
	getRandomStr,
	navigateBack
}
