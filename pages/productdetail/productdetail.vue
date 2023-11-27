<template>
	<view class="container">
		<view class="info-wrap">
			<view class="info-img">
				<u-swiper class="img-icon" v-if="carousel.length>0" :list="carousel" height="750" mode="dot"
					indicator-pos="bottomCenter" border-radius="12" circular @click="handlePreviewImg">
				</u-swiper>
			</view>
			<view class="info-box">
				<view class="info-desc">
					{{$t('app_product_parameters')}}
				</view>
				<view class="info-content">
					<view class="info-item">
						{{$t('field_product_item_model')}}：{{detail.productItemId}}
					</view>
					<view class="info-item">
						{{$t('field_product_item_name')}}：{{detail.productItemName}}
					</view>
					<!-- <view class="info-item">
						{{$t('field_product_item_sn')}}：{{detail.productItemSn}}
					</view> -->
					<view class="info-item" @click="toBrandDetail(detail.brandCompId)">
						{{$t('def_brand')}}：{{detail.brandCompName}}
					</view>
				</view>
			</view>
<!-- 			<view class="info-box">
				<view class="info-desc">
					{{$t('app_product_parameters')}}
				</view>
				<view class="info-content" v-html="detail.itemDesc">
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/index.js'
	import product from '../../api/product.js'
	import crm from '../../api/crm.js'
	export default {
		data() {
			return {pagetitle: 'def_product',
				detail: {}, //详情
				carousel: [], //产品图
			};
		},
		onLoad(options) {
			if (options.id) {
				this.getProduct(options.id)
			}
		},
		onReady() {
			const that = this
			uni.setNavigationBarTitle({
				title: that.$t('def_product')
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
			getProduct(id) {
				const that = this
				let _data = {
					id: id
				}
				product.getItemInfo(_data).then(res => {
					console.log('pageQueryItem', res)
					res.data?.itemImagesUrl?.split(',')?.forEach(item=>{
						that.carousel.push({
							image: item,
							title: '',
							data: '',
						})
					})
					that.detail.productItemId = res.data?.id
					that.detail.productItemName = res.data?.itemName
					that.detail.productItemSn = res.data?.itemSn
					that.detail.brandCompId = res.data?.brandCompId
					that.detail.itemDesc = res.data?.itemDesc
					that.getCompInfo(that.detail.brandCompId)
				})
			},
			getCompInfo(id) {
				let _data = {
					id: id
				}
				crm.getCompInfo(_data).then(res => {
					console.log('getCompInfo', res)
					this.detail.brandCompName = res.data?.compName
				})
			},
			toBrandDetail(brandCompId) {
				uni.navigateTo({
					url: `/pages/tenantdetail/tenantdetail?id=${brandCompId}`
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
		justify-content: flex-start;
		align-items: center;
		background-color: $u-bg-color;
		padding-bottom: 128rpx;

		.info-btn {
			position: fixed;
			bottom: 48rpx;
			left: 96rpx;
			right: 95rpx;
			z-index: 9;
			border-radius: 24rpx;
		}

		.info-wrap {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;

			.info-img {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;

				.img-icon {
					width: 100%;
					height: 750rpx;
					display: inline-flex;
					justify-content: center;
					align-items: center;

					::v-deep .uni-swiper-wrapper {
						width: 750rpx;
					}
				}
			}

			.info-box {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: flex-start;
				padding: 26rpx;

				.info-desc {
					padding: 0rpx 12rpx;
					border-left: 6rpx solid #4C81EF;
					font-size: 30rpx;
					font-weight: 500;
					color: #333333;
					margin: 12rpx 0rpx;
				}

				.info-content {
					width: 100%;
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: center;
					background-color: $uni-bg-color;
					padding: 24rpx 24rpx;

					.info-item {
						width: 100%;
						padding-bottom: 12rpx;
					}
				}

				.info-box-w {
					width: 100%;
					display: inline-flex;
					background-color: $uni-bg-color;
					padding: 24rpx;

					.info-box-left {
						flex: 1;
						display: flex;
						flex-direction: column;

						.info-box-left-item {
							width: 100%;
							padding-bottom: 12rpx;
						}
					}

					.info-box-right {
						width: 160rpx;
						height: 160rpx;
						flex-shrink: 0;

						.info-box-img {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
	}
</style>
