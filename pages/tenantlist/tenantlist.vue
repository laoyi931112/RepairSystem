<template>
	<view class="container">
		<view class="info-wrap">
			<view class="info-item" v-for="(item,index) in tenantlist" :key="index">
				<view class="info-img">
					<u-image class="info-icon" @click="handleImageClick(item.logoUrl)" :src="item.logoUrl" :show-loading="true" :show-error="true" width="160" height="160">
					</u-image>
				</view>
				<view class="info-content">
					<view class="info-name">
						{{item.compName}}
					</view>
					<view class="info-tags" v-for="(tag,tindex) in item.tags" :key="tindex">
						<view class="info-tag">
							{{tag}}
						</view>
					</view>
				</view>
				<u-button class="info-btn" size="medium" @click="toDetail(item.id)">{{$t('app_view')}}</u-button>
			</view>

		</view>
	</view>
</template>

<script>
	import crm from '../../api/crm.js'
	export default {
		data() {
			return {pagetitle: 'app_nearby_maintain',
				pageNumber: 1,
				pageSize: 10,
				tenantlist: [], //维修商
				defaultlogo: require('../../static/agent_logo@2x.png')
			};
		},
		onLoad(options) {
			this.pageNumber = 1
			this.tenantlist = []
			this.pageQueryMaintainComp()
		},
		onReady() {
			uni.setNavigationBarTitle({
				title:this.$t('app_nearby_maintain')
			})
		},
		onPullDownRefresh() {
			this.pageNumber = 1
			this.tenantlist = []
			this.pageQueryMaintainComp()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500)
		},
		onReachBottom() {
			this.pageNumber += 1
			this.pageQueryMaintainComp()
		},
		methods: {
			toJSON(){},
			handleImageClick(url){
				uni.previewImage({
					current:0,
					urls:[url]
				})
			},
			pageQueryMaintainComp() {
				const that = this
				let _data = {
					pageNumber: that.pageNumber,
					pageSize: that.pageSize
				}
				crm.pageQueryMaintainComp().then(res => {
					console.log('pageQueryMaintainComp', res)
					res?.pageResult?.list?.forEach(item => {
						item.tags = item?.compTags?.split(';')
						item.logoUrl=item.logoUrl?item.logoUrl:that.defaultlogo
						that.tenantlist.push(item)
					})
				})
			},
			toDetail(id) {
				uni.navigateTo({
					url: `/pages/tenantdetail/tenantdetail?id=${id}`
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

		.info-wrap {
			width: 100%;
			padding: 24rpx;

			.info-item {
				width: 100%;
				display: inline-flex;
				align-items: center;
				background-color: $uni-bg-color;
				border-radius: 10rpx;
				padding: 24rpx;
				margin-bottom: 24rpx;

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
					padding: 0rpx 24rpx;

					.info-name {
						width: 100%;
						font-size: 28rpx;
						font-weight: 550;
					}

					.info-tags {
						width: 100%;
						padding: 24rpx 0rpx;
						display: flex;
						flex-direction: row;

						.info-tag {
							padding: 10rpx;
							border: 2rpx solid $u-border-color;
							border-radius: 10rpx;
							margin-right: 12rpx;
						}
					}
				}

				.info-btn {
					width: 120rpx;
					flex-shrink: 0;
					&>button{
						width: 120rpx;
						height: 38rpx;
						padding: 6rpx 18rpx !important;
						color: #4C81EF !important;
						border: 2rpx solid #4C81EF !important;
						border-radius: 12rpx !important;
						font-size: 24rpx !important;
					}
				}
			}
		}
	}
</style>
