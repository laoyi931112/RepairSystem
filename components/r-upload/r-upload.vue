<template>
	<u-upload :upload-text="uploadtext" :action="action" :max-count="maxcount" :header="headers"
		:file-list="filelist" @on-uploaded="onUploaded" ref="myupload" :width="width" :height="height" :disabled="disabled" :deletable="deletable"></u-upload>
</template>

<script>
	import common from '../../api/common.js'
	import utils from '../../utils/index.js'
	export default {
		props: {
			uploadtext: {
				type: String,
				default: ''
			},
			maxcount: {
				type: Number,
				default: 98
			},
			value: Array,
			width:{
				type: Number,
				default: 200
			},
			height :{
				type: Number,
				default: 200
			},
			disabled:{
				type:Boolean,
				default:false
			},
			deletable:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				action: '', //图片上传地址
				headers: {}, //
			}
		},
		computed: {
			filelist: function() {
				let _files = this.value?.map(item => {
					return {
						url: item
					}
				})
				if(_files?.length==0){
					this.$refs?.myupload?.clear()
				}
				console.log('_files', _files,this.$refs)
				return _files
			}
		},
		mounted() {
			let uploadfile = common.getUploadConfig()
			this.action = uploadfile.url
			this.headers = uploadfile.headers
		},
		methods: {
			onUploaded(lists) {
				console.log('onUploaded', lists)
				let imgs = [],
					temp_imgs = []
				for (let i = 0; i < lists.length; i++) {
					if (lists[i].error == false) {
						if (lists[i].response) {
							if (lists[i].response?.resultCode == 200 && lists[i].response.data) {
								imgs.push(lists[i]?.response?.data)
							}
						} else if (lists[i].url) {
							imgs.push(lists[i].url)
						}
					}
				}
				this.$refs.myupload.clear()
				this.$emit('update:value', imgs)
			},
		}
	}
</script>

<style>
	::v-deep .u-delete-icon{
		width: 32rpx;
		height: 32rpx;
		top: 2rpx;
		right: 2rpx;
	}
</style>
