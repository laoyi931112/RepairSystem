<template>
	<view class="container">
		<view class="info-wrap">
			<view class="info-item">
				<view class="info-phone-prefix">
					<text>{{checkPhonePrefix&&checkPhonePrefix.label?checkPhonePrefix.label:$t('Please_select')}}</text>
					<view class="info-phone-prefix-icon">
						<u-icon name="arrow-down"></u-icon>
					</view>
				</view>
				<u-field icon="phone" label-width="0" class="info-input info-input1" v-model="phone" :placeholder="$t('app_enter_new_phone_number')"
						right-icon="arrow-down-fill"
						>
						</u-field>
				<!-- <u-input :border="true" placeholder="请输入新手机号" clearable class="info-input info-input1" v-model="phone" height="84"></u-input> -->
			</view>
			<view class="info-item" style="margin-bottom: 24rpx;">
				<u-input :border="true" :placeholder="$t('app_enter_verification_code')" clearable class="info-input" v-model="certCode" height="84"></u-input>
				<u-button class="info-item-btn" @click="handleCertCodeClick">{{certCodeTip}}</u-button>
				<u-verification-code ref="uCode" @end="handleCertCodeEnd" @start="handleCertCodeStart"
					@change="handleCertCodeChange" :start-text="certCodeStartText" :change-text="certCodeChangeText">
				</u-verification-code>
			</view>
			<view class="info-item">
				<u-button class="info-btn" @click="handleUpdatePhone">{{$t('app_confirm')}}</u-button>
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
				showPhonePrefix: false,
				phonePrefixList: [ {
					label: '+60',
					value: '+60'
				}],
				checkPhonePrefix: {
					label: '+60',
					value: '+60'
				},
				phone:'',
				certCode: '',
				certCodeTip: '',
				certCodeStartText: '',
				certCodeChangeText: '',
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
				title: that.$t('app_modify_phone')
			})
		},
		methods: {
			toJSON(){},
			handleShowPhonePrefix(e) {
				this.showPhonePrefix = !this.showPhonePrefix
			},
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
				if (that.phone.length != 9) {
					utils.showmessage(that.$t('err_format_tel'))
					return
				}
				if (that.$refs.uCode.canGetCode) {
					let params = {
						certEvent: '4',
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
			handleUpdatePhone(){
				const that=this
				if (!that.phone) {
					utils.showmessage(that.$t('err_required_tel'))
					return
				}
				if (that.phone.length != 9) {
					utils.showmessage(that.$t('err_format_tel'))
					return
				}
				if(!that.certCode){
					utils.showmessage(that.$t('err_required_cert_code'))
					return
				}
				let params = {
					certCode: that.certCode,
					tel: that.phone
				}
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
			padding: 85rpx;
			background-color: $uni-bg-color;

			.info-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 84rpx;
				margin-bottom: 24rpx;
.info-item-btn{
	height: 84rpx;
}
				.info-input {
					margin-right: 12rpx;
					flex: 1;
					height: 84rpx;
				}

				.info-input1 {
					margin-right: 0rpx;
					margin-left: 14rpx;
					border: 2rpx solid $u-border-color;
					::v-deep .uicon-arrow-down-fill{
						display: none;
					}
				}

				.info-desc {
					padding-bottom: 16rpx;
				}

				.info-btn {
					margin: 300rpx auto 32rpx auto;
					width: 320rpx;
				}

				.info-phone-prefix {
					display: inline-flex;
					align-items: center;
					min-height: 84rpx;
					z-index: 9;
					border: 2rpx solid $u-border-color;
					padding: 0rpx 12rpx;

					.info-phone-prefix-icon {
						display: flex;
						flex-direction: column;
						padding-left: 12rpx;
						font-size: 20rpx;
					}
				}
			}
		}
	}
</style>
