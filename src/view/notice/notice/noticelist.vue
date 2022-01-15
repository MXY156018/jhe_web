<template>
	<div>
		<div class="gva-table-box">
			<div class="gva-btn-list">
				<el-button size="mini" type="primary" icon="el-icon-plus" @click="openDialog('addNotice')">發佈公告
				</el-button>
				<el-popover v-model:visible="deleteVisible" placement="top" width="160">
					<p>确定要删除吗？</p>
					<div style="text-align: right; margin-top: 8px;">
						<el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
						<el-button size="mini" type="primary" @click="onDelete">确定</el-button>
					</div>
					<template #reference>
						<el-button icon="el-icon-delete" size="mini" :disabled="!notice.length"
							style="margin-left: 10px;">删除</el-button>
					</template>
				</el-popover>
			</div>
			<el-table :data="noticeList" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column align="center" label="公告標題" min-width="180" prop="title" />
				<el-table-column align="center" label="發佈時間" min-width="180" type="date">
					<template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
				</el-table-column>
				
				<el-table-column align="center" label="操作" min-width="200">
					<template #default="scope">
						<el-button icon="el-icon-edit" size="small" type="text" @click="editNotice(scope.row)">编辑
						</el-button>
						<el-button icon="el-icon-delete" size="small" type="text" @click="fleshNotice(scope.row)">刷新
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

		<el-dialog v-model="dialogFormVisible" :title="dialogTitle">
			<el-form ref="noticeForm" :model="form" label-width="80px">
				<el-form-item align="left" label="標題:" min-width="150">
					<el-input v-model="form.title" autocomplete="off" autosize />
				</el-form-item>
				<el-form-item align="left" label="公告內容:" min-width="150">
					<el-input type="textarea"  autosize v-model="form.content" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button size="small" type="primary" @click="enterDialog">發 佈</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getNoticeList,
		deleteNoticeByIds,
		getNoticeById,
		deleteNotice,
		createNotice,
		fleshNotice,
		updateNotice
	} from '@/api/notice'
	import infoList from '@/mixins/infoList'
	export default {
		name: 'Notice',
		mixins: [infoList],
		data() {
			return {
				deleteVisible: false,
				noticeList: [],
				dialogFormVisible: false,
				dialogTitle: '發佈公告',
				notice: [],
				noticeDetail: {
					title: '',
					content: ''
				},
				form: {
					title: '',
					content: ''
				},
				type: '',
			}
		},
		created() {
			this.NoticeList()
		},
		methods: {
			async NoticeList() {
				const table = await getNoticeList({
					page: this.page,
					pageSize: this.pageSize,
				})
				if (table.code === 0) {
					this.noticeList = table.data.list
					this.total = table.data.total
					this.page = table.data.page
					this.pageSize = table.data.pageSize
				}
			},
			//  选中公告
			handleSelectionChange(val) {
				this.notice = val
				
			},
			async onDelete() {
				const ids = []
				this.notice.forEach(item => {
					ids.push(item.id)
				})
				const res = await deleteNoticeByIds({
					id: ids
				})
				if (res.code === 0) {
					this.$message({
						type: 'success',
						message: res.msg
					})
					if (this.tableData.length === ids.length && this.page > 1) {
						this.page--
					}
					this.deleteVisible = false
					this.NoticeList()
				}
			},
			openDialog(type) {
				switch (type) {
					case 'addNotice':
						this.dialogTitle = '發佈公告'
						break
					case 'edit':
						this.dialogTitle = '編輯公告'
						break
					default:
						break
				}
				this.type = type
				this.dialogFormVisible = true
			},
			closeDialog() {
				this.dialogFormVisible = false
			},
			async editNotice(row) {
				const res = await getNoticeById({
					id: row.id
				})
				this.form = res.data
				this.openDialog('edit')
			},
			async fleshNotice(row){
				const res = await fleshNotice({
					id:row.id
				})
				if (res.code==0){
					this.$message({
						type: 'success',
						message: '刷新成功!',
						center:true
					})
					this.NoticeList()
				}
			},
			async deleteNotice(row) {
				this.$confirm('此操作将删除该公告, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(async () => {
						const res = await deleteNotice(row)
						if (res.code === 0) {
							this.$message({
								type: 'success',
								message: '删除成功!'
							})
							if (this.tableData.length === 1 && this.page > 1) {
								this.page--
							}
							this.NoticeList()
						}
					})
			},
			async enterDialog() {
				switch (this.type) {
					case 'addNotice': {
						const res = await createNotice(this.form)
						if (res.code === 0) {
							this.$message({
								type: 'success',
								message: '添加成功',
								showClose: true
							})
						}
						this.NoticeList()
						this.closeDialog()
					}

					break
				case 'edit': {
					console.log(this.form)
					const res = await updateNotice(this.form)
					if (res.code === 0) {
						this.$message({
							type: 'success',
							message: '更新成功',
							showClose: true
						})
					}
					this.NoticeList()
					this.closeDialog()
				}
				break
				default:
				// eslint-disable-next-line no-lone-blocks
				{
					this.$message({
						type: 'error',
						message: '未知操作',
						showClose: true
					})
				}
				break
				}
			},
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

	.warning {
		color: #dc143c;
	}
</style>
