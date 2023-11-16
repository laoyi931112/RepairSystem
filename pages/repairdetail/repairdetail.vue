<template>
	<view class="container">
		<u-navbar back-icon-color="#fff" back-icon-size="36" :title="title" title-color="#fff"
			:background="{backgroundColor:'#4C81EF'}" :border-bottom="false">
			<template v-slot:right>
				<u-icon v-if="detail.warrantyType=='0'" @click="toEdit" name="edit-pen-fill" color="#FFF" size="28"
					style="margin-right:32rpx"></u-icon>
			</template>
		</u-navbar>
		<view class="info-wrap">
			<view class="info-img">
				<!-- 				<u-image class="img-icon" :src="detail.productItemImagesUrls" :show-loading="true" :show-error="true"
					width="750" height="320">
				</u-image> -->
				<u-swiper class="img-icon" v-if="carousel.length>0" :list="carousel" height="750" mode="dot"
					indicator-pos="bottomCenter" border-radius="12" circular @click="handlePreviewImg1">
				</u-swiper>
			</view>
			<view class="info-box">
				<view class="info-desc">
					{{$t('app_product_parameters')}}
				</view>
				<view class="info-content">
					<view class="info-item" v-if="detail.warrantyType=='1'">
						{{$t('field_product_item_model')}}：{{detail.productItemId}}
					</view>
					<view class="info-item" @click="toProductDetail(detail.productItemId)">
						{{$t('field_product_item_name')}}：<text
							style="color:#4C81EF;">{{detail.productItemNames}}</text>
					</view>
				<!-- 	<view class="info-item" v-if="detail.warrantyType=='1'">
						{{$t('field_product_item_sn')}}：{{detail.productItemSn}}
					</view> -->
					<view class="info-item" @click="toBrandDetail(detail.brandCompId)" v-if="detail.warrantyType=='1'">
						{{$t('def_brand')}}：<text style="color:#4C81EF;">{{detail.brandCompName}}</text>
					</view>
					<!-- 	<view class="info-item">
						所属分类：xxx
					</view> -->
					<view class="info-item" v-if="detail.warrantyType=='1'">
						{{$t('app_warranty_period')}}：{{detail.expDate}}
					</view>
					<!-- 	<view class="info-item">
						标签：xxx
					</view>
					<view class="info-item">
						描述：xxx
					</view> -->
				</view>
			</view>
			<view class="info-box">
				<view class="info-desc">
					{{$t('app_voucher')}}({{$t('def_warranty')}}ID:{{detail.warrantyCode}})
				</view>
				<view class="info-box-w">
					<view class="info-box-left">
						<view class="info-box-left-item">
							{{$t('app_purchasing_date')}}：{{detail.purDate}}
						</view>
						<view class="info-box-left-item">
							{{$t('app_warranty_period')}}：{{detail.expDate}}
						</view>
						<view class="info-box-left-item" v-if="detail.warrantyType=='1'">
							{{$t('app_business')}}：{{detail.distributorCompName}}
						</view>
						<view class="info-box-left-item">
							{{$t('field_warranty_status')}}：{{detail.warrantyStatusDesc}}
						</view>
					</view>
					<view class="info-box-right">
						<!-- <image :src="detail.warrantyImagesUrl" class="info-box-img"></image> -->
						<u-swiper class="info-box-img" v-if="carousel1.length>0" :list="carousel1" height="160"
							mode="dot" indicator-pos="bottomCenter" border-radius="12" circular @click="handlePreviewImg2">
						</u-swiper>
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
		<u-button type="primary" class="info-btn" @click="toApply" v-if="showBtn">
			{{$t('app_apply_warranty')}}
		</u-button>
	</view>
</template>

<script>
	import utils from '../../utils/index.js'
	import product from '../../api/product.js'
	export default {
		data() {
			return {
				pagetitle: 'def_warranty',
				obj: '',
				detail: {}, //详情
				carousel: [], //产品图
				carousel1: [], //凭证
				showBtn: false,
				title: ''
			};
		},
		onLoad(options) {
			if (options.obj) {
				this.obj = options.obj
				this.detail = JSON.parse(options.obj)
				console.log('this.detail',this.detail);
				if (this.detail.warrantyStatus == '2' && new Date(this.detail.expDate) > new Date()) {
					this.showBtn = true
				}
				this.detail.expDate = new Date(this.detail.expDate).Format('dd/MM/yyyy')
				this.detail.purDate = new Date(this.detail.purDate).Format('dd/MM/yyyy')
				this.detail?.productItemImagesUrls?.forEach(t => {
					this.carousel.push({
						image: t,
						title: '',
						data: '',
					})
				})
				this.detail.warrantyImagesUrl?.split(',')?.forEach(t => {
					this.carousel1.push({
						image: t,
						title: '',
						data: '',
					})
				})
				console.log('detail', this.detail, this.carousel, this.carousel1)
				this.getProduct(this.detail?.productItemId)
			}
		},
		onReady() {
			const that = this
			that.title = that.$t('def_warranty')
			// uni.setNavigationBarTitle({
			// 	title: that.$t('def_warranty')
			// })
		},
		methods: {
			toJSON() {},
			handlePreviewImg1(index) {
				let urls = []
				this.carousel?.forEach(item => {
					urls.push(item?.image)
				})
				uni.previewImage({
					current: index,
					urls: urls
				})
			},
			handlePreviewImg2(index) {
				let urls = []
				this.carousel1?.forEach(item => {
					urls.push(item?.image)
				})
				uni.previewImage({
					current: index,
					urls: urls
				})
			},
			toEdit() {
				uni.navigateTo({
					url: `/pages/addOfflineRepair/addOfflineRepair?obj=${this.obj}`
				})
			},
			getProduct(id) {
				const that = this
				let _data = {
					id: id
				}
				product.getItemInfo(_data).then(res => {
					console.log('pageQueryItem', res)
					that.detail.itemDesc = res.data?.itemDesc
				})
			},
			toBrandDetail(brandCompId) {
				uni.navigateTo({
					url: `/pages/tenantdetail/tenantdetail?id=${brandCompId}`
				})
			},
			toProductDetail(id) {
				if (this.detail.warrantyType == '1') {
					uni.navigateTo({
						url: `/pages/productdetail/productdetail?id=${id}`
					})
				}

			},
			toApply() {
				uni.setStorageSync(`abc${this.detail.id}`,this.detail)
				uni.navigateTo({
					url: `/pages/applyrepair/applyrepair?id=${this.detail.id}`
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
