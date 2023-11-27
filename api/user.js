import store from '../store'
import {
	request
} from '../https'
const login = (params) => {
	return request({
		url: `${store.state.api}/warranty-user-app/login`,
		data: params,
		method: 'POST'
	})
}
const register = (params) => {
	return request({
		url: `${store.state.api}/warranty-user-app/register`,
		data: params,
		method: 'POST'
	})
}
const getTelCertCode = (params) => {
	return request({
		url: `${store.state.api}/warranty-user-app/getTelCertCode`,
		data: params,
		method: 'POST'
	})
}
const logout = (params) => {
	return request({
		url: `${store.state.api}/warranty-user-app/logout`,
		data: params,
		method: 'POST'
	})
}
const saveMyInfo = (params) => {
	return request({
		url: `${store.state.api}/warranty-user-app/saveMyInfo`,
		data: params,
		method: 'POST'
	})
}
const forgetPwd = (params) => {
	return request({
		url: `${store.state.api}/warranty-user-app/forgetPwd`,
		data: params,
		method: 'POST'
	})
}
const modifyPwd = (params) => {
	return request({
		url: `${store.state.api}/warranty-user-app/modifyPwd`,
		data: params,
		method: 'POST'
	})
}
const getMyInfo = () => {
	return request({
		url: `${store.state.api}/warranty-user-app/getMyInfo`,
		method: 'POST',
		loading: false
	})
}
const setLang = (params) => {
	return request({
		url: `${store.state.api}/warranty-user-app/setLang`,
		data: params,
		method: 'POST'
	})
}
const signOut = (params) => {
	return request({
		url: `${store.state.api}/warranty-user-app/signOut`,
		data: params,
		method: 'POST'
	})
}
export default {
	signOut,
	setLang,
	getMyInfo,
	modifyPwd,
	forgetPwd,
	saveMyInfo,
	login,
	register,
	getTelCertCode,
	logout
}
