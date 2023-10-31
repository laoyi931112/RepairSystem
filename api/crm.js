import store from '../store'
import {
	request
} from '../https'
const queryBrandCompId = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/crm/queryBrandCompId`,
		data: data,
		method: 'POST'
	})
}
const getDistributorComp = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/crm/getDistributorComp`,
		data: data,
		method: 'POST'
	})
}
const pageQueryMaintainComp = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/crm/pageQueryMaintainComp`,
		data: data,
		method: 'POST'
	})
}
const getCompInfo = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/crm/getCompInfo`,
		data: data,
		method: 'POST'
	})
}
export default {
	getCompInfo,
	pageQueryMaintainComp,
	getDistributorComp,
	queryBrandCompId,
}
