<template>
	<view class="container">
		<u-navbar v-if="showNav==true" :title="$t('app_new_warranty')" :background="{backgroundColor:'#4C81EF'}" title-color="#fff"
			back-icon-color="#fff">
			<template v-slot:right>
				<view class="navbar-icon" @click="handleClearClick">
					{{$t('app_clear')}}
				</view>
			</template>
		</u-navbar>
		<view class="info-wrap">
			<view class="info-item">
				<view class="info-desc">
					{{$t('field_product_item_name')}}<text style="color: red;">*</text>
				</view>
				<view class="info-value">
					<u-input v-model="productname" :placeholder="$t('err_required_item_name')" />
				</view>
			</view>
			<view class="info-item" style="flex-direction: column;border-bottom: none;align-items: flex-start;">
				<view class="info-desc" style="padding-bottom: 24rpx;">
					{{$t('app_add_warranty_image_tips')}}:<text style="color: red;">*</text>
				</view>
				<view class="info-value">
					<r-upload :maxcount="3" :value.sync="imgs" :width="120" :height="120"></r-upload>
				</view>
			</view>
			<view class="info-item">
				<view class="info-desc">
					{{$t('app_purchasing_date')}}<text style="color: red;">*</text>
				</view>
				<view class="info-value">
					<view @click="handleShowDate" :placeholder="$t('app_select_date')"
						class="info-input" :class="[checkDate?'':'placeholder-class']">{{checkDate?checkDate:$t('app_select_date')}}</view>
				</view>
				<u-picker v-model="showDate" mode="time" :params="dateParams" @confirm="handleConfirmDate"
					confirm-text="confirm" cancel-text="cancel" :show-time-tag="false" :endTime="endTime" :default-time="endTime">
				</u-picker>
			</view>
			<view class="info-item">
				<view class="info-desc">
					{{$t('field_product_item_warranty_period')}}<text style="color: red;">*</text>
				</view>
				<view class="info-value">
					<u-input :placeholder="$t('err_required_warranty_period')" clearable v-model="periodDate"
						class="info-input" type="number"></u-input>
				</view>
			</view>
			<view class="info-item" style="flex-direction: column;border-bottom: none;align-items: flex-start;">
				<view class="info-desc" style="padding-bottom: 24rpx;">
					{{$t('field_product_item_image')}}:<text style="color: red;">*</text>
				</view>
				<view class="info-value">
					<r-upload :maxcount="3" :value.sync="pimgs" :width="120" :height="120"></r-upload>
				</view>
			</view>
			<view class="info-item">
				<view class="info-desc">
				</view>
				<view class="info-value">
					<u-input v-model="remark" type="textarea" :placeholder="$t('field_remark')" />
				</view>
			</view>
			<view class="info-item" style="border-bottom: none;gap:28rpx;">
				<u-button type="primary" @click="saveRepairClick"
					:disabled="buydate==0||imgs.length==0||pimgs.length==0||!remark||!productname||!periodDate"
					class="info-btn">{{$t('op_save')}}
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import crm from '../../api/crm.js'
	import wty from '../../api/wty.js'
	import utils from '../../utils/index.js';
	export default {
		props: {
			showNav:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				pagetitle: 'app_new_warranty',
				id: '',
				obj: {},
				checkDate: '',
				showDate: false,
				dateParams: {
					year: true,
					month: true,
					day: true,
				},
				buydate: 0, //购买日期
				imgs: [],
				pimgs: [],
				productname: '',
				infoTitle: '',
				keyword: '',
				remark: '',
				periodDate: '',
				endTime: new Date().Format('yyyy/MM/dd')
			};
		},
		onLoad(options) {
			if (options.obj) {
				this.obj = JSON.parse(options.obj)
				this.id = this.obj?.id
				this.imgs = this.obj?.warrantyImagesUrl?.split(',')
				this.pimgs = this.obj?.customProductItemImagesUrl?.split(',')
				this.keyword = this.obj?.distributorCompId
				this.buydate = this.obj?.purDate
				this.remark = this.obj?.warrantyRemark
				this.periodDate = this.obj?.customWarrantyPeriod
				this.productname = this.obj?.customProductItemName
				this.checkDate = new Date(this.obj?.purDate).Format('dd/MM/yyyy')
			}
		},
		onHide() {

		},
		onReady() {
			// this.infoTitle = this.$t('app_new_warranty')
		},
		onShow() {},
		methods: {
			toJSON() {},
			handleClearClick() {
				this.obj = {}
				this.id = ''
				this.buydate = 0
				this.imgs = []
				this.pimgs = []
				this.checkDate = ''
				this.periodDate = ''
				this.keyword = ''
				this.productname = ''
			},
			handleShowDate() {
				console.log('handleShowDate');
				this.showDate = !this.showDate
			},
			handleConfirmDate(e) {
				this.checkDate =
					`${e.day}/${e.month}/${e.year}`
				this.buydate = new Date(e.year, e.month-1, e.day).getTime()
			},
			saveRepairClick() {
				const that = this
				if (that.buydate == 0 || that.imgs.length == 0 || that.pimgs.length == 0 || !that.remark || !that
					.periodDate || !that.productname) return
				let _data = {
					warrantyImagesUrl: that.imgs?.join(','),
					customProductItemImagesUrl: that.pimgs?.join(','),
					customProductItemName: that.productname,
					purDate: that.buydate,
					customWarrantyPeriod: that.periodDate,
					warrantyRemark: that.remark
				}
				if (that.id) {
					_data.id = that.id
				}
				wty.saveWarrantyOffline(_data).then(res => {
					console.log('saveWarrantyOffline', res)
					if (res.resultCode == 200) {
						utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
							//uni.navigateBack()
							uni.switchTab({
								url: '/pages/index/index'
							})
						})
					}
				}).catch(res => {
					utils.showmessage(that.$t(res) || that.$t('app_server_error'))
				})
			},

		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0rpx 48rpx 32rpx 48rpx;

		.navbar-icon {
			padding: 0rpx 32rpx;
			color: #fff;
		}

		.info-wrap {
			width: 100%;
			margin-top: 24rpx;

			.info-item {
				display: inline-flex;
				align-items: center;
				width: 100%;
				border-bottom: 2rpx solid $u-border-color;
				margin-bottom: 24rpx;

				.info-desc {
					padding-right: 24rpx;
					font-size: 30rpx;
					color: #333;
				}

				.info-value {
					flex: 1;
					position: relative;

					.info-input {
						width: 100%;
						font-size: 28rpx;
						padding: 12rpx 0rpx;
					}

					.info-compname {
						position: absolute;
					}
				}

				.info-btn {
					margin-top: 32rpx;
					width: 313rpx;
					// background-color: #4C81EF !important;
					// color: #fff !important;
					border-radius: 24rpx;

					// &:first-child {
					// 	padding-right: 32rpx;
					// }
				}
			}
		}
	}
</style>