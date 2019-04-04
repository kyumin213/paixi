<template>
  <section class="el-container wrapper is-vertical">
    <el-row style="height:100%;">
     <el-col :span="4" :offset="16">
      <el-select v-model="sessionNumber" @change="queryByTime" placeholder="期数选择">
        <el-option v-for="item in cycleNumberList" :key="item" :value="item"></el-option>
      </el-select>
     </el-col>
     
      <el-col :span="2">
        <el-button @click="exportExcelFilter" style="margin-top: 2px;" size="medium" type="primary">导出数据</el-button>
      </el-col>
    </el-row>
    <el-row class="ordersList">
      <el-col :span="24">
        <el-table
            border
            :data="tableData"
            style="width: 100%;text-align:center;"
            :row-class-name="tableRowClassName">

            <el-table-column
            label="编号" width="160">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="期数" width="100">
              <template  slot-scope="scope">
                <span  v-html="scope.row.cycleNumber"></span>
              </template>
            </el-table-column>

            <el-table-column
            label="玩家名称" width="100">
              <template  slot-scope="scope">
                <span  v-html="scope.row.nickname"></span>
              </template>
            </el-table-column>

            <el-table-column
             label="联系电话">
              <template  slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="领取金额（元）">
              <template  slot-scope="scope">
                <span>{{ scope.row.surprisePrice }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="领取时间">
              <template  slot-scope="scope">
                <span>{{ scope.row.exchangeTime }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="本期红包发布时间">
              <template  slot-scope="scope">
                <span>{{ scope.row.topicBeginTime }}</span>
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

<style scope>
.ordersList {
  margin-top: 20px;
}
</style>

<script type="text/javascript">
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { exportTb } from '@/config/mUtils';
import { getStore } from "@/config/mUtils";
export default {
  name: "SendOutSurprise",
  data() {
    return {
      i: 1,
      excelUrl: '',
      currentPage: 1,
      total: 0,
      tableData: [],
      shipperCode: "",
      sessionNumber: '',
      exptableData: [],
      rankingEndTime: '',
      phone: '',
      dialogFormVisibl: false,
      dialogFormVisiblerefund: false,
      refundId: '',
      loading: false,
      total: 0,
      currentPage: 1,
      from: {
        phone: "",
        logistics: "",
        refundsReason: '',
        refundsPrice: ''
      },
      kuaidi: [
        {
          name: "顺丰",
          id: 'shunfeng'
        },
        {
          name: "百世汇通",
          id: 'huitongkuaidi'
        },
        {
          name: "申通",
          id: 'shentong'
        },
        {
          name: "中通",
          id: 'zhongtong'
        },
        {
          name: "圆通",
          id: 'yuantong'
        },
        {
          name: "韵达",
          id: 'yunda'
        },
        {
          name: "EMS",
          id: 'ems'
        },
        {
          name: "宅急送",
          id: 'zhaijisong'
        },
        {
          name: "天天快递",
          id: 'tiantian'
        },
        {
          name: "京东",
          id: 'jd'
        },
      ],
      rank: ["","第一名","第二名","第三名","第四名","第五名","第六名","第七名","第八名","第九名","第十名"],
      value: "",
      orderValue: "",
      token: getStore("token"),
      valueDate: [],
      options1: [],
      formLabelWidth: "120px",
      orderId: "",
      statusvalue: '',
      status: ["取消订单", "待付款", "待发货", "已发货", "提醒发货", "仅退款", "退货退款", "已收货", "已评价", "已退款"],
      agoDays: '',
      exchangeDayNumber: '',
      exchangeMonthNumber: '',
      exchangeWeekNumber: '',
      CurrentRankCycle: "",
      cycleNumberList: [],
      totalRankCycle: "",
    };
  },
  methods: {
    exportExcelFilter () {
        $.ajax({
          url: baseUrl + "promise/tree/surprise/export/deliver/list",
          type: "POST",
          dataType: "json",
          data: {
            token: this.token,
            cycleNumber: this.sessionNumber
          }
        })
        .done(data => {
          if (data.status == 200) {
            this.excelUrl = data.bean
            window.location = data.bean   
          } else {
            this.$message.error(data.msg);
          }
        })         
    },
    handleCurrentChangeQuery (val) {
      this.currentPage = val;
      this.queryWinner(this.sessionNumber)
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status == 0) {
        return "off-row";
      }
      return "";
    },
    queryByTime () {
      this.queryWinner(this.sessionNumber)
    },
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      this.queryWinner(this.sessionNumber)
    },
    queryWinner (cycleNumber) {
      $.get(
        baseUrl + "promise/tree/surprise/get/deliver/list",
        {
          token: this.token,
          cycleNumber: cycleNumber
        },
        data => {
          if (data.status == 200) {
            this.tableData = data.bean.treeUserSurpriseList;
            this.total = data.total;
            this.cycleNumberList = data.bean.cycleNumberList
            // this.CurrentRankCycle = data.bean.CurrentRankCycle
            // this.totalRankCycle = data.bean.totalRankCycle
            // this.rankingEndTime = data.bean.rankingEndTime
          } else {
            alert(data.msg)
          }
        }
      );
    },
    sendOrderIds(row) {
      this.dialogFormVisibl = true;
      this.orderId = row.ordersId;
      this.phone = row.receiverPhone
    },

    handleQuery(index, row) {
      console.log(index, row)
      this.$router.go(0)
      this.$router.push({ name: 'OrdersProducts', params: { id: row.id }})
    },

    formatDate(ns) {
      var d = new Date(ns);
      var dformat =
        [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("-") +
        " " +
        [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
      return dformat;
    },
  },

  created() {
    this.queryWinner()
  }
};
</script>