<template>
	<view class="container">
		<view class="info-wrap">
			<u-cell-group>
				<u-cell-item title="简体中文" name="cn" :arrow="false" @click="handleClick('cn')">
					<u-icon v-if="key=='cn'" slot="right-icon" name="checkmark"></u-icon>
				</u-cell-item>
				<u-cell-item title="Malay" name="my" :arrow="false" @click="handleClick('my')">
					<u-icon v-if="key=='my'" slot="right-icon" name="checkmark"></u-icon>
				</text>
				</u-cell-item>
				<u-cell-item title="English" name="en" :arrow="false" @click="handleClick('en')">
					<u-icon v-if="key=='en'" slot="right-icon" name="checkmark"></u-icon>
				</text>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import utils from '../../utils/index.js'
	import user from '../../api/user.js'
	export default {
		data() {
			return {pagetitle: 'app_lang_setting',
				// key: 'cn'
			};
		},
		onLoad() {
			// this.key=this.$store.getters.getCurrentLang?.value
		},
		onReady() {
			uni.setNavigationBarTitle({
				title:this.$t('app_lang_setting')
			})
		},
		computed:{
			key:function(){
				return this.$store.getters.getCurrentLang?.value
			}
		},
		methods: {
			toJSON(){},
			handleClick(val) {
				const that=this
				let _data={
					lang:val
				}
				user.setLang(_data).then(res=>{
					console.log('setLang',res)
					that.$store.dispatch('setUserInfo',that)
					that.$i18n.locale=val
					utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
						uni.reLaunch({
							url:'/pages/index/index'
						})
					})
				}).catch(res => {
					utils.showmessage(that.$t(res)||that.$t('app_server_error'))
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

		.info-wrap {
			background-color: $uni-bg-color;
			width: 100%;
		}
	}
</style>
