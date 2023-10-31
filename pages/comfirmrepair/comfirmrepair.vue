<template>
	<view class="container">
		<view class="search">
			<!-- <view class="info-desc">
				{{$t('field_product_item_sn')}}
			</view> -->
			<view class="info-value">
				<u-input class="info-input" :placeholder="$t('app_product_keyword')" @blur="handleFocus"></u-input>
			</view>
		</view>
		<view class="info-wrap">
			<view class="info-item" v-for="(item,index) in productlist" :key="item.id"
				:class="item.check==true?'info-item-check':''" @click="handleCheckProduct(index)">
				<view class="info-img">
					<u-image class="info-icon" :src="item.itemImagesUrls[0]" :show-loading="true" :show-error="true" width="140" height="140">
					</u-image>
				</view>
				<view class="info-box">
					<view class="info-box-desc" style="font-size: 28rpx;font-weight: 550;">
						{{$t('field_product_item_name')}}：{{item.itemName}}
					</view>
					<view class="info-box-desc">
						{{$t('field_product_item_model')}}：{{item.itemModel}}
					</view>
					<view class="info-box-desc">
						{{$t('field_product_item_sn')}}：{{item.itemSn}}
					</view>
				<!-- 	<view class="info-box-desc u-line-1">
						{{$t('field_product_item_desc')}}：<text v-html="item.itemDesc"></text>
					</view> -->
					<view class="info-box-desc">
						{{$t('enum_crm_comp_type_brand')}}：{{item.brandCompId}}
					</view>
					<view class="info-box-desc">
						{{$t('field_product_item_warranty_period')}}：{{item.warrantyPeriod}}
					</view>
					
				</view>
			</view>
			<u-empty :text="$t('app_no_data')" mode="list" v-if="productlist.length==0"></u-empty>
		</view>
		<view class="info-btns">
			<u-button v-if="false" type="primary" @click="saveRepairClick" class="info-btn">{{$t('op_save')}}</u-button>
			<u-button type="primary" @click="addRepair" class="info-btn">{{$t('op_submit')}}</u-button>
		</view>
	</view>
</template>

<script>
	import crm from '../../api/crm.js'
	import product from '../../api/product.js'
	import wty from '../../api/wty.js'
	import utils from '../../utils/index.js';
	export default {
		data() {
			return {pagetitle: 'app_new_warranty',
				id:'',
				detail:{},
				repairObj: {},
				brands: [], //品牌id列表
				productlist: [], //产品
				pageindex: 1,
				pagesize: 10,
			};
		},
		onLoad(options) {
			const that = this
			if (options.obj) {
				that.repairObj = JSON.parse(options.obj)
				that.id=that.repairObj?.id
				that.detail=that.repairObj?.detail
				that.queryBrandCompId(that.repairObj.compinfo.id)
			} else {
				uni.navigateBack()
			}
		},
		onReady() {
			uni.setNavigationBarTitle({
				title:this.$t('app_new_warranty')
			})
		},
		methods: {
			toJSON(){},
			saveRepairClick() {
				const that = this
				let check_index = that.productlist.findIndex(t => t.check == true)
				if (check_index == -1) {
					utils.showmessage(that.$t('err_required_product'))
					return
				}
				let product=that.productlist[check_index]
				let _data = {
					productItemId:product?.id,
					warrantyImagesUrl: that.repairObj?.imgs?.join(','),
					distributorCompId: that.repairObj?.compinfo?.id,
					purDate: that.repairObj?.buydate,
					warrantyRemark:that.repairObj?.remark
				}
				if (that.id) {
					_data.id = that.id
				}
				wty.saveWarrantyOnline(_data).then(res => {
					console.log('saveWarrantyOnline', res)
					if (res.resultCode == 200) {
						utils.showmessage(that.$t('enum_sys_cert_status_success')).then(() => {
							uni.switchTab({
								url: '/pages/index/index'
							})
						})
					}
				}).catch(res => {
					utils.showmessage(that.$t(res) || that.$t('app_server_error'))
				})
			},
			saveRepair() {
				const that = this
				let check_index = that.productlist.findIndex(t => t.check == true)
				if (check_index == -1) {
					utils.showmessage(that.$t('err_required_product'))
					return
				}
				let product=that.productlist[check_index]
				let _data={
					distributorCompId:that.repairObj?.compinfo?.id,
					productItemId:product?.id,
					purDate:that.repairObj?.buydate,
					warrantyImagesUrl:that.repairObj?.imgs?.join(',')
				}
				if(that.id){
					_data.id=that.id
				}
				wty.saveWarranty(_data).then(res=>{
					console.log('saveWarranty',res)
					if(res.resultCode==200){
						utils.showmessage(that.$t('enum_sys_cert_status_success'))
						uni.switchTab({
							url: '/pages/index/index'
						})
					}
				}).catch(res=>{
					utils.showmessage(that.$t(res)||that.$t('app_server_error'))
				})
			},
			addRepair() {
				const that = this
				let check_index = that.productlist.findIndex(t => t.check == true)
				if (check_index == -1) {
					utils.showmessage(that.$t('err_required_product'))
					return
				}
				let product=that.productlist[check_index]
				let _data={
					productItemId:product?.id,
					warrantyImagesUrl: that.repairObj?.imgs?.join(','),
					distributorCompId: that.repairObj?.compinfo?.id,
					purDate: that.repairObj?.buydate,
					warrantyRemark:that.repairObj?.remark
				}
				if(that.id){
					_data.id=that.id
				}
				wty.saveWarrantyOnline(_data).then(res=>{
					console.log('submitWarranty',res)
					if(res.resultCode==200){
						utils.showmessage(that.$t('enum_sys_cert_status_success'))
uni.switchTab({
							url: '/pages/index/index'
						})
					}
				}).catch(res=>{
					utils.showmessage(that.$t(res)||that.$t('app_server_error'))
				})
			},
			queryBrandCompId(id) {
				const that = this
				let _data = {
					childCompIdEQ: id
				}
				crm.queryBrandCompId(_data).then(res => {
					console.log('queryBrandCompId', res)
					that.brands = res?.list
				})
			},
			pageQueryItem(val) {
				const that = this
				let _data = {
					keyword: val,
					brandCompIdIN: that.brands,
					pageNumber: that.pageindex,
					pageSize: that.pagesize
				}
				product.pageQueryItem(_data).then(res => {
					console.log('pageQueryItem', res)
					res?.pageResult?.list?.forEach(item => {
						item.check = false
						item.itemImagesUrls=item.itemImagesUrl?.split(',')
						that.productlist.push(item)
					})
				})
			},
			handleFocus(val) {
				console.log('handleFocus', val)
				const that = this
				that.productlist = []
				that.pageindex = 1
				if (val) {
					that.pageQueryItem(val)
				}
			},
			handleCheckProduct(index) {
				const that = this
				let check_index = that.productlist.findIndex(t => t.check == true)
				if (check_index != -1) {
					that.productlist[check_index].check = false
				}
				that.productlist[index].check = true
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
		padding: 32rpx 32rpx;
		background-color: $uni-bg-color;

		.search {
			width: 100%;
			display: inline-flex;
			align-items: center;
			border-bottom: 2rpx solid $u-border-color;
			background-color: $uni-bg-color;
			padding: 0rpx 32rpx;
			position: fixed;
			z-index: 9;

			.info-desc {
				padding-right: 24rpx;
			}

			.info-value {
				flex: 1;

				.info-input {
					width: 100%;
				}
			}
		}

		.info-wrap {
			width: 100%;
			padding-top: 88rpx;

			.info-item-check {
				border: 2rpx solid $uni-color-warning;
			}

			.info-item {
				display: inline-flex;
				align-items: center;
				width: 100%;
				background-color: $uni-bg-color;
				border-radius: 12rpx;
				margin-bottom: 24rpx;
				.info-desc {
					padding-right: 24rpx;
					font-size: 24rpx;
					color: #8C8C8C;
				}

				.info-value {
					flex: 1;

					.info-input {
						width: 100%;
					}
				}

				.info-img {
					width: 180rpx;
					height: 180rpx;
					display: inline-flex;
					justify-content: center;
					align-items: center;
					flex-shrink: 0;

					.info-icon {
						width: 140rpx;
						height: 140rpx;
						display: inline-flex;
						justify-content: center;
						align-items: center;
					}
				}

				.info-box {
					flex: 1;
					display: flex;
					flex-direction: column;
					padding: 12rpx;

					.info-box-desc {
						width: 100%;
						height: 44rpx;
						padding-bottom: 10rpx;
						display: inline-flex;
						overflow-y: hidden;
					}
				}
			}
		}
.info-btns{
	position: fixed;
	bottom: 48rpx;
	left: 0rpx;
	width: 100%;
	display: flex;
	gap: 24rpx;
	flex-direction: row;
	justify-content: center;
	padding: 24rpx;
	.info-btn {
		border-radius: 24rpx;
	width: 331rpx;
	}
}
		
	}
</style>
