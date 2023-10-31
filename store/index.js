import Vue from 'vue'
import Vuex from "vuex"
Vue.use(Vuex)
import common from '../api/common.js'
import user from '../api/user.js'
export default new Vuex.Store({
	state: {
		api: 'http://47.254.214.47:8308',
		langData: {}, //所有翻译数据
		showAdvert: true, //是否展示广告
		languageList: [{
			label: '简体中文',
			value: 'cn',
		}, {
			label: 'English',
			value: 'en',
		}, {
			label: 'Malay',
			value: 'my',
		}], //语言列表
		enums: {}, //所有枚举
		userInfo: {}, //用户信息
		tempobj: '', //
	},
	getters: {
		getCurrentLang(state) {
			let temp = {
				label: '',
				value: state.userInfo?.lang
			}
			console.log('temp', temp, state.userInfo)
			if (temp?.value) {
				let lang = state.languageList?.find(ele => temp?.value == ele.value)
				temp.label = lang?.label
				return temp
			} else {
				let info = uni.getSystemInfoSync()
				console.log('SystemInfo', info)
				let language = info.language?.toLowerCase()
				//ms  en  zh-CN
				let key = 'en'
				switch (language) {
					case 'zh-cn':
						key = 'cn'
						break;
					case 'ms':
						key = 'my'
						break;
				}
				let lang = state.languageList?.find(ele => key == ele.value)
				temp.label = lang?.label
				temp.value = lang?.value
				return temp
			}
		}
	},
	mutations: {
		setAdvertStatus(state, flag) {
			state.showAdvert = flag
		},
		initLang(state,obj) {
			uni.removeStorageSync('currentLang')
			let langdata = uni.getStorageSync('langdata')
			console.log('缓存langdata:', langdata)
			if (langdata) {
				let keys = Object.keys(langdata)
				keys.forEach(key => {
					obj.app.$i18n.setLocaleMessage(key, langdata[key])
				})
				obj.app.$i18n.locale = obj.lang
				let pages = getCurrentPages()
				console.log('pages', pages)
				uni.setNavigationBarTitle({
					title: obj.app.$t(pages?. [pages?.length - 1]?.pagetitle)
				})
			}
			state.langData = langdata
		},
	},
	actions: {
		getLangJson(context, app) {
			console.log('getCurrentLang', context.getters.getCurrentLang.value)
			context.commit('initLang', {
				app,
				lang: context.getters.getCurrentLang.value
			})
			common.getLangData().then(res => {
				console.log('getLangData', res)
				res = res.data
				let keys = Object.keys(res)
				let langData = {}
				keys?.forEach(key => {
					let lang_key = Object.keys(res[key])
					lang_key?.forEach(lkey => {
						let temp_obj = langData[lkey]
						if (!temp_obj || Object.keys(temp_obj).length == 0) {
							temp_obj = {}
						}
						temp_obj[key] = res[key][lkey]
						langData[lkey] = temp_obj
					})
				})
				uni.setStorageSync('langdata', langData)
				context.state.langData = langData
			}).finally(() => {
				console.log('state.langData', context.state.langData)
				let keys = Object.keys(context.state.langData)
				keys.forEach(key => {
					app.$i18n.setLocaleMessage(key, context.state.langData[key])
				})
				app.$i18n.locale = context.getters.getCurrentLang.value
				let pages = getCurrentPages()
				console.log('pages', pages)
				uni.setNavigationBarTitle({
					title: app.$t(pages?. [pages?.length - 1]?.pagetitle)
				})
			})
		},
		setEnums(context) {
			common.getEnums().then(res => {
				console.log('setEnums', res);
				context.state.enums = res?.data
				context.state.languageList = []
				res?.data?.LangEnum?.forEach(ele => {
					context.state.languageList.push({
						label: ele.text,
						value: ele.value,
					})
				})
			})
		},
		setUserStatusInfo(context, info) {
			if (info) {
				uni.setStorageSync('userstatusinfo', info)
				uni.setStorageSync('token', info?.token)
				context.state.userInfo = info
			} else {
				uni.removeStorageSync('userstatusinfo')
				uni.removeStorageSync('token')
				context.state.userInfo = {}
			}
		},
		setUserInfo(context, app) {
			user.getMyInfo().then(res => {
				console.log('setUserInfo', res)
				context.state.userInfo = res?.data
				uni.setStorageSync('userstatusinfo', res?.data)
				app.$i18n.locale = res?.data?.lang
			})
		}
	}
})
