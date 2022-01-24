<template>
  <div>
    <div class="detail_title">用戶詳情</div>
    <div class="detail">
      <el-form label-width="auto">
        <el-form-item label="ID:">
          <template #default>{{ detail.id }}</template>
        </el-form-item>
        <el-form-item label="地址:">
          <template #default>{{ detail.address }}</template>
        </el-form-item>
        <el-form-item label="註冊時間:">
          <template #default>{{ formatDate(detail.create_time) }}</template>
          <!-- <el-input  disabled  :value="handlerTime" autocomplete="off" /> -->
        </el-form-item>

        <el-form-item label="錢包餘額:">
          <template #default>{{ detail.balance }}</template>
        </el-form-item>
        <el-form-item label="類型:">
          <template #default>{{ setType(detail.type) }}</template>
        </el-form-item>
        <el-form-item label="下級節點總充值:">
          <template #default style="justify-content: space-between"
            >{{ detail.sum_subordinate_recharge }} JHE</template
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="detail_info">
      <el-tabs
        v-model="activeName"
        tab-position="left"
        @tab-click="handleClick"
      >
        <el-tab-pane label="下級" name="first">
          <el-table :data="first_data">
            <el-table-column
              align="center"
              label="ID"
              min-width="50"
              prop="id"
            />
            <el-table-column align="center" label="餘額" min-width="50">
              <template #default="scope">{{ scope.row.balance }} JHE</template>
            </el-table-column>
            <el-table-column align="center" label="類型" min-width="50">
              <template #default="scope">{{
                setType(scope.row.type)
              }}</template>
            </el-table-column>
            <el-table-column
              align="center"
              label="註冊時間"
              width="180"
              type="date"
            >
              <template #default="scope">{{
                formatDate(scope.row.create_time)
              }}</template>
            </el-table-column>
          </el-table>
          <div class="pagination" :hide-on-single-page="true">
            <el-pagination
              :current-page="page1"
              :page-size="pageSize1"
              :page-sizes="[10, 30, 50, 100]"
              :total="total1"
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="handleCurrentChange1"
              @size-change="handleSizeChange1"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="遊戲記錄" name="second">
          <el-table :data="second_data">
            <el-table-column
              align="center"
              label="時間"
              width="180"
              type="date"
            >
              <template #default="scope">{{
                formatDate(scope.row.end_time)
              }}</template>
            </el-table-column>
            <el-table-column align="center" label="遊戲模式" min-width="50">
              <template #default="scope">{{
                setGameType(scope.row.type)
              }}</template>
            </el-table-column>
            <el-table-column align="center" label="遊戲前餘額" min-width="50">
              <template #default="scope"
                >{{ scope.row.pre_balance }} JHE</template
              >
            </el-table-column>
            <el-table-column align="center" label="得分" min-width="50">
              <template #default="scope">{{ scope.row.score }} JHE</template>
            </el-table-column>
            <el-table-column align="center" label="遊戲後餘額" min-width="50">
              <template #default="scope"
                >{{ scope.row.now_balance }} JHE</template
              >
            </el-table-column>
          </el-table>
          <div class="pagination" :hide-on-single-page="true">
            <el-pagination
              :current-page="page2"
              :page-size="pageSize2"
              :page-sizes="[10, 30, 50, 100]"
              :total="total2"
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="handleCurrentChange2"
              @size-change="handleSizeChange2"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="操作記錄" name="third">
          <el-table :data="third_data">
            <el-table-column
              align="center"
              label="時間"
              width="180"
              type="date"
            >
              <template #default="scope">{{
                formatDate(scope.row.create_time)
              }}</template>
            </el-table-column>
            <el-table-column align="center" label="類型" min-width="50">
              <template #default="scope">{{
                setOperateType(scope.row.type)
              }}</template>
            </el-table-column>
            <el-table-column align="center" label="數量" min-width="50">
              <template #default="scope">{{ scope.row.num }} JHE</template>
            </el-table-column>
            <el-table-column align="center" label="餘額" min-width="50">
              <template #default="scope">{{ scope.row.balance }} JHE</template>
            </el-table-column>
          </el-table>
          <div class="pagination" :hide-on-single-page="true">
            <el-pagination
              :current-page="page3"
              :page-size="pageSize3"
              :page-sizes="[10, 30, 50, 100]"
              :total="total3"
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="handleCurrentChange3"
              @size-change="handleSizeChange3"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import infoList from "@/mixins/infoList";
import {
  getCustomerSubordinate,
  getCustomerById,
  getCustomerGameRecord,
  getCustomerOperator,
} from "@/api/customer1";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "CustomerDetail",
  mixins: [infoList],
  computed: {
    handlerTime() {
      return this.formatDate(this.detail.create_time);
    },
  },
  data() {
    return {
      first_data: [],
      second_data: [],
      third_data: [],
      customerID: 0, //當前用戶id
      activeName: "first",
      page1: 1,
      total1: 10,
      pageSize1: 10,
      page2: 1,
      total2: 10,
      pageSize2: 10,
      page3: 1,
      total3: 10,
      pageSize3: 10,
      detail: {
        id: 10002,
        address: "11112234124dfas123caw",
        create_time: "fdasas",
        balance: "1111",
        type: "1",
      },
    };
  },
  created() {
    this.customerID = Number(this.$route.params.id);
    this.getCustomerInfo(); //獲取用戶信息
    this.getSubordinate(); //獲取用戶下級
    this.getGameRecord(); //獲取用戶遊戲記錄
    this.getOperator(); //獲取用戶操作記錄
  },
  methods: {
    setType(type) {
      if (type == "0") {
        return "會員";
      } else if (type == "1") {
        return "VIP";
      }
    },
    setGameType(type) {
      if (type == 1) {
        return "單人對戰";
      } else if (typ == 2) {
        return "2人對戰";
      } else if (type == 5) {
        return "五人團戰";
      }
    },
    setOperateType(type) {
      if (type == 1) {
        return "充值";
      } else if (type == 2) {
        return "提幣";
      } else if (type == 3) {
        return "vip領取獎勵";
      } else if (type == 4) {
        return "遊戲日排行獎勵";
      } else if (type == 6) {
        return "遊戲周排行獎勵";
      } else if (type == 7) {
        return "遊戲月排行獎勵";
      }
    },
    handlerTime(time) {
      return this.formatDate(time);
    },
    handleClick() {},
    handleSizeChange1(val) {
      this.pageSize1 = val;
    },
    handleCurrentChange1(val) {
      this.page1 = val;
    },
    handleSizeChange2(val) {
      this.pageSize2 = val;
    },
    handleCurrentChange2(val) {
      this.page2 = val;
    },
    handleSizeChange3(val) {
      this.pageSize3 = val;
    },
    handleCurrentChange3(val) {
      this.page3 = val;
    },
    //獲取用戶信息
    async getCustomerInfo() {
      const res = await getCustomerById({ id: this.customerID });

      if (res.code == 0) {
        console.log(this.detail);
        this.detail = res.data;
      } else {
        ElMessage({
          type: "fail",
          message: "獲取用戶信息失敗",
          center: true,
        });
      }
    },
    //獲取下級
    async getSubordinate() {
      const res = await getCustomerSubordinate({
        id: this.customerID,
        page: this.page1,
        pageSize: this.pageSize1,
      });
      if (res.code == 0) {
        this.first_data = res.data.list;
        this.total1 = res.data.total;
        this.page1 = res.data.page;
        this.pageSize1 = res.data.pageSize;
      } else {
        ElMessage({
          type: "fail",
          message: "獲取下級失敗",
          center: true,
        });
      }
    },
    async getGameRecord() {
      const res = await getCustomerGameRecord({
        uid: this.customerID,
        page: this.page2,
        pageSize: this.pageSize2,
      });
      if (res.code == 0) {
        this.second_data = res.data.list;
        this.total2 = res.data.total;
        this.page2 = res.data.page;
        this.pageSize2 = res.data.pageSize;
      } else {
        ElMessage({
          type: "fail",
          message: "獲取遊戲記錄失敗",
          center: true,
        });
      }
    },
    async getOperator() {
      const res = await getCustomerOperator({
        uid: this.customerID,
        page: this.page2,
        pageSize: this.pageSize2,
      });
      if (res.code == 0) {
        this.third_data = res.data.list;
        this.total3 = res.data.total;
        this.page3 = res.data.page;
        this.pageSize3 = res.data.pageSize;
      } else {
        ElMessage({
          type: "fail",
          message: "獲取操作記錄失敗",
          center: true,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.detail_title {
  padding: 10px;
  background-color: #fff;
}
.detail {
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  .info {
    margin: 10px;
  }
}

.detail_info {
  padding: 10px;
  background-color: #fff;
  margin-top: 5px;
}

el-tabs {
  margin-left: 10px;
}

.pagination {
  display: flex;
  justify-content: center;

  .el-pagination__editor {
    .el-input__inner {
      height: 32px;
    }
  }

  .el-pagination__total {
    line-height: 32px !important;
  }

  .btn-prev {
    padding-right: 6px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
  }

  .number {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
  }

  .btn-quicknext {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
  }

  .btn-next {
    padding-left: 6px;
    width: 32px;
    height: 32px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .active {
    background: #4d70ff;
    border-radius: 2px;
    color: #ffffff !important;
  }

  .el-pager li.active + li {
    border-left: 1px solid #ddd !important;
  }

  .el-pagination__sizes {
    .el-input {
      .el-input__suffix {
        margin-top: 2px;
      }
    }
  }

  .el-pagination__jump {
    .el-pagination__editor {
    }
  }
}
</style>
