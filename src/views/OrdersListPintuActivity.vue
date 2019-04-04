<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <el-row style="height:100%;">
      <!-- 按编号搜索 -->
      <el-col :span="4">
        <!-- multiple -->
        <!-- <el-select v-model="orderValue" filterable="" remote="" reserve-keyword placeholder="订单编号" :remote-method="remoteMethod" :loading="loading">
          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
        <el-input v-model="orderValue" placeholder="订单编号" @blur="queryByTime" style="width:80%;"></el-input>
      </el-col>
     
      <!-- 按状态搜索 -->
      <el-col :span="4">
        <el-select placeholder="状态查询" v-model="statusvalue" @change="queryByTime">
          <el-option
            v-for="item in options"
            :key="item.status"
            :label="item.name"
            :value="item.status">
          </el-option>
        </el-select>
      </el-col>
      <!-- 按日期搜索 -->
      <el-col :span="4">
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
    </el-row>

    <el-row class="ordersList">
      <el-col :span="24">
        <el-table
            border
            :data="tableData"
            style="width: 100%;text-align:center;"
            :row-class-name="tableRowClassName">
            <!-- <el-table-column
             label="用户ID" width="160">
              <template  slot-scope="scope">
                <span>{{ scope.row.userId }}</span>
              </template>
            </el-table-column> -->

            <el-table-column
            label="订单编号" width="300">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="订单价格" width="300">
              <template  slot-scope="scope">
                <span>{{ scope.row.priceTotal }}</span>
              </template>
            </el-table-column>

            <el-table-column label="状态" width="250">
              <template  slot-scope="scope">
                <span>{{status[scope.row.status]}}</span>
              </template>
            </el-table-column>

            <el-table-column label="更新时间" >
              <template  slot-scope="scope">
                <span>{{scope.row.updated}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="handleQuery(scope.$index, scope.row)">查看礼品</el-button>

                    <el-button 
                          size="mini"
                          @click="handleConsignees(scope.$index, scope.row)">查看收货人</el-button>
              </template>

            </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 处理退款 -->
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
</style>

<script type="text/javascript">
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { getStore } from "@/config/mUtils";
export default {
  name: "OrdersListOpenBox",
  data() {
    return {
      tableData: [],
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
      status: ["取消订单", "待付款", "待发货", "已发货", "提醒发货", "仅退款", "退货退款", "已收货", "已评价", "已退款"]
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log("每页" + val + "条");
    },
    handleCurrentChange(val) {
      console.log(`当前页:` + val);
      this.currentPage = val;
      this.getList(val);
    },
    handleCurrentChangeQuery (val) {
      this.currentPage = val;
      console.log(val)
      // this.queryByStatusFun(val,this.statusvalue);
      this.queryByTimeFun(val,this.statusvalue,this.valueDate[0],this.valueDate[1],this.orderValue)
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status == 0) {
        return "off-row";
      }
      return "";
    },
    queryByTime () {
      this.queryByTimeFun(1,this.statusvalue,this.valueDate[0],this.valueDate[1],this.orderValue)
    },
    queryByTimeFun (pageBegin,status,timeBegin,timeEnd,id) {
      $.get(
        baseUrl + "orders/get/all/filter",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          status: status,
          timeBegin: timeBegin,
          timeEnd: timeEnd,
          id: id,
          category: 6
        },
        data => {
          console.log(data);
          if (data.status == 200) {
            this.tableData = data.bean;
            if (this.tableData) {
              this.tableData.sort(compareDown("updated"));
            }
            this.total = data.total;
          } else {
            alert(data.msg)
          }
        }
      );
    },
    remoteMethod() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.options1 = this.list.filter(item => {
          return item.nam;
        });
      }, 200);
    },
    sendOrderIds(row) {
      this.dialogFormVisibl = true;
      this.orderId = row.id;
      this.phone = row.receiverPhone
    },
    handRefund (index,row) {
      console.log(row)
      this.dialogFormVisiblerefund = true;
      this.refundId = row.id;
    },
    handlerrefundFun (from) {
      $.ajax({
        url: baseUrl + "orders/refunds/handle",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          refundsPrice: from.refundsPrice,
          refundsReason: from.refundsReason,
          ordersId: this.refundId
        }
      })
      .done(data => {
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "退款成功"
          });
          this.dialogFormVisiblerefund = false;
          this.$router.go(0)
          // 退款完成之后修改订单状态
        } else {
          this.$message.error(data.msg);
        }
      })
      .fail(function(data) {
        console.log(data);
      });
    },
    handlerLogistics(from) {
      // var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      // if (!myreg.test(from.phone)) {
      //   this.$message.error("手机号码输入有误");
      //   return false;
      // }
      this.dialogFormVisibl = false;
      console.log(this.orderId);
      $.ajax({
        url: baseUrl + "orders/logistics/notify",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          phone: this.phone,
          number: from.logistics,
          ordersId: this.orderId
        }
      })
      .done(data => {
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "发货成功"
          });
          // this.getList(this.currentPage);
          this.queryByTimeFun(this.currentPage,this.statusvalue,this.valueDate[0],this.valueDate[1],this.orderValue)
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

    handleConsignees(index, row){
       console.log(index, row)
      this.$router.go(0)
      this.$router.push({ name: 'ConsigneesList', params: { id: row.id }})
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
    this.queryByTimeFun(1,this.statusvalue,this.valueDate[0],this.valueDate[1],this.orderValue)
  }
};
</script>