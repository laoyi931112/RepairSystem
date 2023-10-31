<template>
	<view class="container" v-html="content">
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pagetitle: '',
				content: ''
			};
		},
		onLoad(option) {
			const that = this
			if (option.type == "agreement") {
				that.pagetitle = 'app_user_agreement'
				that.content = that.$t('app_user_agreement_content')
				uni.setNavigationBarTitle({
					title: that.$t('app_user_agreement')
				})
			}
			if (option.type == "privacy") {
				that.content = that.$t('app_privacy_agreement_content')
				that.pagetitle = 'app_privacy_agreement'
				uni.setNavigationBarTitle({
					title: that.$t('app_privacy_agreement')
				})
			}
		},
		methods: {
			toJSON() {},
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: $u-bg-color;
		min-height: 100vh;
		padding: 32rpx;
	}
</style>
