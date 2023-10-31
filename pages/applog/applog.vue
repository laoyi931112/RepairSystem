<template>
	<view class="container">
		<u-table>
			<u-tr>
				<u-th>日期</u-th>
				<u-th>更新项</u-th>
			</u-tr>
			<u-tr>
				<u-td>20230401</u-td>
				<u-td>ui已全部修改</u-td>
			</u-tr>
			<u-tr>
				<u-td>20230323</u-td>
				<u-td>接口已全部对接，ui部分修改</u-td>
			</u-tr>
		</u-table>
	</view>
</template>

<script>
	export default {
		data() {
			return {
pagetitle: '',
			};
		},
		methods:{
			toJSON(){},
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding: 32rpx;
	}
</style>
