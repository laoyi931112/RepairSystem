<template>
	<view class="container">
		<!-- <view class="link-item link-item-1" @click="toAddRepair">
			<u-image width="128rpx" height="128rpx" :src="online"></u-image>
			<view class="link-item-text">
				{{$t('app_online')}}
			</view>
		</view>
		<view class="link-item link-item-2" @click="toAddOfflineRepair">
			<u-image width="128rpx" height="128rpx" :src="offline"></u-image>
			<view class="link-item-text">
				{{$t('app_offline')}}
			</view>
		</view> -->

		<u-tabs :list="list" :is-scroll="false" :current="current" bar-width="120" @change="handleTabChange"></u-tabs>
		<addrepair v-if="current==0" :showNav="false"></addrepair>
		<addOfflineRepair v-else-if="current==1" :showNav="false"></addOfflineRepair>
	</view>
</template>

<script>
	import addrepair from '../addrepair/addrepair.vue'
	import addOfflineRepair from '../addOfflineRepair/addOfflineRepair.vue'
	export default {
		data() {
			return {
				pagetitle: 'app_new_warranty',
				offline: require('../../static/offline@2x.png'),
				online: require('../../static/online@2x.png'),
				list: [],
				current: 0,
				timer: 0
			};
		},
		components: {
			addrepair: addrepair,
			addOfflineRepair: addOfflineRepair
		},
		onReady() {
			const that = this
			that.timer = setInterval(() => {
				uni.setNavigationBarTitle({
					title: that.$t('app_new_warranty')
				})
				that.list = [{
					name: that.$t('app_online')
				}, {
					name: that.$t('app_offline')
				}]
			}, 1000)

		},
		onHide() {
			this.timer = 0
		},
		methods: {
			toJSON() {},
			toAddRepair() {
				uni.navigateTo({
					url: `/pages/addrepair/addrepair`
				})
			},
			toAddOfflineRepair() {
				uni.navigateTo({
					url: `/pages/addOfflineRepair/addOfflineRepair`
				})
			},
			handleTabChange(value) {
				this.current = value
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
		// justify-content: center;
		// align-items: center;
		justify-content: flex-start;
		padding: 12rpx 36rpx;

		.link-item {
			width: 100%;
			height: 290rpx;
			margin: 24rpx 0rpx;
			border-radius: 20rpx;
			display: inline-flex;
			justify-content: center;
			align-items: center;

			.link-item-text {
				padding-left: 64rpx;
			}
		}

		.link-item-1 {
			background: linear-gradient(209deg, #E8FFF7 0%, #D7F7F1 100%);
			box-shadow: -1rpx 8rpx 20rpx 0rpx rgba(65, 227, 155, 0.1);
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #1FD484;
			line-height: 26rpx;
		}

		.link-item-2 {
			background: linear-gradient(209deg, #ECF6FF 0%, #E9F5FF 100%);
			box-shadow: -1rpx 8rpx 20rpx 0rpx rgba(174, 208, 245, 0.1);
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #289FFA;
			line-height: 26rpx;
		}
	}
</style>