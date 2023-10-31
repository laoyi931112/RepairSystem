<template>
	<view class="container">
		<view class="info-wrap">
			<view class="info-item" v-for="(item,index) in tenantlist" :key="index" @click="checktenant(item,index)">
				<radio :checked="item.check" color="#4C81EF" style="transform:scale(0.7)"></radio>
				<view class="info-img">
					<u-image :src="item.logoUrl?item.logoUrl:defaultlogo" :show-loading="true" :show-error="true"
						width="160" height="160" class="info-icon">
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
			</view>
		</view>
		<view class="info-btns">
			<view class="info-btn" @click="handleClick">{{$t('app_confirm')}}</view>
		</view>
	</view>
</template>

<script>
	import crm from '../../api/crm.js'
	import utils from '../../utils/index.js';
	export default {
		data() {
			return {pagetitle: 'def_maintain',
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
		onReady() {
			uni.setNavigationBarTitle({
				title:this.$t('def_maintain')
			})
		},
		methods: {
			toJSON(){},
			handleClick() {
				let item = this.tenantlist.find(t => t.check == true)
				if (!item) {
					utils.showmessage(this.$t('app_nearby_maintenance_company'))
					return
				}
				let pages = getCurrentPages()
				let applyrepair = pages[pages.length - 2]
				console.log('item', item, applyrepair)
				// applyrepair.tenantdetail = item
				uni.navigateBack({
					success() {
						// let options = applyrepair.options
						// options.tenantdetail=JSON.stringify(item)
						// applyrepair.onLoad(options)
						applyrepair.setTenantDetail(item)
					}
				})
			},
			checktenant(item, index) {
				this.tenantlist.forEach(item => {
					item.check = false
				})
				this.tenantlist[index].check = !this.tenantlist[index].check
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
						item.check = false
						item.tags = item?.compTags?.split(';')
						that.tenantlist.push(item)
					})
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
		padding-bottom: 48rpx;

		.info-wrap {
			width: 100%;
			padding: 24rpx 24rpx;

			.info-item {
				width: 100%;
				display: inline-flex;
				align-items: center;
				background-color: $uni-bg-color;
				border-radius: 10rpx;
				margin-bottom: 24rpx;
				border-bottom: 2rpx solid $u-border-color;

				.info-img {
					width: 160rpx;
					height: 160rpx;
					flex-shrink: 0;
					display: inline-flex;
					align-items: center;
					justify-content: center;

					.info-icon {
						width: 160rpx;
						height: 160rpx;
						display: inline-flex;
						align-items: center;
						justify-content: center;
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
			}
		}

		.info-btns {
			position: fixed;
			bottom: 24rpx;
			left: 96rpx;
			right: 96rpx;

			.info-btn {
				padding: 24rpx;
				color: #fff;
				background-color: #4C81EF;
				text-align: center;
				border-radius: 16rpx;
			}
		}
	}
</style>
