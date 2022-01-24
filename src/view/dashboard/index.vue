<template>
  <div>
    <div class="gva-search-box">
      <el-row>
        <el-col :span="6" :offset="3">
          <el-card>
            <p>用戶總數量</p>
            <div style="padding: 14px">
              <div class="num">
                <p>{{ userNum }}</p>
              </div>
              <div class="bottom">
                <p @click="toTarget('customerlist')">用戶管理</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" :offset="3">
          <el-card>
            <p>平台營收總數</p>
            <div style="padding: 14px">
              <div class="num">
                <p>{{ platformprofit }}</p>
              </div>
              <div class="bottom">
                <p @click="toTarget('billmanagement')">賬單管理</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-row>
        <el-col :span="4" :offset="2">
          <el-card>
            <p>充值總數</p>
            <div style="padding: 14px">
              <div class="num">
                <p>{{ rechargeSum }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-card>
            <p>提幣總數</p>
            <div style="padding: 14px">
              <div class="num">
                <p>{{ rewardNum }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-card>
            <p>vip獎勵領取總數</p>
            <div style="padding: 14px">
              <div class="num">
                <p>{{ vipbalanceNum }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-card>
            <p>遊戲排名獎勵總數</p>
            <div style="padding: 14px">
              <div class="num">
                <p>{{ gamebalanceNum }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { homeData } from "@/api/home";
export default {
  name: "Dashboard",
  components: {},
  data() {
    return {
      userNum: 0,
      platformprofit: 0,
      rechargeSum: 0,
      rewardNum: 0,
      vipbalanceNum: 0,
      gamebalanceNum: 0,
    };
  },
  created() {
    this.getHomePageData();
  },
  methods: {
    toTarget(name) {
      this.$router.push({ name });
    },
    async getHomePageData() {
      const res = await homeData();
      this.userNum = res.data.user_num;
      this.platformprofit = res.data.platform_profit;
      this.rechargeSum = res.data.recharge_num;
      this.rewardNum = res.data.reward_num;
      this.vipbalanceNum = res.data.vipbalance_num;
      this.gamebalanceNum = res.data.gameablance_num;
    },
  },
};
</script>

<style lang="scss" scoped>
.gva-search-box {
  p {
    padding-left: 10px;
  }
  .num {
    height: 80px;
    border-bottom: 2px solid rgba(10, 10, 10, 0.308);
    p {
      color: rgba(2, 2, 2, 0.432);
      text-align: center;
      line-height: 80px;
      font-size: 20px;
    }
  }
  .bottom {
    height: 50px;
    padding-top: 20px;
    p {
      color: rgba(2, 2, 2, 0.432);
      text-align: center;
      line-height: 50px;
      font-size: 20px;
      cursor: pointer;
    }
  }
}
.bottom {
  background-color: #fff;
  .num {
    height: 50px;
    p {
      color: rgba(2, 2, 2);
      text-align: center;
      line-height: 50px;
      font-size: 14px;
    }
  }
}
</style>
