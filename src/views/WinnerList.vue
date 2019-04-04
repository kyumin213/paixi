<template>
  <section class="el-container wrapper is-vertical">
    <el-row style="margin-bottom:30px;">
      <el-col :span="4" :offset="6">
        今日兑奖总数<h2>{{exchangeDayNumber}}</h2>
      </el-col>
      <el-col :span="4">
        本周兑奖总数<h2>{{exchangeWeekNumber}}</h2>
      </el-col>
      <el-col :span="4">
        本月兑奖总数<h2>{{exchangeMonthNumber}}</h2>
      </el-col>
    </el-row>
    <el-row style="height:100%;">
      <el-col :span="4" :offset="12">
        <div class="flex-box">
          <el-radio v-model="agoDays" label="0" @change="queryByTime">今日</el-radio>
          <el-radio v-model="agoDays" label="1" @change="queryByTime">昨日</el-radio>
          <el-radio v-model="agoDays" label="7" @change="queryByTime">最近七日</el-radio>
          <el-radio v-model="agoDays" label="30" @change="queryByTime">最近30日</el-radio>
        </div>          
     </el-col>
      <!-- 按日期搜索 -->
      <el-col :span="6">
        <el-date-picker
          v-model="valueDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="queryByTime">
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-button @click="exportExcelFilter" style="margin-top: 2px;" size="medium" type="primary">导出数据</el-button>
        <!-- <a v-bind:href="excelUrl" type="primary" class="el-button el-button--success el-button--medium" v-if="excelUrl">下载Excel</a> -->
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
            label="兑换玩家" width="100">
              <template  slot-scope="scope">
                <span  v-html="scope.row.nickname"></span>
              </template>
            </el-table-column>

            <el-table-column
             label="奖品" width="100">
              <template  slot-scope="scope">
                <span>{{ scope.row.giftTitle }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="奖品金额" width="100">
              <template  slot-scope="scope">
                <span>{{ scope.row.giftPrice }}</span>
              </template>
            </el-table-column>

            <el-table-column label="兑奖时间" >
              <template  slot-scope="scope">
                <span>{{scope.row.exchangeTime}}</span>
              </template>
            </el-table-column>

            <el-table-column
            label="姓名" width="100">
              <template  slot-scope="scope">
                <span  v-html="scope.row.receiverName"></span>
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
  
    <div class="block" style="margin:50px auto;">
      <el-pagination
        @current-change="handleCurrentChangeQuery"  
        :current-page="currentPage"
        :page-size="10"  
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
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
  name: "WinnerList",
  data() {
    return {
      i: 1,
      excelUrl: '',
      tableData: [],
      exptableData: [],
      shipperCode: '',
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
      shipperCode: ""
    };
  },
  methods: {
    exportExcel () {
      if (this.valueDate == null || this.valueDate.length == 0) {
        $.get(
          baseUrl + "promise/orders/export/excel/by/filter",
          {
            token: this.token,
            id: this.orderValue,
            agoDays: this.agoDays,
            category: 0
          },
          data => {
            this.exptableData = data.bean
            this.i++
            setTimeout(()=>{
                exportTb('#exTable',"商城订单所有时间" + '.xlsx')                    
            },2000)
          }
        )
      } else {
        $.get(
          baseUrl + "promise/orders/export/excel/by/filter",
          {
            token: this.token,
            agoDays: this.agoDays,
            timeBegin: this.valueDate[0],
            timeEnd: this.valueDate[1],
            category: 0
          },
          data => {
            this.exptableData = data.bean
            this.i++
            setTimeout(()=>{  
                exportTb('#exTable',"商城订单 "+ this.valueDate[0] +'至'+this.valueDate[1] + '.xlsx')                            
            },2000)
          }
        )
      }
    },
    exportExcelFilter () {
      if (this.valueDate == null || this.valueDate.length == 0) {
        $.ajax({
          url: baseUrl + "promise/orders/export/excel/by/filter",
          type: "POST",
          dataType: "json",
          data: {
            token: this.token,
            agoDays: this.agoDays
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
      } else {
        $.ajax({
          url: baseUrl + "promise/orders/export/excel/by/filter",
          type: "POST",
          dataType: "json",
          data: {
            token: this.token,
            agoDays: this.agoDays,
            timeBegin: this.valueDate[0],
            timeEnd: this.valueDate[1]
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
      }      
    },
    handleCurrentChangeQuery (val) {
      this.currentPage = val;
      if (this.valueDate == null) {
        this.queryWinner2(this.currentPage,this.agoDays)
      } else {
        if (this.valueDate.length == 2) {
          this.agoDays = ''
          this.queryWinner(this.currentPage,'',this.valueDate[0],this.valueDate[1])
        } else {
          this.queryWinner(this.currentPage,this.agoDays,this.valueDate[0],this.valueDate[1])
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status == 0) {
        return "off-row";
      }
      return "";
    },
    queryByTime () {
      if (this.valueDate == null) {
        this.queryWinner2(this.currentPage,this.agoDays)
      } else {       
        if (this.valueDate.length == 2) {
          this.agoDays = ''          
          this.queryWinner(this.currentPage,'',this.valueDate[0],this.valueDate[1])
        } else {
          this.queryWinner(this.currentPage,this.agoDays,this.valueDate[0],this.valueDate[1])
        }
      }
    },
    queryWinner2 (pageBegin,agoDays) {
      $.get(
        baseUrl + "promise/orders/get/list",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          agoDays: agoDays,
        },
        data => {
          console.log(data);
          if (data.status == 200) {
            this.tableData = data.bean.promiseOrdersList
            this.total = data.total;
            this.exchangeDayNumber = data.bean.exchangeDayNumber
            this.exchangeMonthNumber = data.bean.exchangeMonthNumber
            this.exchangeWeekNumber = data.bean.exchangeWeekNumber
          }
        }
      );
    },
    queryWinner (pageBegin, agoDays, timeBegin, timeEnd) {
      $.get(
        baseUrl + "promise/orders/get/list",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          agoDays: agoDays,
          timeBegin: timeBegin,
          timeEnd: timeEnd
        },
        data => {
          if (data.status == 200) {
            this.tableData = data.bean.promiseOrdersList;
            this.total = data.total;
            this.exchangeDayNumber = data.bean.exchangeDayNumber
            this.exchangeMonthNumber = data.bean.exchangeMonthNumber
            this.exchangeWeekNumber = data.bean.exchangeWeekNumber
          } else {
            alert(data.msg)
          }
        }
      );
    },
    sendOrderIds(row) {
      this.dialogFormVisibl = true;
      this.orderId = row.id;
      this.phone = row.receiverPhone
    },
    handlerLogistics(from) {
      this.dialogFormVisibl = false;
      $.ajax({
        url: baseUrl + "promise/orders/logistics/notify",
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
    this.queryWinner(1, this.agoDays, this.valueDate[0], this.valueDate[1])
  }
};
</script>