<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="uid">
          <el-input v-model="searchInfo.uid" placeholder="用户id" />
        </el-form-item>
        <el-form-item label="反馈内容">
          <el-input
            v-model="searchInfo.name"
            placeholder="反馈内容,支持模糊查找"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="searchInfo.status" clearable placeholder="请选择">
            <el-option label="未解决" value="0" />
            <el-option label="已解决" value="1" />
            <el-option label="已删除" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="date"
            type="daterange"
            unlink-panels
            range-separator="——"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="shortcuts"
            @change="getDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="onSubmit"
            >查询</el-button
          >
          <el-button size="mini" icon="el-icon-refresh" @click="onReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <div class="gva-table-box">
        <div class="gva-btn-list">
          <el-popover
            v-model:visible="deleteVisible"
            placement="top"
            width="160"
          >
            <p>确定要删除吗？</p>
            <div style="text-align: right; margin-top: 8px">
              <el-button size="mini" type="text" @click="deleteVisible = false"
                >取消</el-button
              >
              <el-button size="mini" type="primary">确定</el-button>
            </div>
            <template #reference>
              <el-button
                icon="el-icon-delete"
                size="mini"
                :disabled="!tableData.length"
                style="margin-left: 10px"
                >删除</el-button
              >
            </template>
          </el-popover>
        </div>
        <el-table :data="tableData">
          <el-table-column type="selection" width="55" />
          <el-table-column
            align="left"
            label="用户id"
            min-width="50"
            prop="uid"
          />
          <el-table-column
            align="left"
            label="反馈内容"
            min-width="50"
            prop="message"
          />

          <el-table-column
            align="center"
            label="反馈时间"
            width="180"
            type="date"
          >
            <template #default="scope">{{
              formatDate(scope.row.create_time)
            }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="解决时间"
            width="180"
            type="date"
          >
            <template #default="scope">{{
              formatDate(scope.row.resolve_time)
            }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="删除时间"
            width="180"
            type="date"
          >
            <template #default="scope">{{
              formatDate(scope.row.delete_time)
            }}</template>
          </el-table-column>
          <el-table-column align="left" label="状态" min-width="50">
            <template #default="scope">{{
              asyncStatus(scope.row.status)
            }}</template>
          </el-table-column>
          <el-table-column align="left" fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-button
                icon="el-icon-edit"
                size="small"
                type="text"
                @click="editFeedBack(scope.row)"
                >查看
              </el-button>
              <el-button
                v-if="scope.row.status != '2'"
                icon="el-icon-delete"
                size="small"
                type="text"
                @click="deleteFeedBack(scope.row)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="gva-pagination">
          <el-pagination
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="[10, 30, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>

      <el-dialog v-model="dialogFormVisible" title="查看反馈">
        <el-form label-width="80px">
          <el-form-item label="uid">
            <el-input
              v-model="feedDetail.uid"
              autocomplete="off"
              autosize
              disabled
            />
          </el-form-item>
          <el-form-item label="反馈内容">
            <el-input
              type="textarea"
              autosize
              disabled
              v-model="feedDetail.message"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="處理意見">
            <el-input type="textarea" autosize v-model="feedDetail.handle" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button size="small" @click="closeDialog">取 消</el-button>
            <el-button
              size="small"
              v-if="(feedDetail.status = '0')"
              type="primary"
              @click="enterDialog"
              >解 决</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import infoList from "@/mixins/infoList";
import {
  getMessage,
  readNewMessage,
  dealMessage,
  deleteMessage,
} from "@/api/message";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "equipment",
  mixins: [infoList],
  data() {
    return {
      dialogFormVisible: false,
      date: "",
      shortcuts: [
        {
          text: "最近一周",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
          },
        },
        {
          text: "最近一个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
          },
        },
        {
          text: "最近三个月",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
          },
        },
      ],
      start_time: "",
      end_time: "",
      page: 1,
      pageSize: 10,
      total: 10,
      tableData: [],
      searchInfo: {
        uid: "",
        message: "",
        status: "",
        start_time: "",
        end_time: "",
      },
      feedDetail: {},
    };
  },
  created() {
    this.onSubmit();
  },
  methods: {
    getDate(val) {
      if (val[0] && val[1]) {
        this.start_time = this.$moment(val[0]).format("YYYY-MM-DD");
        this.end_time = this.$moment(val[1]).format("YYYY-MM-DD");

        this.searchInfo.start_time = this.start_time;
        this.searchInfo.end_time = this.end_time;
      }
    },

    async onSubmit() {
      this.searchInfo.uid = Number(this.searchInfo.uid);
      const res = await getMessage({
        page: this.page,
        pageSize: this.pageSize,
        ...this.searchInfo,
      });
      if (res.code == 0) {
        this.tableData = res.data.list;
        this.total = res.data.total;
        this.page = res.data.page;
        this.pageSize = res.data.pageSize;
      }
    },
    onReset() {
      this.searchInfo = {
        uid: "",
        message: "",
        phone: "",
        email: "",
        status: "",
        start_time: "",
        end_time: "",
      };
      this.date = "";
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.onSubmit();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.onSubmit();
    },
    asyncStatus(status) {
      if (status == "1") {
        return "已解决";
      } else if (status == "2") {
        return "已删除";
      } else {
        return "未解决";
      }
    },
    async editFeedBack(row) {
      const res = await readNewMessage({ id: Number(row.id) });
      if (res.code == 0) {
        this.feedDetail = res.data;
        this.dialogFormVisible = true;
      } else {
        ElMessage({
          type: "fail",
          message: "获取反馈信息失败",
          center: true,
        });
      }
    },
    deleteFeedBack(row) {
      ElMessageBox.confirm("是否删除该条反馈", "Warning", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      }).then(async () => {
        const res = await deleteMessage({ id: Number(row.id) });
        if (res.code == 0) {
          ElMessage({
            type: "success",
            message: "删除成功",
            center: true,
          });
          this.onSubmit();
        } else {
          ElMessage({
            type: "fail",
            message: "删除失败",
            center: true,
          });
          this.onSubmit();
        }
      });
    },
    closeDialog() {
      this.dialogFormVisible = false;
    },
    async enterDialog() {
      if (this.feedDetail.status == "0") {
        delete this.feedDetail.create_time;
        delete this.feedDetail.resolve_time;
        const res = await dealMessage(this.feedDetail);
        if (res.code == 0) {
          this.dialogFormVisible = false;
          setTimeout(() => {
            ElMessage({
              type: "success",
              message: "处理成功",
              center: true,
            });
            this.onSubmit();
          }, 1000);
        }
      } else {
        this.dialogFormVisible = false;
      }
    },
  },
};
</script>

<style>
</style>
