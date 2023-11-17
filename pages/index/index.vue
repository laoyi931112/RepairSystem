<template>
	<view class="container">
		<view class="search-wrap">
			<view class="status-bar">
			</view>
			<view class="search-box">
				<u-search :placeholder="$t('app_enter_keyword')" v-model="keyword" :show-action="false"
					class="search-input" :height="50">
				</u-search>
				<view class="search-icon" style="color: #fff;padding-left: 12rpx;" @click="handleSearchClick">
					<u-icon name="search" size="50"></u-icon>
				</view>
				<!-- <view class="msg-icon" @tap.stop="toMessage">
					<u-icon name="bell" size="54"></u-icon>
					<u-badge size="mini" type="error" :is-dot="true" absolute :offset="[-2,4]"></u-badge>
				</view> -->
			</view>
		</view>
		<view class="status-bar">
		</view>
		<view class="swiper-wrap">
			<u-swiper v-if="carousel.length>0" :list="carousel" :title="true" height="320rpx" mode="dot"
				indicator-pos="bottomCenter" border-radius="12" circular @click="handleSwiperClick">
			</u-swiper>
		</view>
		<view class="data-wrap">
			<view class="tab-box">
				<u-tabs ref="tabs" name="name" :list="statusList" :is-scroll="true" height="96" :current="currentStatus"
					@change="handleSwitchStatus"></u-tabs>
			</view>
			<view class="sort-box">
				<view class="sort-item" @click="handleOrderByChange('create_time')"
					:class="orderByColumn=='create_time'?'sort-item-check':''">
					<view class="sort-desc">
						{{$t('app_create_date')}}
					</view>
					<view class="sort-icon">
						<u-icon name="arrow-up-fill" size="10"
							:color="orderByColumn=='create_time'?'sort-item-check':'#909399'"
							v-if="createTimeDir=='asc'"></u-icon>
						<u-icon name="arrow-down-fill" size="10"
							:color="orderByColumn=='create_time'?'sort-item-check':'#909399'"
							v-if="createTimeDir=='desc'">
						</u-icon>
					</view>
				</view>
				<view class="sort-item" @click="handleOrderByChange('exp_date')"
					:class="orderByColumn=='exp_date'?'sort-item-check':''">
					<view class="sort-desc">
						{{$t('app_expire_date')}}
					</view>
					<view class="sort-icon">
						<u-icon name="arrow-up-fill" size="10"
							:color="orderByColumn=='exp_date'?'sort-item-check':'#909399'" v-if="expDateDir=='asc'">
						</u-icon>
						<u-icon name="arrow-down-fill" size="10"
							:color="orderByColumn=='exp_date'?'sort-item-check':'#909399'" v-if="expDateDir=='desc'">
						</u-icon>
					</view>
				</view>
			</view>
			<view class="data-box">
				<view class="data-item" v-for="(item,index) in repairlist" :key="item.id" @click="toDetail(item)">
					<view class="left-box">
						<view class="info-wrap">
							<view class="info-img" :data-url="item.productItemImagesUrls[0]">
								<!-- @click="handleImageClick(item.productItemImagesUrls[0])" -->
								<u-image :src="item.productItemImagesUrls[0]" :show-loading="true" :show-error="true"
									width="130" height="130" borderRadius="24rpx">
								</u-image>
							</view>
							<view class="info-box">
								<!-- @click="toProductDetail(item.productItemId)" -->
								<view class="info-item u-line-2">
									<!-- 	{{$t('field_product_item_name')}}： -->
									<text style="color:#4C81EF;">{{item.productItemNames}}</text>
								</view>
								<!-- <view class="info-item">
									{{$t('field_product_item_sn')}}：{{item.productItemSn}}
								</view> -->
								<!-- 	<view class="info-item u-line-1 info-item-1">
									{{$t('def_warranty')}}ID：{{item.warrantyCode}}
								</view> -->
								<!-- <view class="info-item">
									{{$t('app_create_date')}}：{{item.createTimeStr}}
								</view> -->
								<view class="info-item u-line-1" v-if="item.warrantyType=='1'">
									{{$t('enum_crm_comp_type_brand')}}：<text
										style="color:#4C81EF;">{{item.brandCompName}}</text>
								</view>
								<view class="info-item" style="font-size: 24rpx;display: flex;flex-direction: column;">
									<text>{{$t('app_warranty_period')}}</text>
									<text>{{item.purDateStr}}-{{item.expDateStr}}</text>
								</view>
							</view>

						</view>
						<!-- 			{{item.warrantyType=='1'?item.warrantyStatusDesc:$t('app_offline')}} -->
						<view class="data-status">
							{{getstatus(item)}}
						</view>
					</view>
					<view class="right-box">
						<!-- <view class="right-box-1"> -->
						<!-- @click="toBrandDetail(item)" -->
						<!-- 	<view class="date-wrap">
								{{$t('enum_crm_comp_type_brand')}}：{{item.brandCompName}}
							</view>
						</view> -->
						<!-- <view class="right-box-1">
							<view class="date-wrap">
								{{$t('app_warranty_period')}}：{{item.purDateStr}}-{{item.expDateStr}}
							</view>
						</view> -->
						<!-- 			<view class="right-box-1">
							<view class="repair-user">
								{{$t('app_warranty_company')}}：{{item.distributorCompName}}
							</view>
							<view class="btn" v-if="false" @click="toDetail(item)">
								{{item.warrantyStatus=='0'?$t('op_edit'):$t('app_view')}}
							</view>
						</view> -->
					</view>
				</view>
				<u-empty :text="$t('app_no_data')" mode="list" v-if="repairlist.length==0"></u-empty>
			</view>
		</view>
		<view class="ad-wrap">
			<image :src="adimg" class="ad-img"></image>
		</view>
	</view>
</template>

<script>
	import common from '../../api/common.js'
	import utils from '../../utils/index.js'
	import product from '../../api/product.js'
	import wty from '../../api/wty.js'
	const app = getApp()
	export default {
		data() {
			return {
				pagetitle: '',
				keyword: '',
				carousel: [],
				statusList: [],
				currentStatus: 0,
				createTimeDir: 'desc',
				expDateDir: 'asc',
				orderByColumn: 'create_time', //排序字段
				orderByDir: 'desc', //desc
				pageNumber: 1,
				pageSize: 10,
				repairlist: [], //保修单
				adimg: require('../../static/ad@2x.jpg'),
				showad: true,
			}
		},
		onLoad() {},
		onReady() {
			console.log('index', app)
			this.statusList = [{
				name: this.$t('app_all'),
				code: '*'
			}, {
				name: this.$t('app_in_audit'),
				code: '0'
			}, {
				name: this.$t('app_under_guarantee'),
				code: '1'
			}, {
				name: this.$t('app_expire'),
				code: '2'
			}, {
				name: this.$t('app_offline'),
				code: '3'
			}]
		},
		onShow() {
			const that = this
			that.getShuffleInfo()
			that.pageNumber = 1
			that.repairlist = []
			that.pageQueryWarranty()
			setTimeout(() => {
				that.statusList = [{
					name: that.$t('app_all'),
					code: '*'
				}, {
					name: that.$t('app_in_audit'),
					code: '0'
				}, {
					name: that.$t('app_under_guarantee'),
					code: '1'
				}, {
					name: that.$t('app_expire'),
					code: '2'
				}, {
					name: that.$t('app_offline'),
					code: '3'
				}]
				app.setTabarLang()
			}, 2000)
		},
		onPullDownRefresh() {
			this.pageNumber = 1
			this.repairlist = []
			this.pageQueryWarranty()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500)
		},
		onReachBottom() {
			this.pageNumber += 1
			this.pageQueryWarranty()
		},
		methods: {
			toJSON() {},
			getstatus(item) {
				if (item?.warrantyType == '0') {
					return this.$t('app_offline')
				} else if (item?.warrantyType == '1' && item?.warrantyStatus == '1') {
					return this.$t('app_in_audit')
				} else if (item?.warrantyStatus == '2' && item?.auditResult == '2') {
					return this.$t('app_audit_refuse')
				} else if (item?.warrantyStatus == '2' && item?.auditResult == '1' && item?.expDate >= new Date()
					.getTime()) {
					return this.$t('app_under_guarantee')
				} else if (item?.warrantyStatus == '2' && item?.auditResult == '1' && item?.expDate < new Date()
					.getTime()) {
					return this.$t('app_expire')
				}
				return item?.warrantyStatusDesc
			},
			handleSearchClick() {
				uni.navigateTo({
					url: `/pages/search/search?keyword=${this.keyword}`
				})
			},
			handleImageClick(url) {
				uni.previewImage({
					current: 0,
					urls: [url]
				})
			},
			toProductDetail(id) {
				uni.navigateTo({
					url: `/pages/productdetail/productdetail?id=${id}`
				})
			},
			handleSwiperClick(index) {
				console.log('index', index)
				uni.navigateTo({
					url: `/pages/tenantnews/tenantnews?detail=${JSON.stringify(this.carousel[index].data)}`
				})
			},
			pageQueryWarranty() {
				const that = this
				let _data = {
					pageNumber: that.pageNumber,
					pageSize: that.pageSize
				}
				if (that.statusList[that.currentStatus]?.code && that.statusList[that.currentStatus]?.code != '*') {
					if (that.statusList[that.currentStatus]?.code == '0') {
						_data.warrantyTypeEQ = 1
						_data.warrantyStatusEQ = 1
					}
					if (that.statusList[that.currentStatus]?.code == '1') {
						_data.warrantyTypeEQ = 1
						_data.warrantyStatusEQ = 2
						_data.expDateGE = new Date().getTime()
					}
					if (that.statusList[that.currentStatus]?.code == '2') {
						_data.warrantyTypeEQ = 1
						_data.warrantyStatusEQ = 2
						_data.expDateLT = new Date().getTime()
					}
					if (that.statusList[that.currentStatus]?.code == '3') {
						_data.warrantyTypeEQ = 0
					}
					// _data.auditResultEQ = that.statusList[that.currentStatus]?.code
				}
				if (that.orderByColumn) {
					_data.sortColumn = that.orderByColumn
					_data.sortDir = that.orderByDir
				}
				wty.pageQueryWarranty(_data).then(res => {
					console.log('pageQueryWarranty', res)
					res?.pageResult?.list?.forEach(item => {
						item.createTimeStr = new Date(item.createTime).Format('dd/MM/yyyy')
						item.purDateStr = new Date(item.purDate).Format('dd/MM/yyyy')
						item.expDateStr = new Date(item.expDate).Format('dd/MM/yyyy')
						item.warrantyStatusKey = that.$store.state.enums?.ApplyStatusEnum?.find(t => t
							.value == item.warrantyStatus)?.textCode
						item.warrantyStatusDesc = that.$t('enum_common_apply_status_create')
						item.productItemNames = item.warrantyType == '0' ? item.customProductItemName :
							item.productItemName
						item.productItemImagesUrls = item.warrantyType == '0' ? item
							.customProductItemImagesUrl?.split(',') : item.productItemImagesUrl?.split(',')
						if (!item.productItemImagesUrls || item?.productItemImagesUrls?.length == 0) {
							item.productItemImagesUrls = []
						}
						console.log('item.productItemImagesUrls', item.productItemImagesUrls)
						if (item.warrantyStatusKey) {
							item.warrantyStatusDesc = that.$t(item.warrantyStatusKey)
						}
						that.repairlist.push(item)
					})
					console.log('that.repairlist', that.repairlist)
				})
			},
			getShuffleInfo() {
				const that = this
				let params = {}
				common.queryShuffleInfo(params).then(res => {
					console.log('queryShuffleInfo', res)
					that.carousel = []
					res?.list?.forEach(item => {
						that.carousel.push({
							image: item.thumbnailImagesUrl,
							title: item.infoTitle,
							data: item,
						})
					})
				}).catch(res => {
					console.error('error', res)
					if (res) {
						utils.showmessage(that.$t(res))
					}
				})
			},
			toMessage() {
				uni.navigateTo({
					url: '/pages/message/message'
				})
			},
			toDetail(obj) {
				console.log('obj', obj)
				// if(obj.warrantyStatus=='0'){
				// 	this.$store.state.tempobj=JSON.stringify(obj)
				// 	console.log('this.$store.state.tempobj',this.$store.state.tempobj)
				// 	uni.switchTab({
				// 		url: `/pages/addrepair/addrepair`
				// 	})
				// }else{
				uni.navigateTo({
					url: `/pages/repairdetail/repairdetail?obj=${JSON.stringify(obj)}`
				})
				// }
			},
			toBrandDetail(obj) {
				uni.navigateTo({
					url: `/pages/tenantdetail/tenantdetail?id=${obj.brandCompId}`
				})
			},
			handleSwitchStatus(index) {
				if (this.currentStatus != index) {
					this.currentStatus = index
					this.pageNumber = 1
					this.repairlist = []
					this.pageQueryWarranty()
				}
			},
			handleOrderByChange(column) {
				this.orderByColumn = column
				this.orderByDir = this.orderByDir == 'asc' ? 'desc' : 'asc'
				if (column == 'create_time') {
					this.createTimeDir = this.orderByDir
				} else if (column == 'exp_date') {
					this.expDateDir = this.orderByDir
				}
				this.pageNumber = 1
				this.repairlist = []
				this.pageQueryWarranty()
			},
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: $uni-bg-color;
		min-height: 100vh;
		padding: 0rpx 0rpx 150rpx 0rpx;
		width: 100%;
		font-size: 26rpx;

		.status-bar {
			height: var(--status-bar-height);
			width: 100%;
		}

		.search-wrap {
			width: 100%;
			display: flex;
			flex-direction: column;
			background-color: #4C81EF;
			padding: 12rpx 32rpx;
			position: fixed;
			top: 0rpx;
			left: 0rpx;
			z-index: 9999999;



			.search-box {
				width: 100%;
				display: inline-flex;
				justify-content: space-between;
				align-items: flex-end;

				.search-input {
					flex: 1;
				}

				.msg-icon {
					width: 64rpx;
					height: 50rpx;
					display: inline-flex;
					justify-content: center;
					align-items: center;
					position: relative;
					color: #fff;
				}
			}
		}

		.swiper-wrap {
			width: 100%;
			padding: 24rpx;
			margin-top: 60rpx;
		}

		.data-wrap {
			width: 100%;

			.tab-box {
				width: 100%;
				color: #666666;
				padding: 12rpx 0rpx;

				::v-deep .u-tabs__wrapper__nav__item {
					flex: 1;
				}
			}

			.sort-box {
				width: 100%;
				display: inline-flex;
				justify-content: space-between;
				align-items: center;
				padding: 0rpx 24rpx;

				.sort-item-check {
					color: #4C81EF;

					::v-deep .u-icon__icon {
						color: #4C81EF !important;
					}
				}

				.sort-item {
					flex: 1;
					display: inline-flex;
					justify-content: center;
					align-items: center;
					padding: 12rpx 20rpx;
					background-color: #EFEFEF;

					&:last-child {
						margin-left: 14rpx;
					}

					.sort-desc {
						padding: 0rpx 12rpx;
					}

					.sort-icon {
						display: flex;
						flex-direction: column;
					}
				}
			}

			.data-box {
				width: 100%;
				padding: 24rpx;

				.data-item {
					width: 100%;
					padding: 24rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					background-color: #fff;
					margin-bottom: 32rpx;
					box-shadow: -1px 8px 20px 0px rgba(56, 108, 171, 0.1);
					border-radius: 12rpx;

					.left-box {
						width: 100%;
						display: inline-flex;
						justify-content: space-between;
						align-items: flex-start;
						position: relative;

						.info-wrap {
							flex: 1;
							width: 0;
							display: inline-flex;
							align-items: flex-start;

							.info-img {
								width: 150rpx;
								height: 150rpx;
								flex-shrink: 0;
								display: inline-flex;
								justify-content: center;
								align-items: center;
							}

							.info-box {
								flex: 1;
								padding: 0rpx 6rpx;
								flex-grow: 1;
								display: flex;
								flex-direction: column;
								align-items: flex-start;
								justify-content: flex-start;

								.info-item {
									padding-bottom: 10rpx;
									font-size: 28rpx !important;
									font-weight: 500;
									color: #808080;
									width: 100%;
									padding-left: 10rpx;
									// height: 84rpx;
								}

								.info-item-1 {
									color: #808080 !important;
								}

								.u-line-1 {
									font-size: 30rpx;
									font-weight: 500;
									color: #333333;
								}
							}
						}

						.data-status {
							font-size: 26rpx !important;
							font-weight: 500;
							color: #4C81EF !important;
							flex-shrink: 0;
							position: absolute;
							right: 0rpx;
						}
					}

					.right-box {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: flex-end;
						padding: 8rpx 0rpx 0rpx 0rpx;

						.right-box-1 {
							width: 100%;
							display: inline-flex;
							justify-content: space-between;
							align-items: center;
							font-size: 24rpx;
							font-weight: 500;
							color: #A6A6A6;

							.date-wrap {
								padding: 6rpx 0rpx;
							}

							.btn {
								border: 2rpx solid #999999;
								border-radius: 20rpx;
								font-size: 24rpx;
								font-weight: 500;
								color: #A6A6A6;
								padding: 2rpx 14rpx;
								min-width: 120rpx;
								display: inline-flex;
								justify-content: center;
								align-items: center;
							}
						}

					}
				}
			}
		}

		.ad-wrap {
			width: 100%;
			position: fixed;
			left: 0rpx;
			bottom: 0rpx;
			height: 150rpx;
			background-color: #fff;
			box-shadow: 14px 0px 20px 0px rgba(56, 108, 171, 0.1);

			.ad-img {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>