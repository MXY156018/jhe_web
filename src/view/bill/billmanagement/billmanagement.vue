<template>
	<div>
		<div class="top">
			<el-row>
				<el-col class="left-row" :span="9" :offset="1">
					<div>
						<el-row style="height: 100px;line-height: 100px;">
							<el-col :span="12">
								<p style="font-size: 20px;">平台營收總數</p>
							</el-col>
							<el-col :span="12">
								<p style="font-size: 25px;color: #8f8f8f;">{{platformSumProfit}} JHE</p>
							</el-col>
						</el-row>
					</div>

				</el-col>
				<el-col class="right-row" :span="5" :offset="1">
					<div class="item">
						<p>日充幣總數： {{dailyRecharge}}  JHE</p>
					</div>
					<div class="item">
						<p>日提幣總數： {{dailyReward}}  JHE</p>
					</div>
					<div class="item">
						<p>日平台盈利： {{dailyPlatform}}  JHE</p>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="search">
			<el-form ref="searchForm" :inline="true" :model="searchInfo">
				<el-form-item label="ID">
					<el-input v-model="uid" placeholder="請輸入id號" />
				</el-form-item>
				<el-form-item label="时间">
					<el-date-picker v-model="date" type="daterange" unlink-panels range-separator="至"
						start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts" @change="getDate">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button size="mini" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
					<el-button size="mini" icon="el-icon-refresh" @click="onReset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table">
			<el-tabs v-model="activeName">
				<el-tab-pane label="充值記錄" name="first">
					<el-table :data="first_data" border show-summary :summary-method="getSummaries">
						<el-table-column align="center" label="時間" min-width="50" type="date">
							<template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
						</el-table-column>
						<el-table-column align="center" label="ID" min-width="50" prop="uid" />

						<el-table-column align="center" label="充值" min-width="50">
							<template #default="scope">{{ scope.row.num }}  JHE</template>
						</el-table-column>
					</el-table>
					<div class="gva-pagination">
						<el-pagination :current-page="page1" :page-size="pageSize1" :page-sizes="[10, 30, 50, 100]"
							:total="total1" layout="total, sizes, prev, pager, next, jumper"
							@current-change="handleCurrentChange1" @size-change="handleSizeChange1" />
					</div>

				</el-tab-pane>
				<el-tab-pane label="提幣記錄" name="second">
					<el-table :data="second_data" border show-summary :summary-method="getSummaries">
						<el-table-column align="center" label="時間" min-width="50" type="date">
							<template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
						</el-table-column>
						<el-table-column align="center" label="ID" min-width="50" prop="uid" />

						<el-table-column align="center" label="提幣" min-width="50">
							<template #default="scope">{{ scope.row.num }} JHE</template>
						</el-table-column>
					</el-table>
					<div class="gva-pagination">
						<el-pagination :current-page="page2" :page-size="pageSize2" :page-sizes="[10, 30, 50, 100]"
							:total="total2" layout="total, sizes, prev, pager, next, jumper"
							@current-change="handleCurrentChange2" @size-change="handleSizeChange2" />
					</div>
				</el-tab-pane>
				<el-tab-pane label="獎勵領取記錄" name="third">

					<el-table :data="third_data" border show-summary :summary-method="getSummaries">
						<el-table-column align="center" label="時間" min-width="50" type="date">
							<template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
						</el-table-column>
						<el-table-column align="center" label="ID (VIP)" min-width="50" prop="uid" />

						<el-table-column align="center" label="領取獎勵" min-width="50">
							<template #default="scope">{{ scope.row.num }} JHE</template>
						</el-table-column>
					</el-table>
					<div class="gva-pagination">
						<el-pagination :current-page="page3" :page-size="pageSize3" :page-sizes="[10, 30, 50, 100]"
							:total="total2" layout="total, sizes, prev, pager, next, jumper"
							@current-change="handleCurrentChange3" @size-change="handleSizeChange3" />
					</div>

				</el-tab-pane>
				<el-tab-pane label="遊戲盈利記錄" name="fourth">
						<el-table :data="four_data" border show-summary :summary-method="getSummaries">
						<el-table-column align="center" label="時間" min-width="50" type="date">
							<template #default="scope">{{ formatDate(scope.row.end_time) }}</template>
						</el-table-column>
						<el-table-column align="center" label="ID (VIP)" min-width="50" prop="uid" />

						<el-table-column align="center" label="遊戲盈利記錄" min-width="50">
							<template #default="scope">10 JHE</template>
						</el-table-column>
					</el-table>
					<div class="gva-pagination">
						<el-pagination :current-page="page4" :page-size="pageSize4" :page-sizes="[10, 30, 50, 100]"
							:total="total2" layout="total, sizes, prev, pager, next, jumper"
							@current-change="handleCurrentChange4" @size-change="handleSizeChange4" />
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import {
		getTable,
		getGame,
		getDailyBill,
		getSumProfit
	} from '@/api/bill'
	import {
		ElMessage
	} from 'element-plus'
	import infoList from '@/mixins/infoList'
	export default {
		name: "BillManagement",
		mixins: [infoList],
		data() {
			return {
				uid: '',
				date: "",
				start_time: '',
				end_time: '',
				activeName: 'first',
				searchInfo: {
					uid: '',
					startTime: '',
					endTime: ''
				},
				platformSumProfit:0,
				first_data: [],
				second_data: [],
				third_data: [],
				four_data: [],
				page: 1,
				total: 10,
				pageSize: 10,
				page1: 1,
				total1: 10,
				pageSize1: 10,
				page2: 1,
				total2: 10,
				pageSize2: 10,
				page3: 1,
				total3: 10,
				pageSize3: 10,
				page4: 1,
				total4: 10,
				pageSize4: 10,
				sum1:0,
				sum2:0,
				sum3:0,
				sum4:0,
				dailyRecharge:0,
				dailyReward:0,
				dailyPlatform:0,
				shortcuts: [{
						text: '最近一周',
						value: () => {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
							return [start, end]
						},
					},
					{
						text: '最近一个月',
						value: () => {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
							return [start, end]
						},
					},
					{
						text: '最近三个月',
						value: () => {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
							return [start, end]
						},
					},
				],
			}
		},
		created() {
			if (this.id == "") {
				this.searchInfo.uid = 0
			} else {
				this.searchInfo.uid = Number(this.uid)
			}
			this.getDaily()
			this.getOperate1(this.page, this.pageSize)
			this.getOperate2(this.page, this.pageSize)
			this.getOperate3(this.page, this.pageSize)
			this.getGameBill(this.page, this.pageSize)
			this.getSum()
		},
		methods: {
			async onSubmit() {
				if (this.uid == "") {
					this.searchInfo.uid = 0
				} else {
					this.searchInfo.uid = Number(this.uid)
				}
				this.getOperate1(this.page, this.pageSize)
				this.getOperate2(this.page, this.pageSize)
				this.getOperate3(this.page, this.pageSize)
				this.getGameBill(this.page, this.pageSize)
			},
			async getSum(){
				const res = await getSumProfit()
				this.platformSumProfit = res.data
			},
			async getOperate1(page, pageSize) {

				const res = await getTable({
					page: page,
					pageSize: pageSize,
					type: 1,
					...this.searchInfo
				})
				if (res.code == 0) {
					this.first_data = res.data.list
					this.page1 = res.data.page
					this.pageSize1 = res.data.pageSize
					this.total1 = res.data.total
					this.sum1 = res.data.sum
				}
			},
			async getOperate2(page, pageSize) {

				const res = await getTable({
					page: page,
					pageSize: pageSize,
					type: 2,
					...this.searchInfo
				})
				if (res.code == 0) {
					this.second_data = res.data.list
					this.page2 = res.data.page
					this.pageSize2 = res.data.pageSize
					this.total2 = res.data.total
					this.sum2 = res.data.sum
				}
			},
			async getOperate3(page, pageSize) {

				const res = await getTable({
					page: page,
					pageSize: pageSize,
					type: 3,
					...this.searchInfo
				})
				if (res.code == 0) {
					this.third_data = res.data.list
					this.page3 = res.data.page
					this.pageSize3 = res.data.pageSize
					this.total3 = res.data.total
					this.sum3 = res.data.sum
				}
			},
			async getGameBill(page, pageSize) {
			
				const res = await getGame({
					page: page,
					pageSize: pageSize,
					type: 3,
					...this.searchInfo
				})
				if (res.code == 0) {
					this.four_data = res.data.list
					this.page4 = res.data.page
					this.pageSize4 = res.data.pageSize
					this.total4 = res.data.total
					this.sum4 = res.data.sum
				}
			},
			getDate(val) {
				if (val[0] && val[1]) {
					this.start_time = this.$moment(val[0]).format("YYYY-MM-DD")
					this.end_time = this.$moment(val[1]).format("YYYY-MM-DD")

					this.searchInfo.startTime = this.start_time
					this.searchInfo.endTime = this.end_time
				}
			},
			
			onReset() {
				this.uid = ''
				this.start_time = ''
				this.end_time = ''
			},
			handleSizeChange1(val) {
				this.pageSize1 = val
				if (this.uid == "") {
					this.searchInfo.uid = 0
				} else {
					this.searchInfo.uid = Number(this.uid)
				}
				this.getOperate1(this.page1, this.pageSize1)
			},
			handleCurrentChange1(val) {
				this.page1 = val
				if (this.uid == "") {
					this.searchInfo.uid = 0
				} else {
					this.searchInfo.uid = Number(this.uid)
				}
				this.getOperate1(this.page1, this.pageSize1)
			},
			handleSizeChange2(val) {
				this.pageSize2 = val
				if (this.uid == "") {
					this.searchInfo.uid = 0
				} else {
					this.searchInfo.uid = Number(this.uid)
				}
				this.getOperate2(this.page2, this.pageSize2)
			},
			handleCurrentChange2(val) {
				this.page2 = val
				if (this.uid == "") {
					this.searchInfo.uid = 0
				} else {
					this.searchInfo.uid = Number(this.uid)
				}
				this.getOperate2(this.page2, this.pageSize2)
			},
			handleCurrentChange3(val) {
				this.page3 = val
				if (this.uid == "") {
					this.searchInfo.uid = 0
				} else {
					this.searchInfo.uid = Number(this.uid)
				}
				this.getOperate3(this.page3, this.pageSize3)
			},
			handleSizeChange3(val) {
				this.pageSize3 = val
				if (this.uid == "") {
					this.searchInfo.uid = 0
				} else {
					this.searchInfo.uid = Number(this.uid)
				}
				this.getOperate3(this.page3, this.pageSize3)
			},
			handleCurrentChange4(val) {
				this.page4 = val
				if (this.uid == "") {
					this.searchInfo.uid = 0
				} else {
					this.searchInfo.uid = Number(this.uid)
				}
				this.getGameBill(this.page4, this.pageSize4)
			},
			handleSizeChange4(val) {
				this.pageSize4 = val
				if (this.uid == "") {
					this.searchInfo.uid = 0
				} else {
					this.searchInfo.uid = Number(this.uid)
				}
				this.getGameBill(this.page4, this.pageSize4)
			},
			getSummaries(param) {
				var columns = param.columns
				var data = param.data
				const sums = []
				columns.forEach((column, index) => {
					
					if (index === 0) {
						sums[index] = '合计'
						return
					}
					if(index===1){
						sums[index] = 'N/A'
						return
					}
					if(this.activeName=="first"){
						sums[2]=this.sum1+"  JHE"
					}else if(this.activeName=="second"){
						sums[2]=this.sum2+"  JHE"
					}else if(this.activeName=="third"){
						sums[2]=this.sum3+"  JHE"
					}else if(this.activeName=="fourth"){
						sums[2]=this.sum4+"  JHE"
					}
					// sums[2] = 
					// const values = data.map((item) => Number(item[column.property]))
					// console.log(values)
					// if (!values.every((value) => isNaN(value))) {
					// 	sums[index] = `${values.reduce((prev, curr) => {
				 //        const value = Number(curr)
				 //        if (!isNaN(value)) {
				 //          return prev + curr
				 //        } else {
				 //          return prev
				 //        }
				 //      }, 0)}`
					// } else {
					// 	sums[index] = 'N/A'
					// }
				})

				return sums
			},
			async getDaily(){
				const res = await getDailyBill()
				if (res.code==0){
					this.dailyRecharge = res.data.recharge 
					this.dailyReward = res.data.reward 
					this.dailyPlatform = res.data.platform
				}
			}
		}
	}
</script>

<style lang="scss" scoped="">
	.top {
		margin: 10px;
		background-color: #fff;
		border-radius: 5px;
		text-align: center;

		.left-row {
			border: 2px solid #7f7f7f;
			border-radius: 4px;

		}

		.right-row {
			flex-direction: column;

			border: 2px solid #7f7f7f;
			border-radius: 4px;

			.item {
				padding: 6px 0px;
				height: 20px;

				p {
					align-items: center;
					height: 20px;
					width: 100%;
				}
			}
		}
	}

	.search {
		margin: 10px;
		background-color: #fff;
		padding: 24px;
	}

	.table {
		margin: 10px;
		background-color: #fff;
		padding: 24px;
	}
</style>
