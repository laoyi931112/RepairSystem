<template>
	<view class="container">
		<view class="info-wrap">
			<view class="info-item" style="flex-direction: column;">
				<view class="info-desc">
					{{$t('app_current_phone')}}:
				</view>
				<view class="info-value">
					+60 {{phone}}
				</view>
			</view>
			<view class="info-item">
				<u-input v-model="certCode" :border="true" :placeholder="$t('err_required_cert_code')" clearable
					class="info-input"></u-input>
				<u-button class="info-certcodebtn" size="medium" @click="handleCertCodeClick">{{certCodeTip}}</u-button>
				<u-verification-code ref="uCode" @end="handleCertCodeEnd" @start="handleCertCodeStart"
					@change="handleCertCodeChange" :start-text="certCodeStartText" :change-text="certCodeChangeText">
				</u-verification-code>
			</view>
			<view class="info-item">
				<u-button class="info-btn" size="medium" @click="toComfirmPhone">{{$t('app_next_step')}}</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import user from '../../api/user.js'
	import utils from '../../utils/index.js'
	export default {
		data() {
			return {
				pagetitle: 'op_modify_pwd',
				certCode: '',
				certCodeTip: '',
				certCodeStartText: '',
				certCodeChangeText: '',
			};
		},
		computed: {
			phone: function() {
				return this.$store.state.userInfo?.userTel
			},
		},
		onLoad() {

		},
		onReady() {
			const that = this
			that.certCodeTip = that.$t('app_get_code')
			that.certCodeStartText = that.$t('app_get_code')
			that.certCodeChangeText = `x${that.$t('app_retry')}`
			uni.setNavigationBarTitle({
				title: that.$t('op_modify_pwd')
			})
		},
		methods: {
			toJSON() {},
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
						certEvent: '3',
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
			toComfirmPhone() {
				if (!this.certCode) return
				uni.navigateTo({
					url: `/pages/comfirmpassword/comfirmpassword?certCode=${this.certCode}`
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

				// padding-bottom: 24rpx;
				.info-value {
					padding: 18rpx 0rpx;
					font-size: 32rpx;
				}

				.info-input {
					margin-right: 12rpx;
					flex: 1;
				}

				.info-desc {
					padding-bottom: 16rpx;
					font-size: 28rpx;
				}

				.info-btn {
					margin: 300rpx auto 10rpx auto;
				}
			}
		}
	}
</style>