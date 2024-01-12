<template>
	<view class="container">
		<view class="login-wrap">
			<view class="login-item">
				<view class="login-phone-prefix">
					<text>{{checkPhonePrefix&&checkPhonePrefix.label?checkPhonePrefix.label:$t('app_select')}}</text>
				</view>
				<view class="iconfont laoyi-icon-shouji phone-icon">

				</view>
				<u-input class="login-input login-input1" v-model="phone" clearable
					:placeholder="$t('err_required_tel')" :customStyle="{height:84+'rpx'}" border>
				</u-input>
			</view>
			<view class="login-item">
				<u-input class="login-input login-input2" v-model="certCode" :placeholder="$t('err_required_cert_code')"
					:clearable="false" maxlength="4" type="number" :customStyle="{height:84+'rpx'}" border></u-input>
				<u-button size="mini" class="cert-btn" @click="handleCertCodeClick">{{certCodeTip}}</u-button>
				<u-verification-code ref="uCode" @end="handleCertCodeEnd" @start="handleCertCodeStart"
					@change="handleCertCodeChange" :start-text="certCodeStartText" :change-text="certCodeChangeText">
				</u-verification-code>
			</view>
			<view class="login-item">
				<view class="iconfont laoyi-icon-jiesuo password-icon">

				</view>
				<u-input class="login-input login-input3" v-model="password" type="password" clearable
					:placeholder="$t('err_required_pwd')" :customStyle="{height:84+'rpx'}" border>
				</u-input>
			</view>
			<view class="login-item">
				<view class="iconfont laoyi-icon-jiesuo password-icon">

				</view>
				<u-input class="login-input login-input3" v-model="confirmPassword" type="password" clearable
					:placeholder="$t('err_required_pwd')" :customStyle="{height:84+'rpx'}" border></u-input>
			</view>
			<view class="login-item">
				<u-button plain class="login-btn" @click="handleForget">{{$t('op_save')}}</u-button>
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
			return {pagetitle: 'op_forget_pwd',
				phone: '',
				certCode: '',
				certCodeTip: '',
				certCodeStartText: '',
				certCodeChangeText: '',
				password: '',
				confirmPassword: '',
				checkPhonePrefix: {
					label: '+60',
					value: '+60'
				},
			};
		},
		onLoad() {
			
		},
		onReady() {
			const that = this
			that.certCodeTip = that.$t('app_get_code')
			that.certCodeStartText = that.$t('app_get_code')
			that.certCodeChangeText = `x${that.$t('app_retry')}`
			uni.setNavigationBarTitle({
				title: that.$t('op_forget_pwd')
			})
		},
		methods: {
			toJSON(){},
			handleConfirmPhonePrefix(e) {
				this.checkPhonePrefix = e[0]
			},
			handleCertCodeStart() {},
			handleCertCodeEnd() {
				this.certCodeTip = this.$t('app_retry')
			},
			handleCertCodeChange(text) {
				this.certCodeTip = text
			},
			handleCertCodeClick() {
				const that = this
				if (!that.phone) {
					utils.showmessage(that.$t('err_required_tel'))
					return
				}
				if (!(that.phone.length == 9||that.phone.length == 10)) {
					utils.showmessage(that.$t('err_format_tel'))
					return
				}
				if (that.$refs.uCode.canGetCode) {
					let params = {
						certEvent: '2',
						tel: that.phone
					}
					user.getTelCertCode(params).then(res => {
						uni.showToast({
							title: that.$t('app_verification_code_sent')
						})
						that.$refs.uCode.start();
					}).catch(res => {
						if (res) {
							utils.showmessage(that.$t(res))
						}
					})
				}
			},
			handleForget() {
				const that = this
				if (!that.phone) {
					utils.showmessage(that.$t('err_required_tel'))
					return
				}
				if (!(that.phone.length == 9||that.phone.length == 10)) {
					utils.showmessage(that.$t('err_format_tel'))
					return
				}
				if (!that.certCode) {
					utils.showmessage(that.$t('err_required_cert_code'))
					return
				}
				if (!that.password) {
					utils.showmessage(that.$t('err_required_pwd'))
					return
				}
				if (!that.confirmPassword) {
					utils.showmessage(that.$t('err_required_pwd'))
					return
				}
				if (that.confirmPassword != that.password) {
					utils.showmessage(that.$t('err_required_pwd'))
					return
				}
				let params = {
					certCode: that.certCode,
					tel: that.phone,
					newPwd: md5.hex_md5_32(that.password)
				}
				user.forgetPwd(params).then(res => {
					console.log('handleForget', res)
					that.$store.dispatch('setUserStatusInfo', res?.data)
					utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
						uni.reLaunch({
							url: `/pages/login/login`
						})
					})
				}).catch(res => {
					if (res) {
						utils.showmessage(that.$t(res))
					}
				})

			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx 48rpx;

		.login-wrap {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100%;
			margin-top: 64rpx;

			.login-item {
				width: 100%;
				margin-top: 32rpx;
				padding: 0rpx 48rpx;
				display: inline-flex;
				justify-content: space-between;
				align-items: center;
				position: relative;

				.login-input {
					width: 100%;
					height: 84rpx;
				}

				.login-input1 {
					padding-left: 120rpx !important;
				}

				.login-input2 {
					padding-right: 84rpx !important;
				}

				.login-input3 {
					padding-left: 64rpx !important;
				}

				.phone-icon {
					position: absolute;
					left: 120rpx;
					font-size: 36rpx;
				}

				.password-icon {
					position: absolute;
					left: 64rpx;
					font-size: 36rpx;
				}

				.login-btn {
					width: 100%;
				}

				.login-phone-prefix {
					position: absolute;
					left: 48rpx;
					height: 64rpx;
					display: inline-flex;
					justify-content: center;
					align-items: center;
					padding: 0rpx 20rpx 0rpx 12rpx;
					border-radius: 8rpx;
				}

				.cert-btn {
					position: absolute;
					right: 50rpx;
					border-left: 3rpx solid $u-border-color;

					&:after {
						border: none;
					}
				}
			}
		}
	}
</style>
