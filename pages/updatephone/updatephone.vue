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
				<u-input :border="true" :placeholder="$t('app_enter_verification_code')" clearable class="info-input" v-model="certCode"
					maxlength="4"></u-input>
				<u-button class="info-item u-line-1" style="max-width: 240rpx;" size="medium" @click="handleCertCodeClick">{{certCodeTip}}</u-button>
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
			return {pagetitle: 'app_modify_phone',
				phone: '',
				certCode: '',
				certCodeTip: '',
				certCodeStartText: '',
				certCodeChangeText: '',
				hasend: false,
			};
		},
		onLoad() {

		},
		onReady() {
			const that = this
			that.phone = that.$store.state.userInfo?.userTel
			that.certCodeTip = that.$t('app_get_code')
			that.certCodeStartText = that.$t('app_get_code')
			that.certCodeChangeText = `x s${that.$t('app_retry')}`
			uni.setNavigationBarTitle({
				title:that.$t('app_modify_phone')
			})
		},
		methods: {
			toJSON(){},
			toComfirmPhone() {
				if (this.hasend && this.certCode) {
					uni.navigateTo({
						url: `/pages/comfirmphone/comfirmphone`
					})
				}
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
				if (that.phone.length != 9) {
					utils.showmessage(that.$t('err_format_tel'))
					return
				}
				if (that.$refs.uCode.canGetCode) {
					let params = {
						certEvent: '4',
						tel: that.phone
					}
					that.hasend = true
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
