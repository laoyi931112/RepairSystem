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
					<view @click="handleShowDate" class="info-input" :class="[checkDate?'':'placeholder-class']">
						{{checkDate?checkDate:$t('app_select_date')}}</view>
				</view>
				<u-picker v-model="showDate" mode="time" :params="dateParams" @confirm="handleConfirmDate"
					confirm-text="confirm" cancel-text="cancel" :show-time-tag="false">
				</u-picker>
			</view>
			<view class="info-item">
				<view class="info-desc">
					{{$t('app_distributor')}}<text style="color: red;">*</text>
				</view>
				<view class="info-value">
					<u-input class="info-input" v-model="keyword" @blur="handleFocus"
						:placeholder="$t('app_enter_distributor_code')"></u-input>
					<view class="info-compname" v-if="compinfo.compName"
						:style="{color:compinfo.compName&&compinfo.id==''?'red':'unset'}">{{compinfo.compName}}</view>
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
				<!-- 				<u-button type="primary" @click="saveRepairClick"
					:disabled="compinfo.id==''||buydate==0||imgs.length==0||!remark" class="info-btn">{{$t('op_save')}}
				</u-button> -->
				<u-button type="primary" @click="toComfirmRepair" :data-id="compinfo.id" :data-buydate="buydate"
					:data-imglength="imgs.length" :disabled="compinfo.id==''||buydate==0||imgs.length==0"
					class="info-btn">{{$t('app_next_step')}}
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
				pagetitle: '',
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
				compinfo: {
					compName: '',
					compType: '',
					id: '',
				}, //分销商
				infoTitle: '',
				keyword: '',
				remark: ''
			};
		},
		onLoad(options) {
			console.log(this.compinfo.id == '' || this.buydate == 0 || this.imgs.length == 0 || !this.remark)
			if (options.obj) {
				this.obj = JSON.parse(options.obj)
				this.id = this.obj?.id
				this.compinfo.id = this.obj?.distributorCompId
				this.compinfo.compName = this.obj?.distributorCompName
				this.imgs = this.obj?.warrantyImagesUrl?.split(',')
				this.keyword = this.obj?.distributorCompId
				this.buydate = this.obj?.purDate
				this.remark = this.obj?.warrantyRemark
				this.checkDate = new Date(this.obj?.purDate).Format('dd/MM/yyyy')
			}
		},
		onHide() {

		},
		onReady() {
			// this.infoTitle = this.$t('app_new_warranty')
		},
		onShow() {
			// if(this.$store.state.tempobj){
			// 	this.obj=JSON.parse(this.$store.state.tempobj) 
			// 	this.id=this.obj?.id
			// 	this.compinfo.id=this.obj?.distributorCompId
			// 	this.compinfo.compName=this.obj?.distributorCompName
			// 	this.imgs=this.obj?.warrantyImagesUrl?.split(',')
			// 	this.keyword=this.obj?.distributorCompId
			// 	this.buydate=this.obj?.purDate
			// 	this.checkDate=new Date(this.obj?.purDate).Format('dd/MM/yyyy')
			// 	this.$store.state.tempobj=''
			// }
		},
		onTabItemTap(e) {
			this.handleClearClick()
		},
		methods: {
			toJSON() {},
			handleClearClick() {
				this.obj = {}
				this.id = ''
				this.compinfo = {
					compName: '',
					compType: '',
					id: ''
				}
				this.buydate = 0
				this.imgs = []
				this.checkDate = ''
				this.keyword = ''
			},
			handleShowDate() {
				this.showDate = !this.showDate
			},
			handleConfirmDate(e) {
				this.checkDate =
					`${e.day}/${e.month}/${e.year}`
				this.buydate = new Date(e.year, e.month, e.day).getTime()
			},
			toComfirmRepair() {
				const that = this
				if (that.compinfo.id == '' || that.buydate == 0 || that.imgs.length == 0) return
				let obj = {
					id: that.id,
					detail: that.obj,
					buydate: that.buydate,
					imgs: that.imgs,
					compinfo: that.compinfo,
					remark: that.remark
				}
				uni.navigateTo({
					url: `/pages/comfirmrepair/comfirmrepair?obj=${JSON.stringify(obj)}`,
					success() {
						that.handleClearClick()
					}
				})
			},
			handleFocus(val) {
				console.log('handleFocus', val)
				if (!val) return
				this.getDistributorComp(val)
			},
			getDistributorComp(id) {
				const that = this
				let _data = {}
				if (id) {
					_data.compCodeEQ = id
				}
				// _data.compCodeEQ = 'D00001'
				crm.getDistributorComp(_data).then(res => {
					console.log('getDistributorComp', res, res.data)
					if (res?.data) {
						that.compinfo = res?.data
					} else {
						//utils.showmessage(that.$t('err_non_exist_distributor'))
						that.compinfo.compName = that.$t('err_non_exist_distributor')
					}
				})
			},
			saveRepairClick() {
				const that = this
				if (that.compinfo.id == '' || that.buydate == 0 || that.imgs.length == 0 || !that.remark) return
				let _data = {
					warrantyImagesUrl: that.imgs?.join(','),
					distributorCompId: that.compinfo?.id,
					purDate: that.buydate,
					warrantyRemark: that.remark
				}
				if (that.id) {
					_data.id = that.id
				}
				wty.saveWarrantyOnline(_data).then(res => {
					console.log('saveWarrantyOnline', res)
					if (res.resultCode == 200) {
						utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
							uni.navigateBack()
						})
					}
				}).catch(res => {
					utils.showmessage(that.$t(res) || that.$t('app_server_error'))
				})
			},
			saveRepair() {
				const that = this
				console.log('that.imgs', that.imgs)
				if (that.imgs.length == 0) return
				let _data = {
					warrantyImagesUrl: that.imgs?.join(',')
				}
				if (that.compinfo?.id) {
					_data.distributorCompId = that.compinfo?.id
				}
				if (that.buydate) {
					_data.purDate = that.buydate
				}
				if (that.id) {
					_data.id = that.id
				}
				wty.saveWarranty(_data).then(res => {
					console.log('saveWarranty', res)
					if (res.resultCode == 200) {
						utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
							that.handleClearClick()
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
					margin-top: 300rpx;
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