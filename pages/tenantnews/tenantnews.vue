<template>
	<view class="container">
		<u-navbar back-icon-name="home" back-icon-size="36" :title="detail.infoTitle" :custom-back="goHome">
			<template v-slot:right>
				<view class="navbar-icon" @click="toTenantDetail">
					<u-image :src="navicon" width="36" height="36"></u-image>
				</view>
			</template>
		</u-navbar>
		<view class="info-wrap">
			<!-- <view class="info-title">
				{{detail.infoTitle}}
			</view> -->
			<view class="info-author">
				<view class="info-name" @click="toBrandDetail">
					{{compname?compname:''}}
				</view>
				<view class="info-date">
					{{detail.issueTime}}
				</view>
			</view>
			<view class="info-content" v-html="detail.infoContent">
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/index.js'
	import common from '../../api/common.js'
	import crm from '../../api/crm.js'
	export default {
		data() {
			return {pagetitle: '',
				detail: {},
				compname: '',
				compid: '',
				navicon: require('../../static/enterprise@2x.png')
			};
		},
		onLoad(options) {
			if (options.detail) {
				this.compname = options.compname
				let detail = JSON.parse(options.detail)
				this.viewInfo(detail.id)
				this.getCompInfo(detail.compId)
				this.compid = detail.compId
			} else {
				utils.showmessage(this.$t('app_param_err')).then(() => {
					uni.navigateBack()
				})
			}
		},
		methods: {
			toJSON() {},
			goHome() {
				uni.reLaunch({
					url: `/pages/index/index`
				})
			},
			toTenantDetail() {
				uni.reLaunch({
					url: `/pages/tenantdetail/tenantdetail?id=${this.detail.compId}`
				})
			},
			getCompInfo(id) {
				let _data = {
					id: id
				}
				crm.getCompInfo(_data).then(res => {
					console.log('getCompInfo', res)
					this.compname = res.data?.compName
				})
			},
			viewInfo(id) {
				const that = this
				let _data = {
					id: id
				}
				common.viewInfo(_data).then(res => {
					that.detail = res.data
					that.detail.issueTime = new Date(that.detail.issueTime).Format('dd/MM/yyyy hh:mm')
				}).catch(res => {
					console.error('error', res)
					if (res) {
						utils.showmessage(that.$t(res))
					}
				})
			},
			toBrandDetail() {
				uni.navigateTo({
					url: `/pages/tenantdetail/tenantdetail?id=${this.compid}`
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

		.navbar-icon {
			padding: 0rpx 32rpx;
		}

		.info-wrap {
			width: 100%;
			padding: 32rpx;
			display: flex;
			flex-direction: column;

			.info-title {
				width: 100%;
				text-align: center;
				font-size: 32rpx;
				font-weight: 550;
			}

			.info-author {
				width: 100%;
				display: inline-flex;
				padding: 24rpx 0rpx;

				.info-name {
					padding: 0rpx 24rpx 0rpx 0rpx;
				}
			}

			.info-content {
				width: 100%;
			}
		}
	}
</style>
