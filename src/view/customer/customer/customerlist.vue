<template>
	<div>
		<div class="gva-search-box">
			<el-form ref="searchForm" :inline="true" :model="searchInfo">
				<el-form-item label="ID">
					<el-input v-model="id" placeholder="請輸入id號" />
				</el-form-item>
				<el-form-item label="狀態">
					<el-select v-model="searchInfo.status" clearable placeholder="请选择">
						<el-option label="全部" value="" />
						<el-option label="正常" value="1" />
						<el-option label="凍結" value="0" />
					</el-select>
				</el-form-item>
				<el-form-item label="類型">
					<el-select v-model="searchInfo.type" clearable placeholder="请选择">
						<el-option label="全部" value="" />
						<el-option label="會員" value="0" />
						<el-option label="VIP" value="1" />
					</el-select>
				</el-form-item>
				<el-form-item label="时间">
					<el-date-picker v-model="date" type="daterange" unlink-panels range-separator="——"
						start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts" @change="getDate">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button size="mini" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
					<el-button size="mini" icon="el-icon-refresh" @click="onReset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="gva-table-box">
			<el-table :data="tableData" @sort-change="" @selection-change="">
				<el-table-column type="selection" width="55" />
				<el-table-column align="center" label="id" min-width="30" prop="id" />
				<el-table-column align="center" label="地址" min-width="70" prop="address" />
				<el-table-column align="center" label="類型" min-width="50" prop="type" />
				<el-table-column align="center" label="錢包餘額" min-width="50" prop="balance" />
				<el-table-column align="center" label="註冊時間" min-width="50" type="date">
					<template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
				</el-table-column>
				<el-table-column align="center" label="状态" min-width="50" prop="status">
					<template #default="scope">
						<el-switch active-color="#13ce66" inactive-color="#ff4949" v-model="scope.row.status"
							:active-value="1" :inactive-value="0" :loading=load @change="handchange(scope.row)">
						</el-switch>
					</template>
				</el-table-column>


				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button icon="el-icon-edit" size="small" type="text" @click="customerDetail(scope.row)">详情
						</el-button>
						<el-button icon="el-icon-delete" size="small" type="text" @click="deleteCustomer(scope.row)">删除
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
		<el-dialog v-model="showDetail" title="详情">
			this.$router.push({
			name: 'dictionaryDetail',
			params: {
			id: row.ID
			}
			})


			<template #footer>
				<span class="dialog-footer">
					<el-button @click="showDetail = false">取消</el-button>
					<el-button type="primary" @click="editUserInfo">Confirm</el-button>
				</span>
			</template>
		</el-dialog>

	</div>
</template>

<script>
	import {
		getCustomerTable,
		changeCustomerStatus,
		getCustomerById,
		deleteCustomerById
	} from '@/api/customer1'
	import {
		ElMessage
	} from 'element-plus'
	import infoList from '@/mixins/infoList'
	export default {
		name: 'customerlist',
		mixins: [infoList],
		data() {
			return {
				id: "",
				visible: false,
				load: false,
				showDetail: false,
				page: 1,
				total: 10,
				pageSize: 10,
				tableData: [],
				searchInfo: {
					id: '',
					status:'',
					type:'',
					startTime:'',
					endTime:''
				},
				userInfo: {

				},
				start_time: '',
				end_time: '',
				date: "",
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
			this.onSubmit()
		},
		methods: {
			async onSubmit() {
				if (this.id == "") {
					this.searchInfo.id = 0
				} else {
					this.searchInfo.id = Number(this.id)
				}
				const res = await getCustomerTable({
					page: this.page,
					pageSize: this.pageSize,
					...this.searchInfo
				})
				if (res.code == 0) {
					this.tableData = res.data.list
					this.total = res.data.total
					this.page = res.data.page
					this.pageSize = res.data.pageSize
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
				this.searchInfo.nickname = ''
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.onSubmit()
			},
			handleCurrentChange(val) {
				this.page = val
				this.onSubmit()
			},
			async handchange(row) {
				this.load = true
				const res = await changeCustomerStatus({
					id: row.id,
					status: row.status
				})
				if (res.code == 0) {
					ElMessage({
						message: res.msg,
						type: 'success',
						center: true,
					})

				} else {
					ElMessage({
						message: res.msg,
						type: 'error',
						center: true,
					})
				}
				this.load = false
			},

			customerDetail(row) {
				this.$router.push({
					name: 'customerdetail',
					params: {
						id: row.id
					}
				})
			},
			deleteCustomer(row) {
				this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(async () => {
						const res = await deleteCustomerById(row)
						if (res.code === 0) {
							this.$message({
								type: 'success',
								message: '删除成功!'
							})
							if (this.tableData.length === 1 && this.page > 1) {
								this.page--
							}
							this.onSubmit()
						}
					})
			}
		}
	}
</script>

<style scoped lang="scss">
	.button-box {
		padding: 10px 20px;

		.el-button {
			float: right;
		}
	}
</style>
