<template>
	<view class="container">
		<view class="info-wrap">
			<view class="info-box">
				<u-cell-group>
					<!-- 	<u-cell-item title="ID:23333" :arrow="false">
					</u-cell-item> -->
					<u-cell-item :title="$t('app_phone_number')" :value="phone?'+60 '+phone:''" @click="toUpdatePhone">
					</u-cell-item>
					<u-cell-item :title="$t('app_modify_password')" @click="toUpdatePassword">
					</u-cell-item>
				</u-cell-group>
			</view>
			<view class="info-box">
				<u-cell-group>
					<u-cell-item :title="$t('app_lang')"
						:value="currentLang.label?currentLang.label:$t('app_follow_system')" @click="toLanguage">
					</u-cell-item>
					<u-cell-item :title="$t('app_about_us')" @click="toAbout">
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>
		<view class="info-btn">
			<u-button @click="handleLogout">{{$t('app_logout')}}</u-button>
		</view>
	</view>
</template>

<script>
	import user from '../../api/user.js'
	import utils from '../../utils/index.js'
	export default {
		data() {
			return {
				pagetitle: 'app_settings',
				currentLang: {
					label:'',
					value:'',
				}
			};
		},
		onReady() {
			const that = this
			uni.setNavigationBarTitle({
				title: that.$t('app_settings')
			})
		},
		watch: {
			'$store.state.userInfo': {
				handler(newval,oldval){
					this.currentLang = this.$store.getters.getCurrentLang
					console.log('currentLang',this.currentLang)
				},
				immediate:true,
				deep:true
			}
		},
		computed:{
			username:function(){
				return this.$store.state.userInfo?.userName
			},
			phone:function(){
				return this.$store.state.userInfo?.userTel
			},
			email:function(){
				return this.$store.state.userInfo?.userEmail
			},
			avatarurl:function(){
				let checkSex = this.$store.state.userInfo.userGender ? this.$store.state.userInfo.userGender : '1'
				return this.$store.state.userInfo?.profileImageUrl?this.$store.state.userInfo?.profileImageUrl:(checkSex == '1' ? this.manimgs : this.womanimg)
			}
		},
		methods: {
			toJSON() {},
			handleLogout() {
				const that = this
				user.logout({}).then(res => {
					that.$store.dispatch('setUserStatusInfo', res?.data)
					// utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
					// 	uni.reLaunch({
					// 		url: '/pages/login/login'
					// 	})
					// })
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}).catch(res => {
					if (res) {
						utils.showmessage(that.$t(res))
					}
				})
			},
			toUpdatePhone() {
				uni.navigateTo({
					url: `/pages/updatephone/updatephone`
				})
			},
			toUpdatePassword() {
				uni.navigateTo({
					url: `/pages/updatepassword/updatepassword`
				})
			},
			toLanguage() {
				uni.navigateTo({
					url: `/pages/language/language`
				})
			},
			toAbout() {
				uni.navigateTo({
					url: `/pages/about/about`
				})
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
			display: flex;
			flex-direction: column;

			.info-box {
				margin-bottom: 18rpx;
				background-color: $uni-bg-color;
			}
		}
	}
</style>
