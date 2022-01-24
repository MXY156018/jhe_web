<template>
  <div>
    <div class="config">
      <el-form :inline="true" :model="profit">
        <el-form-item label="日排行獎勵">
          <el-input v-model="profit.day" />
        </el-form-item>
        <el-form-item label="周排行獎勵">
          <el-input v-model="profit.week" />
        </el-form-item>
        <el-form-item label="月排行獎勵">
          <el-input v-model="profit.month" />
        </el-form-item>

        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="setconfig"
            >保存</el-button
          >
        </el-form-item>
        <el-form-item label="總獎勵:">
          <template #default>{{ profit.sum }} JHE</template>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="ID">
          <el-input v-model="uid" placeholder="請輸入ID號" />
        </el-form-item>
        <el-form-item label="時間">
          <el-date-picker
            v-model="searchInfo.time"
            unlink-panels
            @change="getDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="請選擇時間"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="getTable"
            >查詢</el-button
          >
          <el-button size="mini" icon="el-icon-refresh" @click="onReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="rank">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="日排行" name="day"> </el-tab-pane>
        <el-tab-pane label="周排行" name="week"></el-tab-pane>
        <el-tab-pane label="月排行" name="month"></el-tab-pane>
      </el-tabs>
      <el-table :data="tabData">
        <el-table-column align="center" label="排名" prop="rank" />
        <el-table-column align="center" label="時間" prop="message">
          <template #default="scope" v-if="activeName != 'day'"
            >{{ formatDate(scope.row.start_time, 1) }} 至
            {{ formatDate(scope.row.end_time, 1) }}</template
          >
          <template #default="scope" v-else>{{
            formatDate(scope.row.start_time, 1)
          }}</template>
        </el-table-column>
        <el-table-column align="center" label="ID" prop="uid" />
        <el-table-column align="center" label="遊戲總得分" prop="sum_score" />
        <el-table-column align="center" label="獎勵" prop="profit" />
      </el-table>
    </div>
  </div>
</template>

<script>
import infoList from "@/mixins/infoList";
import { getConfig, setConfig, getRank } from "@/api/gamerank";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "equipment",
  mixins: [infoList],
  data() {
    return {
      date: "",
      uid: "",
      tabData: [],
      dayTab: [],
      weekTab: [],
      monthTab: [],
      activeName: "day",
      profit: {
        day: "",
        week: "",
        month: "",
        sum: "1000",
      },
      searchInfo: {
        time: "",
        uid: "",
      },
    };
  },
  created() {
    this.getconfig();
    this.getTable();
  },
  methods: {
    async getconfig() {
      const res = await getConfig();
      this.profit.day = res.data.day;
      this.profit.week = res.data.week;
      this.profit.month = res.data.month;
      this.profit.sum = res.data.sum_profit;
    },
    async setconfig() {
      if (this.profit.day == "" || this.profit == "" || this.profit == "") {
        ElMessage({
          message: "參數不能為空",
          type: "error",
          center: true,
        });
        return;
      }
      this.profit.day = Number(this.profit.day);
      this.profit.week = Number(this.profit.week);
      this.profit.month = Number(this.profit.month);

      const res = await setConfig({
        ...this.profit,
      });
      if (res.code == 0) {
        ElMessage({
          message: "設置成功",
          type: "success",
          center: true,
        });
      } else {
        ElMessage({
          message: "設置失敗",
          type: "error",
          center: true,
        });
      }
    },
    async getTable() {
      if (this.uid == "") {
        this.searchInfo.uid = 0;
      } else {
        this.searchInfo.uid = Number(this.uid);
      }
      const res = await getRank(this.searchInfo);
      this.dayTab = res.data.day_list;
      for (let i = 0; i < this.dayTab.length; i++) {
        if (this.dayTab[i].uid == 0) {
          this.dayTab.splice(i, 1);
        }
      }
      this.weekTab = res.data.week_list;
      for (let i = 0; i < this.weekTab.length; i++) {
        if (this.weekTab[i].uid == 0) {
          this.weekTab.splice(i, 1);
        }
      }
      this.monthTab = res.data.month_list;
      for (let i = 0; i < this.monthTab.length; i++) {
        if (this.monthTab[i].uid == 0) {
          this.monthTab.splice(i, 1);
        }
      }
      this.tabData = this.dayTab;
    },
    getDate(val) {
      this.time = val;
    },
    onReset() {
      this.uid = "";
      this.date = "";
    },
    handleClick() {
      if (this.activeName == "day") {
        this.tabData = this.dayTab;
      } else if (this.activeName == "week") {
        this.tabData = this.weekTab;
      } else if (this.activeName == "month") {
        this.tabData = this.monthTab;
      }
    },
  },
};
</script>

<style>
.config {
  background-color: #fff;
  padding: 12px;
}
.rank {
  background-color: #fff;
  padding: 12px;
}
</style>
