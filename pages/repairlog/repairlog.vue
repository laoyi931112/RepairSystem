<template>
	<view class="container">
		<view class="info-wrap">
			<view class="info-item" v-for="(item,index) in repairlist" :key="item.id" @click="toDetail(item)">
				<view class="info-img">
					<u-image class="info-icon" @click="handleImageClick(item.productItemImagesUrls[0])"
						:src="item.productItemImagesUrls[0]" :show-loading="true" :show-error="true" width="160"
						height="160">
					</u-image>
				</view>
				<view class="info-content">
					<view class="info-text info-title u-line-1" @click="toProductDetail(item.productItemId)">
						{{item.productItemName}}
					</view>
					<view class="info-text u-line-1">
						{{$t('def_warranty')}}ID：{{item.warrantyCode?item.warrantyCode:''}}
					</view>
					<view class="info-text">
						{{key=='w'?$t('app_warranty_period'):$t('app_purchasing_date')}}：{{item.expDateStr}}
					</view>
					<view class="info-text">
						{{key=='w'?$t('app_complete_date'):$t('app_save_date')}}：{{item.maintainTimeStr}}
					</view>
					<view class="info-text">
						{{key=='w'?$t('app_maintenance_company'):$t('def_brand')}}：{{key=='w'?item.distributorCompName:item.brandCompName}}
					</view>
					<view class="data-status">
						{{getstatus(item)}}
					</view>
				</view>
				<!-- 	<u-button size="mini" class="info-detail-btn" v-if="key=='w'" @click="toDetail(item)">{{$t('app_view')}}
				</u-button>
				<u-button size="mini" class="info-detail-btn" v-if="key=='b'">{{item.warrantyStatusDesc}}</u-button> -->
			</view>
		</view>
	</view>
</template>

<script>
	import wty from '../../api/wty.js'
	export default {
		data() {
			return {
				pagetitle: 'app_maintain_records',
				key: 'b',
				pageNumber: 1,
				pageSize: 10,
				repairlist: [], //维修单
			};
		},
		onLoad(options) {
			this.key = options.key
			this.pageNumber = 1
			this.repairlist = []
			this.pageQuery()
		},
		onShow() {

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
		onReady() {
			const that = this
			uni.setNavigationBarTitle({
				title: that.$t('app_maintain_records')
			})
		},
		methods: {
			toJSON() {},
			handleImageClick(url) {
				uni.previewImage({
					current: 0,
					urls: [url]
				})
			},
			pageQuery() {
				if (this.key == 'w') {
					this.pageQueryMaintainApply()
				} else {
					this.pageQueryWarranty()
				}
			},
			pageQueryWarranty() {
				const that = this
				let _data = {
					pageNumber: that.pageNumber,
					pageSize: that.pageSize
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
					pageSize: that.pageSize
				}
				wty.pageQueryMaintainApply(_data).then(res => {
					console.log('pageQueryMaintainApply', res)
					res?.pageResult?.list?.forEach(item => {
						item.createTimeStr = new Date(item.createTime).Format('dd/MM/yyyy')
						item.expDateStr = new Date(item.expDate).Format('dd/MM/yyyy')
						item.maintainTimeStr = item.maintainTime ? new Date(item.maintainTime).Format(
							'dd/MM/yyyy') : ''
						item.warrantyStatusKey = that.$store.state.enums?.ApplyStatusEnum?.find(t => t
							.value == item.warrantyStatus)?.textCode
						item.warrantyStatusDesc = that.$t('enum_common_apply_status_create')
						item.productItemImagesUrls = item.productItemImagesUrl?.split(',')
						if (item.warrantyStatusKey) {
							item.warrantyStatusDesc = that.$t(item.warrantyStatusKey)
						}
						that.repairlist.push(item)
					})
				})
			},
			toDetail(obj) {
				if (obj?.applyStatus == '0') {
					uni.setStorageSync(`abc${obj.id}`, obj)
					uni.navigateTo({
						url: `/pages/applyrepair/applyrepair?id=${obj.id}`
					})
				} else {
					uni.setStorageSync(`abc${obj.id}`, obj)
					uni.navigateTo({
						url: `/pages/applyrepairdetail/applyrepairdetail?id=${obj.id}`
					})
				}

			},
			toProductDetail(id) {
				uni.navigateTo({
					url: `/pages/productdetail/productdetail?id=${id}`
				})
			},
			getstatus(item) {
				if (item?.warrantyType == '0') {
					return this.$t('app_offline')
				} else if (item?.warrantyType == '1' && item?.warrantyStatus == '1') {
					return this.$t('app_in_audit')
				} else if (item?.warrantyStatus == '2' && item?.auditResult == '2') {
					return this.$t('app_audit_refuse')
				} else if (item?.warrantyStatus == '2' && item?.auditResult == '1' && item?.expDate >= new Date()
					.getTime()) {
					return this.$t('app_under_guarantee')
				} else if (item?.warrantyStatus == '2' && item?.auditResult == '1' && item?.expDate < new Date()
					.getTime()) {
					return this.$t('app_expire')
				}
				return item?.warrantyStatusDesc
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
		justify-content: flex-start;
		align-items: center;
		background-color: $u-bg-color;

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
					width: 120rpx;
					height: 120rpx;
					flex-shrink: 0;
					display: inline-flex;
					justify-content: center;
					align-items: center;

					.info-icon {
						width: 120rpx;
						height: 120rpx;
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
					padding: 0rpx 0rpx 0rpx 18rpx;
					width: 0;
					position: relative;

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
						padding-right: 120rpx;
					}

					.data-status {
						position: absolute;
						right: -10rpx;
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