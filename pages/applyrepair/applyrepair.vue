<template>
	<view class="container">
		<view class="info-wrap">
			<view class="info-box">
				<view class="info-img">
			<!-- 		<u-image class="info-icon" :src="detail.productItemImagesUrl" :show-loading="true"
						:show-error="true" width="180" height="180">
					</u-image> -->
					<u-swiper class="info-icon" v-if="carousel.length>0" :list="carousel" height="180" mode="dot"
						indicator-pos="bottomCenter" border-radius="12" circular @click="handlePreviewImg">
					</u-swiper>
				</view>
				<view class="info-content">
					<view class="info-item" style="font-size: 30rpx;font-weight: 550;color: #333;" @click="toProductDetail(detail.productItemId)">
						{{detail.productItemName}}
					</view>
					<!-- <view class="info-item">
						{{$t('field_product_item_sn')}}：{{detail.productItemSn}}
					</view> -->
					<!-- 					<view class="info-item">
						九阳XXXX
					</view> -->
					<view class="info-item">
						{{$t('def_warranty')}}ID：{{detail.warrantyCode}}
					</view>
				<!-- 	<view class="info-item">
						{{$t('app_create_date')}}：{{detail.createTimeStr}}
					</view>
					<view class="info-item">
						{{$t('app_warranty_period')}}：{{detail.expDate}}
					</view> -->
				</view>
			</view>
			<!-- 			<view class="info-tip">
				保修期限：{{detail.expDate}}
			</view> -->
		</view>
		<view class="info-from">
			<view class="info-item" style="flex-direction: column;align-items: flex-start;justify-content: flex-start;">
				<view class="info-desc"
					style="font-size: 30rpx;font-weight: 550;border-left: 6rpx solid #4C81EF;padding-left: 16rpx;">
					{{$t('field_maintain_apply_problem_desc')}}
				</view>
				<view class="info-value" style="padding: 18rpx 0rpx;width: 100%;">
					<u-input class="info-input" style="width: 100%;" :placeholder="$t('app_enter_fault')" type="textarea" :border="true"
						v-model="problem">
					</u-input>
				</view>
			</view>
			<view class="info-item" style="flex-direction: column;align-items: flex-start;justify-content: flex-start;">
				<view class="info-desc"
					style="font-size: 30rpx;font-weight: 550;border-left: 6rpx solid #4C81EF;padding-left: 16rpx;">
					{{$t('app_add_fault_image')}}:
				</view>
				<view class="info-value" style="padding: 18rpx 0rpx;width: 100%;">
					<r-upload :maxcount="1" :value.sync="imgs" :width="120" :height="120"></r-upload>
				</view>
			</view>
			<view class="info-item" style="flex-direction: column;align-items: flex-start;justify-content: flex-start;" v-if="false">
				<view class="info-desc"
					style="font-size: 30rpx;font-weight: 550;border-left: 6rpx solid #4C81EF;padding-left: 16rpx;">
					{{$t('app_nearby_maintenance_company')}}:
				</view>
				<!-- <view class="info-value" style="padding: 18rpx 0rpx;width: 100%;">
					<u-input class="info-input" style="width: 100%;" :placeholder="$t('app_enter_fault')" type="text" :border="true"
						v-model="tenantdetail.compName" :disabled="true" @click="toCheckTenant">
					</u-input>
				</view> -->
					<view v-if="tenantdetail&&tenantdetail.compName">{{$t('def_maintain')}}：{{tenantdetail.compName}}</view>
				<view class="info-link" @click="toCheckTenant">
					{{$t('app_view_nearby_service')}}
				</view>
			</view>
			<view class="info-item" style="flex-direction: column;padding-top: 48rpx;">
				<u-button @click="saveRepair" class="info-btn">{{$t('app_save_as_draft')}}</u-button>
				<u-button class="info-btn" type="primary" @click="handleApplyClick">{{$t('app_confirm')}}</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils';
	import wty from '../../api/wty.js'
	export default {
		data() {
			return {pagetitle: 'app_new_maintain',
				detail: {}, //详情
				problem: '',
				imgs: [],
				tenantdetail: {},
				carousel:[]
			};
		},
		onLoad(options) {
			if (options.id) {
				this.detail =uni.getStorageSync(`abc${options.id}`)
				this.detail.expDate = new Date(this.detail.expDate).Format('dd/MM/yyyy')
				this.detail.purDate = new Date(this.detail.purDate).Format('dd/MM/yyyy')
				this.detail.createTimeStr=new Date(this.detail.createTimeStr).Format('dd/MM/yyyy')
				this.detail.productItemImagesUrls?.forEach(item=>{
					this.carousel.push({
						image: item,
						title: '',
						data: '',
					})
				})
				this.problem = this.detail?.problemDesc
				this.imgs = this.detail?.problemImagesUrl?.split(',')
				console.log('detail', this.detail,this.carousel,this.imgs)
			}
			if (options.tenantdetail) {
				this.tenantdetail = JSON.parse(options.tenantdetail)
			}
		},
		onShow() {
			console.log('tenantdetail', this.tenantdetail)
		},
		onReady() {
			uni.setNavigationBarTitle({
				title:this.$t('app_new_maintain')
			})
		},
		methods: {
			toJSON() {},
			handlePreviewImg(index) {
				let urls = []
				this.carousel?.forEach(item => {
					urls.push(item?.image)
				})
				uni.previewImage({
					current: index,
					urls: urls
				})
			},
			setTenantDetail(detail){
				this.tenantdetail = detail
			},
			saveRepair() {
				const that = this
				if (!that.problem) {
					utils.showmessage(that.$t('err_required_problem_desc'))
					return
				}
				if (that.imgs.length == 0) {
					utils.showmessage(that.$t('app_upload_image'))
					return
				}
				let _data = {
					problemDesc: that.problem,
					problemImagesUrl: that.imgs.join(','),
					submit: false,
					warrantyId: that.detail.id
				}
				wty.saveMaintainApply(_data).then(res => {
					console.log('saveMaintainApply', res)
					utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
						uni.redirectTo({
							url: '/pages/repairlog/repairlog?key=w'
						})
					})
				}).catch(res => {
					console.error(res)
					if (res) {
						utils.showmessage(that.$t(res))
					}
				})
			},
			handleApplyClick() {
				const that = this
				if (!that.problem) {
					utils.showmessage(that.$t('err_required_problem_desc'))
					return
				}
				if (that.imgs.length == 0) {
					utils.showmessage(that.$t('app_upload_image'))
					return
				}
				// if (!that.tenantdetail || !that.tenantdetail.id) {
				// 	utils.showmessage('请选择维修商')
				// 	return
				// }
				let _data = {
					problemDesc: that.problem,
					problemImagesUrl: that.imgs.join(','),
					submit: true,
					warrantyId: that.detail.id
				}
				wty.submitMaintainApply(_data).then(res => {
					console.log('submitMaintainApply', res)
					utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
						uni.redirectTo({
							url: '/pages/repairlog/repairlog?key=w'
						})
					})
				}).catch(res => {
					console.error(res)
					if (res) {
						utils.showmessage(that.$t(res))
					}
				})
			},
			toCheckTenant() {
				uni.navigateTo({
					url: `/pages/checktenant/checktenant`
				})
			},
			toProductDetail(id) {
				uni.navigateTo({
					url: `/pages/productdetail/productdetail?id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		background-color: $uni-bg-color;

		.info-wrap {
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 24rpx;

			.info-box {
				width: 100%;
				display: inline-flex;

				.info-img {
					width: 180rpx;
					height: 180rpx;
					display: inline-flex;
					justify-content: center;
					align-items: center;
					flex-shrink: 0;

					.info-icon {
						width: 180rpx;
						height: 180rpx;
						display: inline-flex;
						justify-content: center;
						align-items: center;
						::v-deep .uni-swiper-wrapper{
							width: 180rpx;
						}
					}
				}

				.info-content {
					flex: 1;
					display: flex;
					flex-direction: column;
					padding: 0rpx 24rpx;

					.info-item {
						display: flex;
						width: 100%;
						padding-bottom: 12rpx;
						font-size: 26rpx;
					}
				}
			}

			.info-tip {
				width: 100%;
				padding: 12rpx 0rpx;
			}
		}

		.info-from {
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 24rpx;

			.info-item {
				width: 100%;
				display: flex;
				flex-direction: row;
				padding-bottom: 24rpx;

				.info-desc {
					padding-right: 12rpx;
				}

				.info-value {
					flex: 1;

					.info-input {
						width: 100%;
					}
				}

				.info-link {
					border: 2rpx solid $u-border-color;
					padding: 12rpx;
				}

				.info-btn {
					margin: 12rpx 100rpx;
					border-radius: 24rpx;
				}
			}
		}
	}
</style>
