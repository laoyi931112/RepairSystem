<template>
	<view class="container">
		<view class="info-wrap">
			<view class="info-item">
				<view class="iconfont laoyi-icon-jiesuo info-icon"></view>
				<u-input type="password" v-model="oldpassword" :border="true"
					:placeholder="$t('app_enter_old_pwd')" clearable class="info-input" height="84"></u-input>
			</view>
			<view class="info-item">
				<view class="iconfont laoyi-icon-jiesuo info-icon"></view>
				<u-input type="password" v-model="newpassword" :border="true" :placeholder="$t('app_enter_new_pwd')"
					clearable class="info-input" height="84"></u-input>
			</view>
			<view class="info-item">
				<u-button class="info-btn" size="medium" @click="handleModifyPwd" style="height: 84rpx;">{{$t('app_confirm')}}</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import user from '../../api/user.js'
	import utils from '../../utils/index.js'
	import md5 from '../../utils/md5.js'
	export default {
		data() {
			return {pagetitle: 'app_modify_password',
				certCode: '',
				oldpassword: '',
				newpassword: '',
			};
		},
		onLoad(options) {
			const that = this
			if (!options.certCode) {
				setTimeout(() => {
					utils.showmessage(that.$t('app_enter_verification_code')).then(() => {
						uni.navigateBack()
					})
				}, 500)
				return
			}
			that.certCode = options.certCode
		},
		onReady() {
			const that = this
			uni.setNavigationBarTitle({
				title: that.$t('app_modify_password')
			})
		},
		methods: {
			toJSON(){},
			handleModifyPwd() {
				const that = this
				if (!that.certCode) {
					utils.showmessage(that.$t('app_enter_verification_code'))
					return
				}
				if (!that.oldpassword) {
					utils.showmessage(that.$t('app_enter_old_pwd'))
					return
				}
				if (!that.newpassword) {
					utils.showmessage(that.$t('app_enter_new_pwd'))
					return
				}
				let params = {
					certCode: that.certCode,
					currentPwd: md5.hex_md5_32(that.oldpassword),
					newPwd: md5.hex_md5_32(that.newpassword)
				}
				user.modifyPwd(params).then(res => {
					console.log('handleModifyPwd', res)
					that.$store.dispatch('setUserStatusInfo', res?.data)
					utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
						uni.reLaunch({
							url: `/pages/login/login`
						})
					})
				}).catch(res => {
					if (res) {
						utils.showmessage(that.$t(res)).then(() => {
							uni.navigateBack()
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: $uni-bg-color;
		padding-bottom: 96rpx;
		min-height: 100vh;

		.info-wrap {
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 64rpx;
			background-color: $uni-bg-color;

			.info-item {
				display: flex;
				flex-direction: row;
				padding-bottom: 24rpx;
				position: relative;

				.info-icon {
					position: absolute;
					left: 12rpx;
					top: 40%;
					transform: translate(0,-50%);
					font-size: 32rpx;
				}

				.info-input {
					margin-right: 12rpx;
					flex: 1;
					::v-deep .u-input{
						padding-left: 64rpx !important;
					}
				}

				.info-btn {
					margin: 240rpx auto 48rpx auto;
					&>button{
						width: 320rpx;
					}
				}
			}
		}
	}
</style>
