<template>
	<page-meta>
		<navigation-bar :title="$t('op_login')" background-color="#F8F8F8" front-color="#000000"></navigation-bar>
	</page-meta>
	<view class="container">
		<view class="login-wrap">
			<u-image :src="logoUrl" width="186rpx" height="186rpx"></u-image>
			<view class="login-item">

				<view class="login-phone-prefix">
					<text>{{checkPhonePrefix.label?checkPhonePrefix.label:$t('app_select')}}</text>
				</view>
				<view class="iconfont laoyi-icon-shouji phone-icon">

				</view>
				<u-input class="login-input login-input1" v-model="phone" clearable
					:placeholder="$t('err_required_tel')" :border="true" :customStyle="{height:84+'rpx'}">
				</u-input>
			</view>
			<view class="login-item">
				<view class="iconfont laoyi-icon-jiesuo password-icon">

				</view>
				<u-input class="login-input login-input2" v-model="password" type="password" clearable
					:placeholder="$t('err_required_pwd')" :border="true" :customStyle="{height:84+'rpx'}"
					:password="true">
				</u-input>
			</view>
			<view class="login-item">
				<view class="" @click="toForget">
					{{$t('enum_sys_cert_event_forget_password')}}？
				</view>
				<view class="" @click="toRegister">
					<!-- 还没有账号？立即注册 -->
					{{$t('enum_sys_cert_event_register')}}?
				</view>
			</view>
			<view class="login-item">
				<u-button type="primary" class="login-btn" @click="handleLoginClick">{{$t('op_login')}}</u-button>
			</view>
		</view>
		<view class="login-agree">
			<u-radio-group v-model="checkAgree">
				<u-radio name="1">
			<!-- 	{{$t('app_agree')}} -->
				<text class="login-agree-text"
						@click.tap="toAgreement('agreement')">{{$t('app_agree')}}</text>
			<!-- 			{{$t('app_and')}}<text
						class="login-agree-text" @click.tap="toAgreement('privacy')">《{{$t('app_privacy_agreement')}}》</text> -->
						</u-radio>
			</u-radio-group>
		</view>
	</view>
</template>

<script>
	import user from '../../api/user.js'
	import utils from '../../utils/index.js'
	import md5 from '../../utils/md5.js'
	export default {
		data() {
			return {pagetitle: 'op_login',
				logoUrl: require('../../static/load_head@2x.png'),
				phone: '',
				password: '',
				showLang: false,
				checkAgree: '1',
				checkPhonePrefix: {
					label: '+60',
					value: '+60'
				}
			};
		},
		onLoad() {
			console.log('checkPhonePrefix', this.checkPhonePrefix)
		},
		onReady() {
			// setTimeout(() => {
			// 	uni.setNavigationBarTitle({
			// 		title: this.$t('op_login')
			// 	})
			// }, 600)

		},
		methods: {
			toJSON() {},
			toForget() {
				uni.navigateTo({
					url: `/pages/forget/forget`
				})
			},
			toRegister() {
				uni.navigateTo({
					url: `/pages/register/register`
				})
			},
			toAgreement(key) {
				uni.navigateTo({
					url: `/pages/article/article?type=${key}`
				})
			},
			handleLoginClick() {
				const that = this
				if (!that.phone) {
					utils.showmessage(that.$t('err_required_tel'))
					return
				}
				if (!that.password) {
					utils.showmessage(that.$t('err_required_pwd'))
					return
				}
				if (that.checkAgree != '1') {
					utils.showmessage(that.$t('err_required_pwd'))
					return
				}
				let params = {
					pwd: md5.hex_md5_32(that.password),
					tel: that.phone
				}
				user.login(params).then(res => {
					console.log('handleLoginClick', res)
					that.$store.dispatch('setUserStatusInfo', res?.data)
					that.$store.dispatch('setUserInfo')
					utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
						utils.navigateBack()
					})
				}).catch(res => {
					utils.showmessage(that.$t(res) || that.$t('app_server_error'))
				})
			}
		}
	}
</script>

<style lang="scss">
	body,
	uni-page-body {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding: 32rpx 48rpx;

		.system {
			width: 100%;
			display: inline-flex;
			justify-content: flex-end;

			.language-icon {
				font-size: 48rpx;
			}

			.language {
				height: 54rpx;
				position: relative;
				font-size: 32rpx;
				border: 1rpx solid $u-border-color;
				padding: 8rpx 24rpx;
				margin-left: 12rpx;
				border-radius: 10rpx;

				.language-icon {
					font-size: 20rpx;
					position: absolute;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					top: 50%;
					right: 10rpx;
					transform: translate(0, -50%);
				}

				.language-check {
					min-width: 150rpx;
					height: 100%;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					padding: 0rpx 28rpx 0rpx 0rpx;
				}
			}
		}

		.login-wrap {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100%;
			padding-top: 110rpx;

			.login-item {
				width: 100%;
				margin-top: 32rpx;
				padding: 0rpx 48rpx;
				display: inline-flex;
				justify-content: space-between;
				align-items: center;
				position: relative;

				&:first-child {
					margin-top: 150rpx;
				}

				.login-input {
					width: 100%;
					height: 84rpx;
				}

				.login-input1 {
					padding-left: 130rpx !important;
				}

				.login-input2 {
					padding-left: 72rpx !important;
				}

				.login-btn {
					width: 100%;
					height: 86rpx;
					margin-top: 380rpx;
					background: linear-gradient(-45deg, #446FE0 0%, #548EEB 100%);
					border-radius: 18rpx;
					border: none;
					font-size: 36rpx;
					font-weight: bold;
				}

				.phone-icon {
					position: absolute;
					font-size: 36rpx;
					left: 130rpx;
				}

				.password-icon {
					position: absolute;
					left: 64rpx;
					font-size: 36rpx;
				}

				.login-phone-prefix {
					position: absolute;
					left: 48rpx;
					font-size: 32rpx;
					// width: 120rpx;
					// border: 1rpx solid $u-border-color;
					// margin-right: 12rpx;
					height: 64rpx;
					display: inline-flex;
					justify-content: center;
					align-items: center;
					padding: 0rpx 20rpx 0rpx 12rpx;
					border-radius: 8rpx;
					// .login-phone-prefix-icon{
					// 	font-size: 16rpx;
					// 	position: absolute;
					// 	display: flex;
					// 	flex-direction: column;
					// 	justify-content: center;
					// 	align-items: center;
					// 	top: 50%;
					// 	right: 10rpx;
					// 	transform: translate(0, -50%);
					// }
				}
			}

		}

		.login-agree {
			font-size: 22rpx;
			height: 84rpx;
			width: 100%;
			word-wrap: break-word;
			word-break: normal;
			display: inline-flex;
			align-items: center;

			.login-agree-text {
				color: #4C81EF;
			}

			.u-radio-group {
				width: 100%;
				word-wrap: break-word;
				word-break: normal;
				display: block;
			}
		}
	}
</style>
