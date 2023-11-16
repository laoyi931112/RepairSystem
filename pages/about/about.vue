<template>
	<view class="container">
		<view class="info-wrap">
			<view class="info-logo">
				<u-icon name="photo-fill" class="info-icon"></u-icon>
			</view>
			<view class="info-list">
				<u-cell-group>
					<u-cell-item :title="$t('app_user_agreement')" @click="toDetail('agreement')">
					</u-cell-item>
					<!-- 		<u-cell-item :title="$t('app_privacy_agreement')" @click="toDetail('privacy')"></text>
					</u-cell-item> -->
					<!-- 		<u-cell-item title="更新日志" @click="toDetail('applog')"></text>
					</u-cell-item> -->
				</u-cell-group>
			</view>
		</view>
		<view class="info-version">
			v 1.0.49
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pagetitle: ''
			};
		},
		methods: {
			toJSON() {},
			toDetail(key) {
				if (key == 'applog') {
					uni.navigateTo({
						url: `/pages/applog/applog`
					})
				} else {
					uni.navigateTo({
						url: `/pages/article/article?type=${key}`
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: $u-bg-color;
		padding-bottom: 96rpx;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

		.info-wrap {
			width: 100%;

			.info-logo {
				width: 100%;
				min-height: 500rpx;
				display: inline-flex;
				justify-content: center;
				align-items: center;

				.info-icon {
					font-size: 320rpx;
				}
			}

			.info-list {
				background-color: $uni-bg-color;
				width: 100%;
			}
		}
	}
</style>
