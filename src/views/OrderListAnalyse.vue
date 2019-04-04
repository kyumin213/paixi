<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <el-row style="height:100%;">
      <!-- 按编号搜索 -->
      <el-col :span="4">
        <el-input v-model="orderValue" placeholder="订单编号" @blur="queryByTime" style="width:80%;"></el-input>
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
            label="订单编号" width="160">
            <template slot-scope="scope">
                <span>{{ scope.row.ordersId }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="活动发起人" width="100">
              <template  slot-scope="scope">
                <span v-html="scope.row.makerNickname"></span>
              </template>
            </el-table-column>

            <el-table-column
             label="活动名称" width="100">
              <template  slot-scope="scope">
                <span>{{ scope.row.activityName }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="分享量" >
              <template  slot-scope="scope">
                <span>{{ scope.row.shareNum }}</span>
              </template>
            </el-table-column>
            
            <el-table-column
             label="参与量">
              <template  slot-scope="scope">
                <span>{{ scope.row.partakeNum }}</span>
              </template>
            </el-table-column>

            <el-table-column label="转化率">
              <template  slot-scope="scope">
                <span>{{ scope.row.conversion }}</span>
              </template>
            </el-table-column>

            <el-table-column label="状态" width="100">
              <template  slot-scope="scope">
                <span>{{status[scope.row.giftStatus]}}</span>
              </template>
            </el-table-column>

             <el-table-column label="中奖人">
              <template  slot-scope="scope">
                <span v-html="scope.row.bingoNickname"></span>
              </template>
            </el-table-column>

            <el-table-column label="更新时间" >
              <template  slot-scope="scope">
                <span>{{scope.row.updated}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    @click="handleQuery(scope.$index, scope.row)">查看</el-button>

                  <el-button v-show="scope.row.status == 2"
                    size="mini"
                    @click="sendOrderIds(scope.row)">发送物流</el-button>

                  <el-button v-show="scope.row.status == 2"
                    size="mini"
                    @click="handRefund(scope.$index, scope.row)">退款</el-button>
              </template>

            </el-table-column>
        </el-table>
          <el-dialog title="发送物流" :visible.sync="dialogFormVisibl">
            <el-form v-model="from">
              <el-form-item label="手机号码" :label-width="formLabelWidth">
                <el-input type="text" v-model="phone" auto-complete="off"></el-input>
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
    <!-- 处理退款 -->
    <el-dialog title="退款" :visible.sync="dialogFormVisiblerefund">
      <el-form v-model="from">
        <el-form-item label="退款金额" :label-width="formLabelWidth">
          <el-input type="text" v-model="from.refundsPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="退款原因" :label-width="formLabelWidth">
            <el-input type="text" v-model="from.refundsReason" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblerefund = false">取 消</el-button>
        <el-button type="primary" @click="handlerrefundFun(from)">确 定</el-button>
      </div>
    </el-dialog>
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
  name: "OrderListqiaoqiao",
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
     
      value: "",
      orderValue: "",
      token: getStore("token"),
      valueDate: [],
      options1: [],
      formLabelWidth: "120px",
      orderId: "",
      statusvalue: '',
      status: ["未开奖", "已开奖", "待发货", "已发货", "提醒发货", "仅退款", "退货退款", "已收货", "已评价", "已退款"]
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
      // console.log(this.valueDate)
      this.queryByTimeFun(1,this.statusvalue,this.valueDate[0],this.valueDate[1],this.orderValue)
    },
    queryByTimeFun (pageBegin,status,timeBegin,timeEnd,id) {
      $.get(
        baseUrl + "major/orders/get/filter",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          status: status,
          timeBegin: timeBegin,
          timeEnd: timeEnd,
          id: id,
          category: 1
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
      this.phone = row.phone
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
      this.$router.push({ path: `/OrdersProducts${row.ordersId}` })
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
    // this.getList(1);
    this.queryByTimeFun(1,this.statusvalue,this.valueDate[0],this.valueDate[1],this.orderValue)
  }
};
</script>