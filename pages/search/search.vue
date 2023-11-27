<template>
	<view class="container">
		<view class="data-wrap">
			<view class="data-box">
				<view class="data-item" v-for="(item,index) in repairlist" :key="item.id">
					<view class="left-box">
						<view class="info-wrap">
							<view class="info-img" :data-url="item.productItemImagesUrls[0]">
								<u-image :src="item.productItemImagesUrls[0]" :show-loading="true" :show-error="true"
									width="150" height="150" @click="handleImageClick(item.productItemImagesUrls[0])">
								</u-image>
							</view>
							<view class="info-box">
								<view class="info-item u-line-1" style="color:#4C81EF;"
									@click="toProductDetail(item.productItemId)">
									{{item.productItemName}}
								</view>
								<!-- <view class="info-item">
									{{$t('field_product_item_sn')}}：{{item.productItemSn}}
								</view> -->
								<view class="info-item u-line-1 info-item-1">
									{{$t('def_warranty')}}ID：{{item.warrantyCode}}
								</view>
								<view class="info-item">
									{{$t('app_create_date')}}：{{item.createTimeStr}}
								</view>
							</view>
						</view>
						<view class="data-status">
							{{item.warrantyStatusDesc}}
						</view>
					</view>
					<view class="right-box">
						<view class="right-box-1">
							<view class="date-wrap" @click="toBrandDetail(item)">
								{{$t('enum_crm_comp_type_brand')}}：{{item.brandCompName}}
							</view>
						</view>
						<view class="right-box-1">
							<view class="date-wrap">
								{{$t('app_warranty_period')}}：{{item.purDateStr}}-{{item.expDateStr}}
							</view>
						</view>
						<view class="right-box-1">
							<view class="repair-user">
								{{$t('app_warranty_company')}}：{{item.distributorCompName}}
							</view>
							<view class="btn" @click="toDetail(item)">
								{{item.warrantyStatus=='0'?$t('op_edit'):$t('app_view')}}
							</view>
						</view>
					</view>
				</view>
				<u-empty :text="$t('app_no_data')" mode="list" v-if="repairlist.length==0"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/index.js'
	import wty from '../../api/wty.js'
	export default {
		data() {
			return {pagetitle: 'def_warranty',
				keyword: '',
				pageNumber: 1,
				pageSize: 10,
				repairlist: [], //保修单
			};
		},
		onLoad(options) {
			const that = this
			if (options.keyword) {
				that.keyword = options.keyword
				that.pageNumber = 1
				that.repairlist = []
				that.pageQueryWarranty()
			}
		},
		onReady() {
			const that = this
			uni.setNavigationBarTitle({
				title: that.$t('def_warranty')
			})
		},
		onPullDownRefresh() {
			this.pageNumber = 1
			this.repairlist = []
			this.pageQueryWarranty()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500)
		},
		onReachBottom() {
			this.pageNumber += 1
			this.pageQueryWarranty()
		},
		methods: {
			toJSON() {},
			handleSearchClick() {
				this.pageNumber = 1
				this.repairlist = []
				this.pageQueryWarranty()
			},
			handleImageClick(url){
				uni.previewImage({
					current:0,
					urls:[url]
				})
			},
			toProductDetail(id) {
				uni.navigateTo({
					url: `/pages/productdetail/productdetail?id=${id}`
				})
			},
			toBrandDetail(obj) {
				uni.navigateTo({
					url: `/pages/tenantdetail/tenantdetail?id=${obj.brandCompId}`
				})
			},
			toDetail(obj) {
				console.log('obj',obj)
				// if(obj.warrantyStatus=='0'){
				// 	this.$store.state.tempobj=JSON.stringify(obj)
				// 	console.log('this.$store.state.tempobj',this.$store.state.tempobj)
				// 	uni.switchTab({
				// 		url: `/pages/addrepair/addrepair`
				// 	})
				// }else{
					uni.navigateTo({
						url: `/pages/repairdetail/repairdetail?obj=${JSON.stringify(obj)}`
					})
				// }
			},
			pageQueryWarranty() {
				const that = this
				let _data = {
					pageNumber: that.pageNumber,
					pageSize: that.pageSize,
					keyword:that.keyword
				}
				wty.pageQueryWarranty(_data).then(res => {
					console.log('pageQueryWarranty', res)
					res?.pageResult?.list?.forEach(item => {
						item.createTimeStr = new Date(item.createTime).Format('dd/MM/yyyy')
						item.purDateStr = new Date(item.purDate).Format('dd/MM/yyyy')
						item.expDateStr = new Date(item.expDate).Format('dd/MM/yyyy')
						item.warrantyStatusKey = that.$store.state.enums?.ApplyStatusEnum?.find(t => t
							.value == item.warrantyStatus)?.textCode
						item.warrantyStatusDesc = that.$t('enum_common_apply_status_create')
						item.productItemImagesUrls = item.productItemImagesUrl?.split(',')
						if (!item.productItemImagesUrls || item?.productItemImagesUrls?.length == 0) {
							item.productItemImagesUrls = []
						}
						console.log('item.productItemImagesUrls', item.productItemImagesUrls)
						if (item.warrantyStatusKey) {
							item.warrantyStatusDesc = that.$t(item.warrantyStatusKey)
						}
						that.repairlist.push(item)
					})
					console.log('that.repairlist', that.repairlist)
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: $uni-bg-color;
		min-height: 100vh;
		padding: 0rpx 0rpx 32rpx 0rpx;
		width: 100%;
		font-size: 26rpx;

		.search-wrap {
			width: 100%;
			display: flex;
			flex-direction: column;
			background-color: #4C81EF;
			padding: 12rpx 32rpx;
			position: fixed;
			top: 0rpx;
			left: 0rpx;
			z-index: 9999999;

			.status-bar {
				height: var(--status-bar-height);
				width: 100%;
			}


			.search-box {
				width: 100%;
				display: inline-flex;
				justify-content: space-between;
				align-items: flex-end;

				.search-input {
					flex: 1;
				}

				.msg-icon {
					width: 64rpx;
					height: 50rpx;
					display: inline-flex;
					justify-content: center;
					align-items: center;
					position: relative;
					color: #fff;
				}
			}
		}

		.data-wrap {
			width: 100%;

			.data-box {
				width: 100%;
				padding: 24rpx;

				.data-item {
					width: 100%;
					padding: 24rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					background-color: #fff;
					margin-bottom: 32rpx;
					box-shadow: -1px 8px 20px 0px rgba(56, 108, 171, 0.1);
					border-radius: 12rpx;

					.left-box {
						width: 100%;
						display: inline-flex;
						justify-content: space-between;
						align-items: flex-start;

						.info-wrap {
							flex: 1;
							width: 0;
							display: inline-flex;
							align-items: center;

							.info-img {
								width: 150rpx;
								height: 150rpx;
								flex-shrink: 0;
								display: inline-flex;
								justify-content: center;
								align-items: center;
							}

							.info-box {
								flex: 1;
								padding: 0rpx 6rpx;
								flex-grow: 1;

								.info-item {
									padding-bottom: 8rpx;
									font-size: 26rpx !important;
									font-weight: 500;
									color: #808080;
									width: 100%;
								}

								.info-item-1 {
									color: #808080 !important;
								}

								.u-line-1 {
									font-size: 30rpx;
									font-weight: 500;
									color: #333333;
								}
							}
						}

						.data-status {
							font-size: 26rpx;
							font-weight: 500;
							color: #4C81EF;
							flex-shrink: 0;
						}
					}

					.right-box {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: flex-end;
						padding: 8rpx 0rpx 0rpx 0rpx;

						.right-box-1 {
							width: 100%;
							display: inline-flex;
							justify-content: space-between;
							align-items: center;
							font-size: 24rpx;
							font-weight: 500;
							color: #A6A6A6;

							.date-wrap {
								padding: 6rpx 0rpx;
							}

							.btn {
								border: 2rpx solid #999999;
								border-radius: 20rpx;
								font-size: 24rpx;
								font-weight: 500;
								color: #A6A6A6;
								padding: 2rpx 14rpx;
								min-width: 120rpx;
								display: inline-flex;
								justify-content: center;
								align-items: center;
							}
						}

					}
				}
			}
		}
	}
</style>
