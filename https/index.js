import utils from '../utils/index.js'
export const request = ({
	url,
	data = {},
	method = 'GET',
	header = {
		'content-type': 'application/json'
	},
	loading = true
}) => {
	const token = uni.getStorageSync('token')
	if (header && !header.hasOwnProperty('Authorization')) {
		header.Authorization = token
	}
	if (loading) {
		uni.showLoading({
			title: 'Loading',
			mask: true
		})
	}

	return new Promise((resolve, reject) => {
		console.log('url', url)
		uni.request({
			url: url,
			method: method,
			data: data,
			header: header,
			success(res) {
				console.log('res', res)
				if (loading) {
					uni.hideLoading()
				}
				if (res?.statusCode == 200) {
					if (res?.data?.resultCode == 401) {
						let pages = getCurrentPages()
						console.log('pages', pages)
						// if (uni.getStorageSync('loginflag') == true) return
						// uni.setStorageSync('loginflag', true)
						if (pages?.length > 0 && pages?. [0]?.route != 'pages/login/login') {
							uni.navigateTo({
								url: `/pages/login/login`,
								success() {
									// uni.setStorageSync('loginflag', false)
								}
							})
						}
						reject(null)
					} else if (res?.data?.resultCode == 200) {
						resolve(res?.data)
					} else if (res?.data?.resultCode == 400 || res?.data?.resultCode == 403) {
						reject(res?.data?.messages?. [0])
					} else {
						utils.showmessage('服务器发生错误，请稍后再试')
						reject(null)
					}
				} else {
					reject(res)
				}
			},
			fail(err) {
				if (loading) {
					uni.hideLoading()
				}
				console.log('err', err)
				reject(err)
			}
		})
	})
}
