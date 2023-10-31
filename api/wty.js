import store from '../store'
import {
	request
} from '../https'
//保修维修申请
const saveMaintainApply = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/wty/saveMaintainApply`,
		data: data,
		method: 'POST'
	})
}
//分页查询我的维修申请
const pageQueryMaintainApply = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/wty/pageQueryMaintainApply`,
		data: data,
		method: 'POST'
	})
}
//分页查询我的保修单
const pageQueryWarranty = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/wty/pageQueryWarranty`,
		data: data,
		method: 'POST'
	})
}
//保存保修单
const saveWarranty = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/wty/saveWarranty`,
		data: data,
		method: 'POST'
	})
}
//提交维修申请
const submitMaintainApply = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/wty/submitMaintainApply`,
		data: data,
		method: 'POST'
	})
}
//提交维修单
const submitWarranty = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/wty/submitWarranty`,
		data: data,
		method: 'POST'
	})
}
//提交在线保修单
const saveWarrantyOnline = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/wty/saveWarrantyOnline`,
		data: data,
		method: 'POST'
	})
}
//提交离线保修单
const saveWarrantyOffline = (data) => {
	return request({
		url: `${store.state.api}/warranty-user-app/wty/saveWarrantyOffline`,
		data: data,
		method: 'POST'
	})
}
export default {
	saveWarrantyOffline,
	saveWarrantyOnline,
	saveMaintainApply,
	pageQueryMaintainApply,
	pageQueryWarranty,
	saveWarranty,
	submitMaintainApply,
	submitWarranty
}
