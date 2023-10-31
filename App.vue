<script>
	import store from 'store/index.js'
	export default {
		onLaunch: function() {
			const that = this
			store.dispatch('getLangJson', that)
			store.dispatch('setEnums')
			store.dispatch('setUserInfo', that)
			console.log('App Launch')
			uni.addInterceptor('reLaunch', {
				success(res) {
					that.setTabarLang()
				}
			})
			uni.addInterceptor('navigateTo', {
				success(res) {
					that.setTabarLang()
				}
			})
			uni.addInterceptor('redirectTo', {
				success(res) {
					that.setTabarLang()
				}
			})
			uni.addInterceptor('switchTab', {
				success(res) {
					that.setTabarLang()
				}
			})
			setInterval(() => {
				that.setTabarLang()
			}, 1000)
		},
		onShow: function() {
			console.log('App Show')
			const that = this
			setInterval(() => {
				that.setTabarLang()
			}, 1000)
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			setTabarLang() {
				const that = this
				uni.setTabBarItem({
					index: 0,
					text: that.$t('app_home')
				})
				uni.setTabBarItem({
					index: 1,
					text: that.$t('app_add')
				})
				uni.setTabBarItem({
					index: 2,
					text:'R & S'
				})
				uni.setTabBarItem({
					index: 3,
					text: that.$t('app_my')
				})
			},
			setPageLang() {
				const that = this
			}
		}
	}
</script>

<style lang="scss">
	@import url(@/static/iconfont/iconfont.css);
	@import "@/uview-ui/index.scss";

	view,
	scroll-view,
	swiper,
	button,
	input,
	textarea,
	label,
	navigator,
	image {
		box-sizing: border-box;
	}

	button::after {
		border: none;
	}

	.container {
		width: 100%;
		font-size: 26rpx;
	}
	.placeholder-class{
		color: #c0c4cc;
	}
</style>
