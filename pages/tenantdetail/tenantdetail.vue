<template>
	<view class="container">
		<u-navbar back-icon-name="home" back-icon-color="#fff" back-icon-size="36" :title="title" title-color="#fff" :custom-back="goHome" :background="{backgroundColor:'#4C81EF'}" :border-bottom="false">
			
		</u-navbar>
		<view class="info-wrap">
			<view class="info-box" :style="{backgroundImage: `url(${tenantbg});`}">
				<view class="info-img">
					<u-image @click="handleImageClick(detail.logoUrl)" :src="detail.logoUrl" :show-loading="true" :show-error="true" width="120" height="120"
						class="info-icon" shape="circle">
					</u-image>
					</u-icon>
				</view>
				<view class="info-content">
					<view class="info-text">
						{{detail.compName}}
					</view>
				<!-- 	<view class="info-text">
						简介:{{detail.compIntro?detail.compIntro:'暂无'}}
					</view> -->
					<view class="info-text u-line-1">
						{{$t('app_company_intro')}}：<text v-html="detail.compIntro"></text>
					</view>
					<view class="info-tags" v-for="(tag,tindex) in detail.tags" :key="tindex">
						<view class="info-tag">
							{{tag}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="info-poster">
			<u-swiper v-if="carousel.length>0" :list="carousel" name="image" height="320rpx" mode="dot"
				indicator-pos="bottomCenter" circular @click="handleSwiperClick">
			</u-swiper>
		</view>
		<view class="info-news">
			<template v-for="(item,index) in newslist">
				<view v-if="item.appShowType==3" class="info-new info-new1" :key="index" @click="toDetail(item)">
					<view class="info-title">
						{{item.infoTitle}}
					</view>
					<view class="info-imgs" :data-url="item.thumbnailImagesUrls[0]">
						<view class="info-img" :style="{backgroundImage: `url(${item.thumbnailImagesUrls[0]})`}">
						</view>
					</view>
				</view>
				<view v-if="item.appShowType==1" class="info-new info-new2" :key="index" @click="toDetail(item)">
					<view class="info-title">
						{{item.infoTitle}}
					</view>
					<view class="info-imgs" :data-url="item.thumbnailImagesUrls[0]">
						<view class="info-img" :style="{backgroundImage: `url(${item.thumbnailImagesUrls[0]})`}">
						</view>
					</view>
				</view>
				<view v-if="item.appShowType==2" class="info-new info-new3" :key="index" @click="toDetail(item)">
					<view class="info-title">
						{{item.infoTitle}}
					</view>
					<view class="info-imgs" :data-url="item.thumbnailImagesUrls[0]">
						<view class="info-img" v-for="img in item.thumbnailImagesUrls" :key="img"
							:style="{backgroundImage: `url(${img})`}">
						</view>
					</view>

				</view>
			</template>
			<u-empty :text="$t('app_no_data')" mode="list" v-if="newslist.length==0"></u-empty>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/index.js'
	import crm from '../../api/crm.js'
	import common from '../../api/common.js'
	export default {
		data() {
			return {pagetitle: '',
				id: '',
				detail: {},
				carousel: [],
				pageNumber: 1,
				pageSize: 10,
				newslist: [], //资讯
				defaultlogo: require('../../static/agent_head@2x.png'),
				tenantbg: require('../../static/agentBg@2x.png'),
				title:''
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.getCompInfo(options.id)
				this.getShuffleInfo()
				this.pageQueryInfo()
			} else {
				utils.showmessage(this.$t('app_can_not_find_maintain')).then(() => {
					uni.navigateBack()
				})
			}
		},
		onPullDownRefresh() {
			this.pageNumber = 1
			this.newslist = []
			this.pageQueryInfo()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500)
		},
		onReachBottom() {
			this.pageNumber += 1
			this.pageQueryInfo()
		},
		
		methods: {
			toJSON() {},
			handleImageClick(url){
				uni.previewImage({
					current:0,
					urls:[url]
				})
			},
			handleSwiperClick(index) {
				console.log('index', index)
				uni.navigateTo({
					url: `/pages/tenantnews/tenantnews?detail=${JSON.stringify(this.carousel[index].data)}`
				})
			},
			goHome() {
				uni.reLaunch({
					url: `/pages/index/index`
				})
			},
			pageQueryInfo() {
				const that = this
				let _data = {
					pageNumber: that.pageNumber,
					pageSize: that.pageSize,
					compIdEQ: that.id
				}
				common.pageQueryInfo(_data).then(res => {
					console.log('pageQueryInfo', res)
					res?.pageResult?.list?.forEach(item => {
						item.thumbnailImagesUrls = item.thumbnailImagesUrl?.split(',')
						that.newslist.push(item)
					})
				})
			},
			getShuffleInfo() {
				const that = this
				let params = {
					pageNumber: 1,
					pageSize: 5,
					compIdEQ: that.id,
					isShuffleEQ: '1'
				}
				common.pageQueryInfo(params).then(res => {
					console.log('getShuffleInfo', res)
					that.carousel = []
					res?.pageResult?.list?.forEach(item => {
						that.carousel.push({
							image: item.thumbnailImagesUrl,
							title: item.infoTitle,
							data:item
						})
					})
				}).catch(res => {
					console.error('error', res)
					if (res) {
						utils.showmessage(that.$t(res))
					}
				})
			},
			getCompInfo(id) {
				let _data = {
					id: id
				}
				crm.getCompInfo(_data).then(res => {
					console.log('getCompInfo', res)
					res.data.tags = res.data?.compTags?.split(';')
					this.detail = res.data
					if (!this.detail.logoUrl) {
						this.detail.logoUrl = this.defaultlogo
					}
					if (this.detail.compType == '1') {
						// uni.setNavigationBarTitle({
						// 	title: '品牌商'
						// })
						this.title=this.$t('def_brand')
					}
					if (this.detail.compType == '2') {
						// uni.setNavigationBarTitle({
						// 	title: '分销商'
						// })
						this.title=this.$t('def_distributor')
					}
					if (this.detail.compType == '3') {
						// uni.setNavigationBarTitle({
						// 	title: '维修商'
						// })
						this.title=this.$t('enum_crm_comp_type_maintain')
					}
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url: `/pages/tenantnews/tenantnews?detail=${JSON.stringify(item)}&compname=${this.detail.compName}`
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
		background-color: $uni-bg-color;

		.info-wrap {
			width: 100%;
			display: inline-flex;
			padding: 54rpx 48rpx 0rpx 54rpx;
			background-color: #4C81EF;

			.info-box {
				width: 100%;
				display: inline-flex;
				padding: 32rpx 0rpx 64rpx 0rpx;
				background-size: 100% 100%;
				background-repeat: no-repeat;

				.info-img {
					width: 120rpx;
					height: 120rpx;
					flex-shrink: 0;

					.info-icon {
						width: 120rpx;
						height: 120rpx;
						display: inline-flex;
						align-items: center;
						justify-content: center;
					}
				}

				.info-content {
					flex: 1;
					padding-left: 24rpx;
					display: flex;
					flex-direction: column;
					color: #fff;

					.info-text {
						width: 100%;
						padding-bottom: 6rpx;
					}

					.info-tags {
						width: 100%;
						display: inline-flex;

						.info-tag {
							padding: 10rpx;
							border: 2rpx solid $u-border-color;
							border-radius: 10rpx;
							margin-right: 12rpx;
						}
					}
				}
			}
		}

		.info-poster {
			width: 100%;
			min-height: 32rpx;
			background-color: $uni-bg-color;
			margin-top: -24rpx;
			border-top-left-radius: 24rpx;
			border-top-right-radius: 24rpx;
			padding: 24rpx;
		}

		.info-news {
			width: 100%;
			padding: 24rpx;

			.info-new {
				width: 100%;
				background-color: $uni-bg-color;
				border-radius: 12rpx;
				padding: 12rpx 0rpx;
				margin-bottom: 18rpx;

				.info-title {
					font-size: 26rpx;
				}

				.info-img {
					height: 200rpx;
					background-size: 100% 100%;
					background-repeat: no-repeat;
				}
			}

			.info-new1 {
				display: inline-flex;
				align-items: flex-start;

				.info-title {
					flex: 1;
					width: 0;
					padding-right: 24rpx;
					max-height: 200rpx;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.info-imgs {
					width: 300rpx;

					.info-img {
						width: 300rpx;
					}
				}

			}

			.info-new2 {
				display: flex;
				flex-direction: column;

				.info-title {
					width: 100%;
					margin-bottom: 18rpx;
					max-height: 100rpx;
					@include tn-text-ellipsis-3;
				}

				.info-imgs {
					width: 100%;

					.info-img {
						width: 100%;
					}
				}

			}

			.info-new3 {
				display: flex;
				flex-direction: column;

				.info-title {
					width: 100%;
					margin-bottom: 18rpx;
					max-height: 100rpx;
					@include tn-text-ellipsis-3;
				}

				.info-imgs {
					width: 100%;
					display: flex;
					flex-wrap: wrap;
					gap: 10rpx;

					.info-img {
						width: 210rpx;
					}
				}

			}
		}
	}
</style>
