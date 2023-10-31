<template>
	<view class="container">
		<view class="data-wrap">
			<view class="data-box">
				<view class="data-item" v-for="(item,index) in repairlist" :key="item.id" @click="toDetail(item)">
					<view class="left-box">
						<view class="info-wrap">
							<view class="info-img">
								<!-- 								<u-icon :name="item.productItemImagesUrl?item.productItemImagesUrl:'photo'" size="72" color="#909399"></u-icon> -->
								<u-image :src="item.productItemImagesUrls[0]" :show-loading="true" :show-error="true" width="150" height="150">
								</u-image>
							</view>
							<view class="info-box">
								<view class="info-item u-line-1 info-title">
									{{item.productItemName}}
								</view>
								<view class="info-item">
									{{$t('field_product_item_sn')}}：{{item.productItemSn}}
								</view>
								<!-- 								<view class="info-item u-line-1">
									九阳HU-001
								</view> -->
								<view class="info-item">
									{{$t('def_warranty')}}id：{{item.id}}
								</view>
								<view class="info-item">
									{{$t('app_create_date')}}：{{item.createTimeStr}}
								</view>
							</view>
						</view>
					</view>
					<view class="right-box">
						<view class="data-status">
							{{item.warrantyStatusDesc}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/index.js'
	import wty from '../../api/wty.js'
	export default {
		data() {
			return {pagetitle: 'def_msg',
				pageNumber: 1,
				pageSize: 10,
				repairlist: [], //保修单
			}
		},
		onLoad() {

		},
		onShow() {
			this.pageNumber = 1
			this.repairlist = []
			this.pageQueryWarranty()
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
		onReady() {
			uni.setNavigationBarTitle({
				title:this.$t('def_msg')
			})
		},
		methods: {
			toJSON(){},
			pageQueryWarranty() {
				const that = this
				let _data = {
					pageNumber: that.pageNumber,
					pageSize: that.pageSize,
					sortColumn: 'create_time',
					sortDir: 'desc'
				}
				wty.pageQueryWarranty(_data).then(res => {
					console.log('pageQueryWarranty', res)
					res?.pageResult?.list?.forEach(item => {
						item.createTimeStr = new Date(item.createTime).Format('dd/MM/yyyy hh:mm')
						item.expDateStr = new Date(item.expDate).Format('dd/MM/yyyy hh:mm')
						item.warrantyStatusKey = that.$store.state.enums?.ApplyStatusEnum?.find(t => t
							.value == item.warrantyStatus)?.textCode
						item.warrantyStatusDesc = that.$t('enum_common_apply_status_create')
						item.productItemImagesUrls=item.productItemImagesUrl?.split(',')
						if(!item.productItemImagesUrls ||item.productItemImagesUrls?.length==0){
							item.productItemImagesUrls=['']
						}
						if (item.warrantyStatusKey) {
							item.warrantyStatusDesc = that.$t(item.warrantyStatusKey)
						}
						that.repairlist.push(item)
					})
				})
			},
			toDetail(obj) {
				uni.navigateTo({
					url: `/pages/repairdetail/repairdetail?obj=${JSON.stringify(obj)}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: $u-bg-color;
		padding-bottom: 96rpx;
		min-height: 100vh;

		.data-wrap {
			width: 100%;

			.data-box {
				width: 100%;
				padding: 24rpx;

				.data-item {
					width: 100%;
					padding: 24rpx;
					display: inline-flex;
					justify-content: space-between;
					background-color: #fff;
					margin-bottom: 24rpx;
					// box-shadow: 0 8rpx 10rpx rgba(0, 0, 0, 0.1);
					border-radius: 12rpx;

					.left-box {
						flex: 1;

						.info-wrap {
							width: 100%;
							display: inline-flex;
							align-items: center;
							font-size: 26rpx;
							color: #808080;

							.info-title {
								font-weight: 550;
								color: #000;
								font-size: 30rpx;
							}

							.info-img {
								width: 150rpx;
								height: 150rpx;
								display: inline-flex;
								justify-content: center;
								align-items: center;
							}

							.info-box {
								flex: 1;
								padding: 0rpx 6rpx;

								.info-item {
									padding-bottom: 12rpx;
								}
							}
						}

						.date-wrap {
							padding: 12rpx 0rpx;
						}
					}

					.right-box {
						height: 200rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: flex-end;
						.data-status{
							color: #4C81EF;
						}
					}
				}
			}
		}
	}
</style>
