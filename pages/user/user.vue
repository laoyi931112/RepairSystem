<template>
	<page-meta>
		<navigation-bar :title="$t('app_personal_center')" background-color="#F8F8F8" front-color="#000000"></navigation-bar>
	</page-meta>
	<view class="container">
		<view class="user-wrap">
			<view class="user-box">
				<view class="user-avatar">
						<u-image class="user-avatar-icon" :src="avatarurl" :show-loading="true" :show-error="true"
							width="120" height="120" shape="circle">
						</u-image>
					</image>
				</view>
				<view class="user-info">
					<view class="user-info-item user-nickname">
						{{username?username:$t('app_not_yet_filled_in')}}
					</view>
					<view class="user-info-item user-phone">
						{{$t('field_phone')}}：+60 {{phone?phone:$t('app_not_yet_filled_in')}}
					</view>
					<view class="user-info-item user-email">
						{{$t('field_email')}}：{{email?email:$t('app_not_yet_filled_in')}}
					</view>
				</view>
				<view class="edit-box" @click="toPerfectInfo">
					<text class="iconfont laoyi-icon-bianji user-bianji-icon"></text>
					<text>{{$t('op_edit')}}</text>
				</view>
			</view>
		</view>
		<view class="link-wrap">
			<u-cell-group>
				<u-cell-item :title="$t('app_maintain_records')" @click="toRepairLog('w')">
					<text class="iconfont laoyi-icon-bijijilu link-icon" slot="icon"></text>
				</u-cell-item>
		<!-- 		<u-cell-item :title="$t('app_draft')" @click="toNoteLog"><text class="iconfont laoyi-icon-caogao link-icon"
						slot="icon"></text>
				</u-cell-item> -->
	<!-- 			<u-cell-item :title="$t('app_nearby_maintain')" @click="toTenantList"><text class="iconfont laoyi-icon-wxbdingwei link-icon"
						slot="icon"></text>
				</u-cell-item> -->
				<u-cell-item :title="$t('app_settings')" @click="toSetting"><text class="iconfont laoyi-icon-shezhi link-icon"
						slot="icon"></text>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {pagetitle: 'app_personal_center',
				manimgs: require('../../static/head_man@2x.png'),
				womanimgs: require('../../static/head_woman@2x.png')
			};
		},
		onLoad(options) {
			
		},
		onShow() {
		},
		onReady() {
			// uni.setNavigationBarTitle({
			// 	title:this.$t('app_personal_center')
			// })
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
			toPerfectInfo() {
				uni.navigateTo({
					url: `/pages/perfectinfo/perfectinfo`
				})
			},
			toSetting() {
				uni.navigateTo({
					url: `/pages/setting/setting`
				})
			},
			toRepairLog(key) {
				uni.navigateTo({
					url: `/pages/repairlog/repairlog?key=${key}`
				})
			},
			toNoteLog() {
				uni.navigateTo({
					url: `/pages/notelog/notelog`
				})
			},
			toTenantList() {
				uni.navigateTo({
					url: `/pages/tenantlist/tenantlist`
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

		.user-wrap {
			width: 100%;
			padding: 24rpx;
			display: inline-flex;
			justify-content: space-between;
			align-items: center;

			.user-box {
				width: 100%;
				height: 290rpx;
				display: inline-flex;
				justify-content: space-between;
				align-items: center;
				background: linear-gradient(-45deg, #446FE0 0%, #548EEB 100%);
				border-radius: 18rpx;

				.user-avatar {
					width: 150rpx;
					height: 150rpx;
					margin-left: 48rpx;
					display: inline-flex;
					align-items: center;
					justify-content: center;

					.user-avatar-icon {
						font-size: 72rpx;
						width: 120rpx;
						height: 120rpx;
						// border-radius: 50%;
						display: inline-flex;
						align-items: center;
						justify-content: center;
					}
				}

				.user-info {
					flex: 1;
					color: $uni-text-color-inverse;

					.user-info-item {
						padding-bottom: 12rpx;
					}
				}

				.edit-box {
					height: 100%;
					padding: 24rpx;
					color: $uni-text-color-inverse;
					.user-bianji-icon {
						font-size: 28rpx;
						margin-right: 12rpx;
					}
				}

			}
		}

		.link-wrap {
			width: 100%;
			flex: 1;
			background-color: #fff;
			margin-top: 24rpx;

			.link-icon {
				font-size: 32rpx;
				margin-right: 12rpx;
			}
		}
	}
</style>
