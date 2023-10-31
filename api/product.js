import store from '../store'
import {
	request
} from '../https'
const pageQueryItem = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/product/pageQueryItem`,
		data: data,
		method: 'POST'
	})
}
const getItemInfo = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/product/getItemInfo`,
		data: data,
		method: 'POST'
	})
}
export default {
	pageQueryItem,
	getItemInfo
}
