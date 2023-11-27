<template>
	<view class="container">
		<u-tabs class="type-box" :list="typelist" :is-scroll="false" :current="current" @change="handlechange"></u-tabs>
		<view class="info-wrap">
			<view class="info-item" v-for="(item,index) in repairlist" :key="item.id" @tap.stop="todetails(item)">
				<view class="info-img">
					<u-image class="info-icon" :src="item.productItemImagesUrls[0]" :show-loading="true"
						:show-error="true" width="160" height="160">
					</u-image>
				</view>
				<view class="info-content">
					<view class="info-text info-title">
						{{item.productItemName}}
					</view>
					<view class="info-text">
						{{$t('def_warranty')}}ID：{{item.warrantyCode?item.warrantyCode:''}}
					</view>
					<view class="info-text">
						{{current==1?$t('app_warranty_period'):$t('app_purchasing_date')}}：{{item.expDateStr}}
					</view>
					<view class="info-text">
						{{current==1?$t('app_complete_date'):$t('app_save_date')}}：{{item.maintainTimeStr}}
					</view>
					<view class="info-text">
						{{current==1?$t('app_maintenance_company'):$t('def_brand')}}：{{current==1?item.distributorCompName:item.brandCompName}}
					</view>
				</view>
				<u-button size="mini" class="info-detail-btn" v-if="current==1" @tap.stop="toDetail(item)">
					{{$t('app_view')}}
				</u-button>
				<!-- <u-button size="mini" class="info-detail-btn" v-if="current==0">{{item.warrantyStatusDesc}}</u-button> -->
			</view>
		</view>
	</view>
</template>

<script>
	import wty from '../../api/wty.js'
	export default {
		data() {
			return {pagetitle: 'app_draft',
				pageNumber: 1,
				pageSize: 10,
				repairlist: [], //维修单
				current: 1,
				typelist: []
			};
		},
		onLoad(options) {
			this.pageNumber = 1
			this.repairlist = []
			this.pageQuery()
		},
		onShow() {

		},
		onReady() {
			this.typelist = [{
				name: this.$t('def_warranty')
			}, {
				name: this.$t('app_maintenance_order')
			}]
			uni.setNavigationBarTitle({
				title: this.$t('app_draft')
			})
		},
		onPullDownRefresh() {
			this.pageNumber = 1
			this.repairlist = []
			this.pageQuery()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500)
		},
		onReachBottom() {
			this.pageNumber += 1
			this.pageQuery()
		},
		methods: {
			toJSON() {},
			handlechange(index) {
				this.current = index
			},
			pageQuery() {
				if (this.current == 1) {
					this.pageQueryMaintainApply()
				} else {
					this.pageQueryWarranty()
				}
			},
			pageQueryWarranty() {
				const that = this
				let _data = {
					pageNumber: that.pageNumber,
					pageSize: that.pageSize,
					warrantyStatusEQ: 0
				}
				wty.pageQueryWarranty(_data).then(res => {
					console.log('pageQueryWarranty', res)
					res?.pageResult?.list?.forEach(item => {
						item.createTimeStr = new Date(item.createTime).Format('dd/MM/yyyy hh:mm')
						item.expDateStr = new Date(item.purDate).Format('dd/MM/yyyy hh:mm')
						item.maintainTimeStr = new Date(item.saveTime).Format('dd/MM/yyyy hh:mm')
						item.warrantyStatusKey = that.$store.state.enums?.ApplyStatusEnum?.find(t => t
							.value == item.warrantyStatus)?.textCode
						item.warrantyStatusDesc = that.$t('enum_common_apply_status_create')
						item.productItemImagesUrls = item.productItemImagesUrl?.split(',')
						if (!item.productItemImagesUrls || item.productItemImagesUrls?.length == 0) {
							item.productItemImagesUrls = ['']
						}
						if (item.warrantyStatusKey) {
							item.warrantyStatusDesc = that.$t(item.warrantyStatusKey)
						}
						that.repairlist.push(item)
					})
				})
			},
			pageQueryMaintainApply() {
				const that = this
				let _data = {
					pageNumber: that.pageNumber,
					pageSize: that.pageSize,
					warrantyStatusEQ: 0
				}
				wty.pageQueryMaintainApply(_data).then(res => {
					console.log('pageQueryMaintainApply', res)
					res?.pageResult?.list?.forEach(item => {
						item.createTimeStr = new Date(item.createTime).Format('dd/MM/yyyy hh:mm')
						item.expDateStr = new Date(item.expDate).Format('dd/MM/yyyy hh:mm')
						item.maintainTimeStr = new Date(item.maintainTime).Format('dd/MM/yyyy hh:mm')
						item.warrantyStatusKey = that.$store.state.enums?.ApplyStatusEnum?.find(t => t
							.value == item.warrantyStatus)?.textCode
						item.warrantyStatusDesc = that.$t('enum_common_apply_status_create')
						item.productItemImagesUrls = item.productItemImagesUrl?.split(',')
						if (!item.productItemImagesUrls || item.productItemImagesUrls?.length == 0) {
							item.productItemImagesUrls = ['']
						}
						if (item.warrantyStatusKey) {
							item.warrantyStatusDesc = that.$t(item.warrantyStatusKey)
						}
						that.repairlist.push(item)
					})
				})
			},
			toDetail(item) {
				if (this.current == 0) {
					uni.navigateTo({
						url: `/pages/tenantdetail/tenantdetail?id=${item.distributorCompId}`
					})
				}else {
					uni.setStorageSync(`abc${item.id}`, item)
					uni.navigateTo({
						url: `/pages/applyrepairdetail/applyrepairdetail?id=${item.id}`
					})
				}

			},
			todetails(item) {
				if (this.current == 0) {
					uni.navigateTo({
						url: `/pages/repairdetail/repairdetail?obj=${JSON.stringify(item)}`
					})
				} else {
					uni.setStorageSync(`abc${item.id}`, item)
					uni.navigateTo({
						url: `/pages/applyrepairdetail/applyrepairdetail?id=${item.id}`
					})
				}
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
		justify-content: flex-start;
		align-items: center;
		background-color: $u-bg-color;
		padding-top: 84rpx;

		.type-box {
			width: 100%;
			position: fixed;
			left: 0rpx;
			top: 0rpx;
		}

		.info-wrap {
			width: 100%;
			padding: 24rpx;

			.info-item {
				width: 100%;
				display: inline-flex;
				align-items: center;
				background-color: $uni-bg-color;
				border-radius: 10rpx;
				padding: 48rpx 24rpx 24rpx 24rpx;
				margin-bottom: 24rpx;
				position: relative;

				.info-img {
					width: 160rpx;
					height: 160rpx;
					flex-shrink: 0;
					display: inline-flex;
					justify-content: center;
					align-items: center;

					.info-icon {
						width: 160rpx;
						height: 160rpx;
						display: inline-flex;
						justify-content: center;
						align-items: center;
					}
				}

				.info-content {
					flex: 1;
					display: flex;
					flex-direction: column;
					height: 100%;
					justify-content: flex-start;
					padding: 0rpx 0rpx 0rpx 24rpx;

					.info-text {
						width: 100%;
						padding-bottom: 12rpx;
						font-size: 26rpx;
						color: #808080;
					}

					.info-title {
						font-size: 30rpx;
						font-weight: 550;
						color: #000;
					}
				}

				.info-detail-btn {
					position: absolute;
					right: 10rpx;
					top: 10rpx;

					&>button {
						border-radius: 24rpx !important;
						color: #4C81EF !important;
						border: 2rpx solid #4C81EF !important;
						font-size: 24rpx !important;
					}
				}
			}
		}
	}
</style>
