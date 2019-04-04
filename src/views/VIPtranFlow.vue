<template>
  <section class="el-container wrapper is-vertical">
      <!-- 搜索 -->
    <el-row style="height:100%;margin-bottom:20px;">
      <!-- 按编号搜索 -->
      <el-col :span="4">
        <el-input v-model="userId" placeholder="用户编号查询" @blur="userFilter" style="width:80%;"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-button
            @click="exportAccount"  type="primary" style="margin-bottom: 10px;">导出</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-row>
      <el-col :span="24">
        <el-table
            border
            :data="tableData"
            style="width: 100%;text-align:center;">
            <el-table-column
            label="用户编号" width="160">
            <template slot-scope="scope">
                <span>{{ scope.row.userId }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="收入/支出">
              <template  slot-scope="scope">
                <span>{{ scope.row.incomeType }}</span>
              </template>
            </el-table-column>

            <el-table-column
            label="交易金额" width="160">
              <template  slot-scope="scope">
                <span>{{ scope.row.tradeMoney }}</span>
              </template>
            </el-table-column>

            <el-table-column label="交易类型">
              <template  slot-scope="scope">
                <span>{{ scope.row.tradeType }}</span>
              </template>
            </el-table-column>

            <el-table-column label="交易状态">
              <template  slot-scope="scope">
                <span>{{ scope.row.status }}</span>
              </template>
            </el-table-column>

             <el-table-column label="订单号">
              <template  slot-scope="scope">
                <span>{{ scope.row.ordersId }}</span>
              </template>
            </el-table-column>

             <el-table-column label="交易时间">
              <template  slot-scope="scope">
                <span>{{ scope.row.created }}</span>
              </template>
            </el-table-column>

             <el-table-column label="描述">
              <template  slot-scope="scope">
                <span>{{ scope.row.tradeSummary }}</span>
              </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div class="block" style="margin:50px auto;">
      <el-pagination
        @current-change="handleCurrentChangeQuery"  
        :current-page="currentPage"
        :page-size="10"  
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </section>
</template>
<style>
.goodslist {
  margin-top: 50px;
}
.thumnial {
  width: 100px;
  height: 100px;
}
.select-two {
  width: 160px;
  margin-top: 10px;
}
.select-one {
  width: 160px;
  margin-top: 10px;
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { getStore } from "@/config/mUtils";
export default {
  name: "VIPtranFlow",
  data() {
    return {
      token: getStore("token"),
      total: 0,
      currentPage: 1,
      loading: false,
      goodsTitle: "",
      goodsId: "",
      tableData: [],
      statusvalue: "",
      valueDate: [],
      userId: '',
      nickname: ''
    };
  },
  methods: {
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      this.getUserAll(this.currentPage, this.userId);
    },
    userFilter () {
       this.getUserAll(this.currentPage, this.userId);
    },
    getUserAll(pageBegin,userId) {
      $.get(
        baseUrl + "user/userAccount/selectUserAccountWater",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          userId: userId
        },
        data => {
          console.log(data);
          if (data.status == 200) {
            this.tableData = data.bean;
            this.total = data.total;
          }
        }
      );
    },
    exportAccount () {
        jQuery.get(baseUrl + 'user/userAccount/get/selectUserAccountWaterExcel', {userId: this.id, token: this.token},(data) => {
            window.location = data.bean  
            console.log(data.bean)
        })
    }
  },
  created() {
    this.getUserAll(this.currentPage, this.userId);
  }
};
</script>