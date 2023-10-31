import store from '../store'
import {
	request
} from '../https'
const queryShuffleInfo = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/cms/queryShuffleInfo`,
		data: data,
		method: 'POST'
	})
}
const getEnums = () => {
	return request({
		url: `${store.state.api}/warranty-user-app/getEnums`,
		data: {},
		method: 'POST',
		loading: false
	})
}
const getLangData = () => {
	// return getLangData1().then(ress => {
	// 	return request({
	// 		url: `${store.state.api}/warranty-user-app/getLangText`,
	// 		data: {},
	// 		method: 'POST',
	// 		loading: false
	// 	}).then(res => {
	// 		Object.assign(res.data, ress)
	// 		return res
	// 	})
	// })
	return request({
		url: `${store.state.api}/warranty-user-app/getLangText`,
		data: {},
		method: 'POST',
		loading: false
	})
}
const getLangData1 = () => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: '../static/lang.json',
			header: {
				'content-type': 'application/json',
			},
			success(res) {
				resolve(res?.data)
			}
		})
	})
}
const pageQueryInfo = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/cms/pageQueryInfo`,
		data: data,
		method: 'POST'
	})
}
const getUploadConfig = () => {
	return {
		url: `${store.state.api}/warranty-user-app/uploadFile`,
		headers: {
			'Authorization': uni.getStorageSync('token')
		}
	}
}
const viewInfo = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/cms/viewInfo`,
		data: data,
		method: 'POST'
	})
}
export default {
	viewInfo,
	getUploadConfig,
	pageQueryInfo,
	queryShuffleInfo,
	getEnums,
	getLangData
}
