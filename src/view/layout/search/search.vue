<template>
	<div class="search-component">
		<transition name="el-fade-in-linear">
			<div v-show="show" class="transition-box" style="display: inline-block; ">
				<el-select ref="search-input" v-model="value" filterable placeholder="请选择" @blur="hiddenSearch"
					@change="changeRouter">
					<el-option v-for="item in routerList" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</div>
		</transition>
		<div v-if="btnShow" class="user-box">
			<i class="el-icon-refresh reload" :class="[reload ? 'reloading' : '']" @click="handleReload" />
		</div>
		<div v-if="btnShow" class="user-box">
			<i class="el-icon-search search-icon" @click="showSearch()" />
		</div>
		<div v-if="btnShow" class="user-box">
			<el-badge :hidden="messageValue>0?false:true" :value="messageValue" type ='danger'  class="item">
				<i class="el-icon-message message" @click="handleMessage"/>
			</el-badge>
		</div>
		<audio ref="audioRef" style="display: none;" muted>
			<source src="../../../assets/14430.wav">
			您的浏览器不支持 audio 元素。
		</audio>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		emitter
	} from '@/utils/bus'
	import {
		getNewMessage
	} from "@/api/message"
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	export default {
		name: 'SearchComponent',
		data() {
			return {
				muted: true,
				prevalue: 0,
				value: '',
				show: false,
				btnShow: true,
				reload: false,
				messageValue: 0,
				timer: null,
				click: false
			}
		},
		computed: {
			...mapGetters('router', ['routerList'])
		},
		created() {
			this.timer = window.setInterval(() => {
				setTimeout(async () => {
					const res = await getNewMessage()
					if (res.code == 0) {
						this.messageValue = res.data
						if (this.messageValue > this.prevalue) {
							this.pushMessage()
						}
						this.prevalue = this.messageValue
					}
				}, 0)
			}, 5000);
		},
		destroyed() {
			window.clearInterval(this.timer)
			// clearInterval(this.timer)
		},
		methods: {
			changeRouter() {
				this.$router.push({
					name: this.value
				})
				this.value = ''
			},
			handleMessage(){
				this.$router.push({
					name: "feedbacklist"
				})
			},
			hiddenSearch() {
				this.show = false
				setTimeout(() => {
					this.btnShow = true
				}, 500)
			},
			showSearch() {
				this.btnShow = false
				this.show = true
				this.$nextTick(() => {
					this.$refs['search-input'].focus()
				})
			},
			handleReload() {
				this.reload = true
				emitter.emit('reload')
				setTimeout(() => {
					this.reload = false
				}, 500)
				window.clearInterval(this.timer)
				this.timer = window.setInterval(() => {
					setTimeout(async () => {
						const res = await getNewMessage()
						if (res.code == 0) {
							this.messageValue = res.data
							if (this.messageValue > this.prevalue) {
								this.pushMessage("新未读消息")
							}
							this.prevalue = this.messageValue
						}
					}, 0)
				}, 5000);
			},
			pushMessage(message) {
				if (this.$refs.audioRef.muted && !this.click) {
					ElMessageBox.confirm(
							'消息通知只允许静音自动播放，是否开启声音',
							'Warning', {
								confirmButtonText: '是',
								cancelButtonText: '否',
								type: 'warning',
							}
						)
						.then(() => {
							this.$refs.audioRef.muted = false
							ElMessage({
								type: 'success',
								message: '通知声音已开启',
								center:true
							})
						})
						.catch(() => {
							this.click = true
							ElMessage({
								type: 'warning',
								message: '通知声音未开启，消息通知将静音',
								center:true
							})
						})
				} else {
					this.$refs.audioRef.load()
					this.$refs.audioRef.play()
				}

				ElMessage({
					message: "您有新的消息",
					type: 'info',
					center: true,
				})
			},



		}
	}
</script>
<style scoped lang="scss">
	.reload {
		font-size: 18px;
	}

	.message {
		font-size: 18px;
	}

	.reloading {
		animation: turn 0.5s linear infinite;
	}

	@keyframes turn {
		0% {
			-webkit-transform: rotate(0deg);
		}

		25% {
			-webkit-transform: rotate(90deg);
		}

		50% {
			-webkit-transform: rotate(180deg);
		}

		75% {
			-webkit-transform: rotate(270deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
		}
	}
</style>
