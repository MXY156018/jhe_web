<template>
	<div>
		<div class="top">
			<el-row>
				<el-col class="left-row" :span="10" :offset="1">
					<div>
						<el-row style="height: 80px;line-height: 80px;">
							<el-col :span="12">
								<p style="font-size: 20px;">今日提幣用戶總數：</p>
							</el-col>
							<el-col :span="12">
								<p style="font-size: 25px;color: #8f8f8f;">{{todayNum}} 人</p>
							</el-col>
						</el-row>
					</div>

				</el-col>
				<el-col class="right-row" :span="10" :offset="1">
					<el-row style="height: 80px;line-height: 80px;">
						<el-col :span="12">
							<p style="font-size: 20px;">今日提幣總數：</p>
						</el-col>
						<el-col :span="12">
							<p style="font-size: 25px;color: #8f8f8f;">{{todayTotal}} JHE</p>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</div>
		<div class="gva-search-box">
			<el-form ref="searchForm" :inline="true" :model="searchInfo">
				<el-form-item label="ID">
					<el-input v-model="uid" placeholder="請輸入id號" />
				</el-form-item>
				<el-form-item label="時間">
					<el-date-picker v-model="date" type="daterange" unlink-panels range-separator="至"
						start-placeholder="開始時間" end-placeholder="結束時間" :shortcuts="shortcuts" @change="getDate">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="狀態">
					<el-select v-model="searchInfo.status" clearable placeholder="請選擇">
						<el-option label="全部" value="" />
						<el-option label="未審核" value="0" />
						<el-option label="審核中" value="1" />
						<el-option label="審核完成" value="2" />
						<el-option label="審核失敗" value="3" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="mini" type="primary" icon="el-icon-search" @click="onSubmit">查詢</el-button>
					<el-button size="mini" icon="el-icon-refresh" @click="onReset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="gva-table-box">
			<div class="gva-btn-list">
				<el-popover v-model:visible="checkVisible" placement="top" width="160">
					<p>確定要批量審核嗎？</p>
					<div style="text-align: right; margin-top: 8px;">
						<el-button size="mini" type="text" @click="checkVisible = false">取消</el-button>
						<el-button size="mini" type="primary" @click="onMulCheck">確定</el-button>
					</div>
					<template #reference>
						<el-button icon="el-icon-delete" size="mini" :disabled="!check.length"
							style="margin-left: 10px;">審核</el-button>
					</template>
				</el-popover>
			</div>
			<el-table :data="checkList" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column align="center" label="ID" prop="id" />
				<el-table-column align="center" label="提幣時間" min-width="180" type="date">
					<template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
				</el-table-column>
				<el-table-column align="center" label="當前餘額" min-width="180" prop="balance" />
				<el-table-column align="center" label="提幣金額" min-width="180" prop="reward" />
				<el-table-column align="center" label="操作" min-width="200">
					<template #default="scope">
						<el-button icon="el-icon-delete" size="small" type="text" @click="onCheck(scope.row)">審核
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="gva-pagination">
				<el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]" :total="total"
					layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
					@size-change="handleSizeChange" />
			</div>

		</div>
	</div>
</template>

<script>
	import {
		getCheckList,
		passCheck,
		passCheckByIds,
		getDailyReward
	} from '@/api/check'
	import {
	  formatTimeToStr
	} from '@/utils/date'
	export default {
		name: 'Check',
		data() {
			return{
				checkVisible:false,
				checkList: [],
				check: [],
				page: 1,
				total: 10,
				pageSize: 10,
				uid: '',
				date: "",
				start_time: '',
				end_time: '',
				searchInfo: {
					uid: '',
					startTime: '',
					endTime: '',
					status:'0'
				},
				todayNum:0,
				todayTotal:0
			}
		},
		created() {
			this.CheckList()
			this.getDaily()
		},
		methods:{
			async CheckList() {
				if(this.uid===""){
					this.searchInfo.uid=0
				}else{
					this.searchInfo.uid=Number(this.uid)
				}
				const res = await getCheckList({
					page: this.page,
					pageSize: this.pageSize,
					...this.searchInfo
				})
				if (res.code === 0) {
					this.noticeList = res.data.list
					this.total = res.data.total
					this.page = res.data.page
					this.pageSize = res.data.pageSize
				}
			},
			onSubmit(){
				this.CheckList()
			},
			async onMulCheck(){
				this.checkVisible =false
				const res = await passCheckByIds({
					id:this.check
				})
				
				this.CheckList()
			},
			async onCheck(row){
				const res = await passCheck({id:row.id})
				this.CheckList()
			},
			async getDaily(){
				const res = await getDailyReward()
				if(res.code == 0){
					this.todayNum = res.data.num
					this.todayTotal = res.data.total
				}
			},
			handleSelectionChange(val){
				val.forEach(item => {
					this.check.push(item.id)
				})
			},
			handleCurrentChange(val){
				this.page = val
				this.CheckList()
			},
			handleSizeChange(val){
				 this.pageSize = val
				 this.CheckList()
			},
			formatDate(time) {
			  if (time !== null && time !== '') {
			    var date = new Date(time)
			    return formatTimeToStr(date, 'yyyy-MM-dd hh:mm:ss')
			  } else {
			    return ''
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
		}
	}
</script>

<style lang="scss" scoped="">
	.top {
		padding: 24px;
		margin-bottom: 5px;
		background-color: #fff;
		border-radius: 5px;
		text-align: center;
		.left-row {
			border: 1px solid #a3a3a3;
			border-radius: 4px;
		}

		.right-row {
			flex-direction: column;

			border: 1px solid #a3a3a3;
			border-radius: 4px;
		}
	}
</style>
