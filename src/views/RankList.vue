<template>
  <section class="el-container wrapper is-vertical">
    <el-row style="margin-bottom:30px;">
      <el-col :span="4" :offset="6">
        本期期数<h2>{{CurrentRankCycle}}</h2>
      </el-col>
      <el-col :span="4">
        排行榜总期数<h2>{{totalRankCycle}}</h2>
      </el-col>
    </el-row>
    <el-row style="height:100%;">
      <el-col :span="6" >
        <span style="color:#2853d0;">该数据截止时间：{{rankingEndTime}} </span>  
     </el-col>
     <el-col :span="4" :offset="12">
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
            label="上榜玩家" width="100">
              <template  slot-scope="scope">
                <span  v-html="scope.row.nickname"></span>
              </template>
            </el-table-column>

            <el-table-column
             label="能量奖励" width="100">
              <template  slot-scope="scope">
                <span>{{ scope.row.rewardValue }}</span>
              </template>
            </el-table-column>

            <el-table-column label="礼品奖励" >
              <template  slot-scope="scope">
                <span>{{scope.row.rewardName}}</span>
              </template>
            </el-table-column>

            <el-table-column
            label="上榜名次" width="100">
              <template  slot-scope="scope">
                <span>{{rank[scope.row.rankOrders]}}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="姓名">
              <template  slot-scope="scope">
                <span>{{ scope.row.receiverName }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="联系电话">
              <template  slot-scope="scope">
                <span>{{ scope.row.receiverPhone }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="收货地址" width="280">
              <template  slot-scope="scope">
                <span>{{ scope.row.receiverLocation }}</span>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
    
                  <el-button
                    size="mini"
                    @click="sendOrderIds(scope.row)" v-if="scope.row.ordersStatus == 2">发送物流</el-button>

              </template>

            </el-table-column>
        </el-table>
          <el-dialog title="发送物流" :visible.sync="dialogFormVisibl">
            <el-form v-model="from">
              <el-form-item label="物流公司" :label-width="formLabelWidth">
                <el-select v-model="shipperCode" placeholder="">
                  <el-option v-for="item in kuaidi" 
                        :key="item.id" 
                        :label="item.name"
                        :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="物流单号" :label-width="formLabelWidth">
                 <el-input type="text" v-model="from.logistics" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibl = false">取 消</el-button>
              <el-button type="primary" @click="handlerLogistics(from)">确 定</el-button>
            </div>
          </el-dialog>
      </el-col>
    </el-row>
  
    <el-row class="ordersList2">
      <el-col :span="24">
        <el-table
            border
            :data="exptableData"
            style="width: 100%;text-align:center;"
            id="exTable">

            <el-table-column
              label="会员编号">
              <template slot-scope="scope">
                  <span>{{ scope.row.userId }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="订单编号">
              <template slot-scope="scope">
                  <span>{{ scope.row.ordersId }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="状态">
              <template slot-scope="scope">
                  <span>{{status[scope.row.status]}}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="下单时间">
              <template slot-scope="scope">
                  <span>{{ scope.row.created }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="付款时间">
              <template slot-scope="scope">
                  <span>{{ scope.row.payTime }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="发货单号">
              <template slot-scope="scope">
                  <span>{{ scope.row.expressNum }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="收货人">
              <template slot-scope="scope">
                  <span>{{ scope.row.receiverName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="收货人手机号">
              <template slot-scope="scope">
                  <span>{{ scope.row.receiverPhone }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="收货地址">
              <template slot-scope="scope">
                  <span>{{ scope.row.receiverLocation }}</span>
              </template>
            </el-table-column>

            <el-table-column label="商品编号">
              <template slot-scope="scope">
                <span>{{ scope.row.productId }}</span>
              </template>
            </el-table-column>

            <el-table-column label="商品名称">
              <template slot-scope="scope">
                <span>{{ scope.row.productTitle }}</span>
              </template>
            </el-table-column>

            <el-table-column label="商品价格">
              <template slot-scope="scope">
                <span>{{ scope.row.productPrice }}</span>
              </template>
            </el-table-column>

            <el-table-column label="商品规格">
              <template slot-scope="scope">
                <span>{{ scope.row.productParamText }}</span>
              </template>
            </el-table-column>

            <el-table-column label="商品数量">
              <template slot-scope="scope">
                <span>{{ scope.row.productNumber }}</span>
              </template>
            </el-table-column>

            <el-table-column label="订单价格">
              <template slot-scope="scope">
                <span>{{ scope.row.priceTotal }}</span>
              </template>
            </el-table-column>

            <el-table-column label="备注">
              <template slot-scope="scope">
                <span>{{ scope.row.remarks }}</span>
              </template>
            </el-table-column>

        </el-table>
      </el-col>
    </el-row>
  </section>
</template>

<style>
h2 {
  display: inline-block;
  color: red;
  margin-left: 20px;
}
.flex-box {
  display: flex;
  align-items: center;
  height: 40px;
}
.ordersList2 {
  display: none;
}
.ordersList {
  margin-top: 50px;
}
.thumnial {
  width: 100px;
  height: 100px;
}
.select-box {
  max-width: 160px;
}
.el-table .success-row {
  background: #f0f9eb;
}
.flex-box .el-radio__input {
    display: none;
}
.el-radio+.el-radio {
    margin-left: 10px;
}
</style>

<script type="text/javascript">
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { exportTb } from '@/config/mUtils';
import { getStore } from "@/config/mUtils";
export default {
  name: "RankList",
  data() {
    return {
      i: 1,
      excelUrl: '',
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
      options: [
        {
          name: '全部状态',
          status: ''
        },
        {
          name: "待付款",
          status: 1
        },
        {
          name: "待发货",
          status: 2
        },
        {
          name: "已发货",
          status: 3
        },
        {
          name: "提醒发货",
          status: 4
        },
        {
          name: "仅退款",
          status: 5
        },
        {
          name: "退货退款",
          status: 6
        },
        {
          name: "已收货",
          status: 7
        },
        {
          name: '已评价',
          status: 8
        },
        {
          name: '已退款',
          status: 9
        },
        {
          name: "已取消",
          status: 0
        }
      ],
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
          url: baseUrl + "promise/ranking/export/excel",
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
    queryWinner (cycleNumber) {
      $.get(
        baseUrl + "promise/ranking/get/list",
        {
          token: this.token,
          cycleNumber: cycleNumber
        },
        data => {
          if (data.status == 200) {
            this.tableData = data.bean.rankingList;
            this.total = data.total;
            this.cycleNumberList = data.bean.cycleNumberList
            this.CurrentRankCycle = data.bean.CurrentRankCycle
            this.totalRankCycle = data.bean.totalRankCycle
            this.rankingEndTime = data.bean.rankingEndTime
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
    // 发送物流
    handlerLogistics(from) {
      this.dialogFormVisibl = false;
      $.ajax({
        url: baseUrl + "promise/ranking/logistics/notify",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          number: from.logistics,
          ordersId: this.orderId,
          shipperCode: this.shipperCode
        }
      })
      .done(data => {
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "发货成功"
          });
          this.queryByTime()
        } else {
          this.$message.error(data.msg);
        }
      })
      .fail(function(data) {
        console.log(data);
      });
    },
    //获取一个订单
    getOneOrders(from) {
      console.log(from);
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
    }
  },

  created() {
    this.queryWinner()
  }
};
</script>