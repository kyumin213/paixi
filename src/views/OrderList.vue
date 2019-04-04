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
      <el-col :span="4">
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
            label="订单编号" width="160">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="订单价格" width="100">
              <template  slot-scope="scope">
                <span>{{ scope.row.priceTotal }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="收货人" width="100">
              <template  slot-scope="scope">
                <span>{{ scope.row.receiverName }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="收货人手机号">
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

            <el-table-column label="发票信息">
              <template  slot-scope="scope">
                <span>{{ scope.row.invoiceId }}</span>
              </template>
            </el-table-column>

            <el-table-column label="状态" width="100">
              <template  slot-scope="scope">
                <span>{{status[scope.row.status]}}</span>
              </template>
            </el-table-column>

             <el-table-column label="备注">
              <template  slot-scope="scope">
                <span>{{ scope.row.remarks }}</span>
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
              <el-form-item label="物流公司" :label-width="formLabelWidth">
                <el-select v-model="shipperCode" placeholder="">
                  <el-option v-for="item in kuaidi" 
                        :key="item.id" 
                        :label="item.name"
                        :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="手机号码" :label-width="formLabelWidth">
                <el-input type="text" v-model="phone" auto-complete="off"></el-input>
              </el-form-item> -->
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
</style>

<script type="text/javascript">
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { exportTb } from '@/config/mUtils';
import { getStore } from "@/config/mUtils";
export default {
  name: "OrderList",
  data() {
    return {
      i: 1,
      shipperCode: '',
      excelUrl: '',
      tableData: [],
      exptableData: [],
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
      status: ["取消订单", "待付款", "待发货", "已发货", "提醒发货", "仅退款", "退货退款", "已收货", "已评价", "已退款"]
    };
  },
  methods: {
    exportExcel () {
      if (this.valueDate == null || this.valueDate.length == 0) {
        $.get(
          baseUrl + "orders/export/by/filter",
          {
            token: this.token,
            id: this.orderValue,
            status: this.statusvalue,
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
          baseUrl + "orders/export/by/filter",
          {
            token: this.token,
            id: this.orderValue,
            status: this.statusvalue,
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
          url: baseUrl + "orders/export/excel/by/filter",
          type: "POST",
          dataType: "json",
          data: {
            token: this.token,
            id: this.orderValue,
            status: this.statusvalue,
            category: 0
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
          url: baseUrl + "orders/export/excel/by/filter",
          type: "POST",
          dataType: "json",
          data: {
            token: this.token,
            id: this.orderValue,
            status: this.statusvalue,
            timeBegin: this.valueDate[0],
            timeEnd: this.valueDate[1],
            category: 0
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
      if (this.valueDate == null) {
        this.queryByTimeFun2(this.currentPage,this.statusvalue,this.orderValue)
      } else {
        this.queryByTimeFun(this.currentPage,this.statusvalue,this.valueDate[0],this.valueDate[1],this.orderValue)
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
        this.queryByTimeFun2(this.currentPage,this.statusvalue,this.orderValue)
      } else {
        this.queryByTimeFun(this.currentPage,this.statusvalue,this.valueDate[0],this.valueDate[1],this.orderValue)
      }
    },
    queryByTimeFun2 (pageBegin,status,id) {
      $.get(
        baseUrl + "orders/get/all/filter",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          status: status,
          id: id,
          category: 0
        },
        data => {
          console.log(data);
          if (data.status == 200) {
            this.tableData = data.bean;
            if (this.tableData) {
              this.tableData.sort(compareDown("updated"));
            }
            this.total = data.total;
          }
        }
      );
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
          category: 0
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
          shipperCode: this.shipperCode,
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
      this.$router.push({ path: `/OrdersProducts${row.id}` })
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