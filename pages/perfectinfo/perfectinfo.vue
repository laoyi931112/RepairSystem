<template>
	<view class="container">
		<view class="info-wrap">
			<view class="info-item" style="border: none;justify-content: center;margin-top: 100rpx;">
				<r-upload :uploadtext="$t('app_choose_profile')" :maxcount="1" :value.sync="imgs"></r-upload>
			</view>
			<view class="info-item">
				<label class="info-label">{{$t('app_name')}}</label>
				<u-input class="info-input" :border="false" :placeholder="$t('app_enter_name')" clearable
					v-model="username" :customStyle="{height:84+'rpx'}"></u-input>
			</view>
			<!-- <view class="info-item">
				<text class="iconfont laoyi-icon-shouji info-icon"></text>
				<view class="info-phone-prefix">
					<text>{{checkPhonePrefix&&checkPhonePrefix.label?checkPhonePrefix.label:'请选择'}}</text>
					<view class="info-phone-prefix-icon">
						<u-icon name="arrow-up-fill"></u-icon>
						<u-icon name="arrow-down-fill"></u-icon>
					</view>
				</view>
				<u-select v-model="showPhonePrefix" :list="phonePrefixList" @confirm="handleConfirmPhonePrefix">
				</u-select>
				<u-input class="info-input info-input1" :border="true" placeholder="请输入联系电话" clearable v-model="phone">
				</u-input>
			</view> -->
			<view class="info-item">
				<label class="info-label">{{$t('field_email')}}</label>
				<u-input class="info-input" :border="false" :placeholder="$t('app_enter')+$t('field_email')" clearable
					v-model="email" :customStyle="{height:84+'rpx'}"></u-input>
			</view>
			<view class="info-item">
				<label class="info-label">{{$t('app_address')}}</label>
				<u-input class="info-input" :border="false" :placeholder="$t('app_enter')+$t('app_address')" clearable
					v-model="adress" :customStyle="{height:84+'rpx'}"></u-input>
			</view>
			<view class="info-item">
				<label class="info-label">{{$t('field_birthday')}}</label>
				<view @click="handleShowBirthday" class="info-input"
					:placeholder="$t('app_select')+$t('field_birthday')" :class="[checkDate?'':'placeholder-class']">
					{{checkDate?checkDate:$t('app_select')+$t('field_birthday')}}
				</view>
				<u-icon name="arrow-down-fill"></u-icon>
				<u-picker v-model="showBirthday" mode="time" :params="dateParams" @confirm="handleConfirmShowBirthday"
					confirm-text="confirm" cancel-text="cancel" :show-time-tag="false">
				</u-picker>
			</view>
			<view class="info-item"
				style="border: none;display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;">
				<label class="info-label">{{$t('field_gender')}}</label>
				<view class="info-sex-prefix">
					<u-button :type="checkSex=='1'?'primary':'default'" size="mini" class="info-sex"
						@click.stop="handleShowSex('1')">
						{{$t('enum_common_gender_male')}}
					</u-button>
					<u-button :type="checkSex=='0'?'primary':'default'" size="mini" class="info-sex"
						@click.stop="handleShowSex('0')">
						{{$t('enum_common_gender_female')}}
					</u-button>
				</view>
			</view>
			<view class="info-item" style="border: none;">
				<view class="info-btn" type="primary" @click.stop="handleConfirm">{{$t('app_confirm')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import common from '../../api/common.js'
	import user from '../../api/user.js'
	import utils from '../../utils/index.js';
	export default {
		data() {
			return {
				pagetitle: 'app_draft',
				showPhonePrefix: false,
				phonePrefixList: [{
					label: '+60',
					value: '+60'
				}],
				checkPhonePrefix: {
					label: '+60',
					value: '+60'
				},
				showBirthday: false,
				dateParams: {
					year: true,
					month: true,
					day: true,
				},
				checkDate: '',
				checkSex: '1',
				username: '', //用户名
				phone: '', //号码
				imgs: [], //头像
				email: '', //邮箱
				adress: '', //地址
				birthday: 0, //生日
				manimgs: require('../../static/head_man@2x.png'),
				womanimgs: require('../../static/head_woman@2x.png')
			};
		},
		watch: {
			imgs: function(val) {
				console.log('imgs', val)
			}
		},
		onLoad(options) {
			this.username = this.$store.state.userInfo.userName
			this.phone = this.$store.state.userInfo.userTel
			this.email = this.$store.state.userInfo.userEmail
			this.adress = this.$store.state.userInfo.userAddress
			if (this.$store.state.userInfo.userBirthday > 0) {
				let birthday = new Date(this.$store.state.userInfo.userBirthday)
				this.checkDate = `${birthday.getDate()}/${birthday.getMonth()}/${birthday.getFullYear()}`
			}
			this.birthday = this.$store.state.userInfo.userBirthday
			this.checkSex = this.$store.state.userInfo.userGender ? this.$store.state.userInfo.userGender : '1'
			this.imgs = this.$store.state.userInfo.profileImageUrl ? [this.$store.state.userInfo.profileImageUrl] : [this
				.checkSex == '1' ? this.manimgs : this.womanimgs
			]
		},
		onReady() {
			this.typelist = [{
				name: this.$t('def_warranty')
			}, {
				name: this.$t('app_maintenance_order')
			}]
			uni.setNavigationBarTitle({
				title: this.$t('app_personal_data')
			})
		},
		methods: {
			toJSON() {},
			handleShowPhonePrefix(e) {
				this.showPhonePrefix = !this.showPhonePrefix
			},
			handleConfirmPhonePrefix(e) {
				this.checkPhonePrefix = e[0]
			},
			handleShowBirthday() {
				this.showBirthday = !this.showBirthday
			},
			handleConfirmShowBirthday(e) {
				console.log('handleConfirmShowBirthday', e)
				this.checkDate = `${e.day}/${e.month}/${e.year}`
				this.birthday = new Date(e.year, e.month-1, e.day).getTime()
			},
			handleShowSex(val) {
				this.checkSex = val
			},
			handleConfirm() {
				console.log('handleConfirm');
				const that = this
				if (!that.username) {
					utils.showmessage(that.$t('err_required_user_name'))
					return
				}
				// if (!that.phone) {
				// 	utils.showmessage('请填写手机号码')
				// 	return
				// }
				let param = {
					profileImageUrl: that.imgs.join(','),
					userName: that.username,
					userAddress: that.adress,
					userBirthday: that.birthday,
					userEmail: that.email,
					userGender: that.checkSex,
				}
				if (param.profileImageUrl == that.manimgs || param.profileImageUrl == that.womanimgs) {
					param.profileImageUrl = ''
				}
				user.saveMyInfo(param).then(res => {
					utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
						that.$store.dispatch('setUserInfo',that)
						utils.navigateBack()
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

		.info-wrap {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			width: 100%;

			.info-item {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				width: 100%;
				margin-bottom: 20rpx;
				position: relative;
				border-bottom: 3rpx solid $u-border-color;

				.info-label {
					font-size: 30rpx;
					font-weight: bold;
				}

				.info-icon {
					font-size: 48rpx;
				}

				.info-input {
					flex: 1;
					margin-left: 24rpx;
					padding: 12rpx 0rpx;
				}

				.info-input1 {

					// #ifdef H5
					::v-deep .uni-input-wrapper {
						padding-left: 96rpx !important;
					}

					::v-deep .input-placeholder {
						padding-left: 96rpx !important;
					}

					// #endif
					// #ifdef MP-WEIXIN
					.u-input {
						padding-left: 96rpx !important;
					}

					// #endif
				}

				.info-btn {
					margin-top: 120rpx;
					width: 100%;
					height: 85rpx;
					background: linear-gradient(-45deg, #446FE0 0%, #548EEB 100%);
					border-radius: 18rpx;
					font-size: 36rpx;
					font-weight: bold;
					color:#fff;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.info-phone-prefix {
					display: inline-flex;
					align-items: center;
					position: absolute;
					top: 50%;
					transform: translate(0, -50%);
					left: 72rpx;
					z-index: 9;

					.info-phone-prefix-icon {
						display: flex;
						flex-direction: column;
						font-size: 18rpx;
						margin-left: 12rpx;
					}
				}

				.info-date {
					margin-left: 12rpx;
					border: 2rpx solid $u-border-color;
					flex: 1;
					border-radius: 6rpx;
					padding: 0rpx 20rpx;
					color: $u-light-color;
					min-height: 70rpx;
					display: inline-flex;
					align-items: center;
				}

				.info-sex-prefix {
					display: inline-flex;
					align-items: center;
					padding: 12rpx;

					.info-sex {
						margin-right: 18rpx;
						height: 54rpx;
						width: 84rpx;
					}
				}
			}
		}
	}
</style>