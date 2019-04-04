
<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <el-row style="height:100%;">
      <!-- 按编号搜索 -->
      <el-col :span="4">
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
      <!-- 按状态搜索 -->
      <el-col :span="4">
        <el-select placeholder="玩法查询" v-model="category" @change="queryByTime">
          <el-option
            v-for="item in categoryObj"
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
            label="订单编号">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>
            
            <el-table-column
            label="订单商品">
            <template slot-scope="scope">
                <img v-bind:src="scope.row.productPicture" class="thumnial">
            </template>
            </el-table-column>
            
            <el-table-column label="状态" >
              <template  slot-scope="scope">
                <span>{{status[scope.row.status]}}</span>
              </template>
            </el-table-column>

            <el-table-column label="玩法" >
              <template  slot-scope="scope">
                <span>{{playMethod[scope.row.category]}}</span>
              </template>
            </el-table-column>

            <el-table-column label="更新时间">
              <template  slot-scope="scope">
                <span>{{scope.row.updated}}</span>
              </template>
            </el-table-column>

            <el-table-column label="排序">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sortOrder" @blur="handleModifySortOrder(scope.$index, scope.row)"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="400px;">
              <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="removeActivity(scope.$index, scope.row)" type="danger" v-if="scope.row.status == 0"> 
                        <span>删除</span>
                    </el-button>
                    <el-button
                      size="mini"
                      @click="startActivity(scope.$index, scope.row)" type="primary" v-if="scope.row.status == 0"> 
                        <span>立刻启动</span>
                    </el-button>
                    <el-button
                      size="mini"
                      @click="handleStatus(scope.$index, scope.row)"  v-if="scope.row.status == 2">
                        <span>下架</span>
                    </el-button>
                    <el-button
                        size="mini"
                        @click="handleQuery(scope.$index, scope.row)">查看礼品</el-button>
                    <el-button 
                          size="mini"
                          @click="handleConsignees(scope.$index, scope.row)">查看收货人</el-button>
                    <!-- <el-button 
                         size="mini"
                         @click="exReceiver(scope.row)" type="success">导出收货人</el-button> -->
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
import { exportTb } from '@/config/mUtils'
import { getStore } from "@/config/mUtils";
export default {
  name: "OrdersListFreeActivity",
  data() {
    return {
      tableData: [],
      exptableData: [],
      excelUrl: '',
      phone: "",
      dialogFormVisibl: false,
      dialogFormVisiblerefund: false,
      refundId: "",
      loading: false,
      total: 0,
      currentPage: 1,
      from: {
        phone: "",
        logistics: "",
        refundsReason: "",
        refundsPrice: ""
      },
      playMethod:["","","","","","吐槽送礼","拼图送礼","答题送礼","","摇骰子送礼"],
      options: [
        {
          name: "全部状态",
          status: ""
        },
        {
          name: "待启动",
          status: 0
        },
        {
          name: "进行中",
          status: 1
        },
        {
          name: "已结束",
          status: 2
        },
        {
          name: "已下架",
          status: 3
        },
        {
          name: "已取消",
          status: 4
        }
      ],
      categoryObj: [
        {
          name: "全部玩法",
          status: "99"
        },
        {
          name: "吐槽活动",
          status: 5
        },
        {
          name: "拼图活动",
          status: 6
        },
        {
          name: "答题活动",
          status: 7
        },
        {
          name: "摇骰子活动",
          status: 9
        }
      ],
      value: "",
      orderValue: "",
      token: getStore("token"),
      valueDate: [],
      options1: [],
      formLabelWidth: "120px",
      orderId: "",
      statusvalue: "",
      category: '99',
      status: [
        "待启动",
        "进行中",
        "已结束",
        "已下架",
        "已取消"
      ],
      categoryName: ["","","","","","免费吐槽活动订单","免费拼图活动订单","免费答题活动订单","","免费摇骰子活动订单"]
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
            category: this.category
          },
          data => {
            this.exptableData = data.bean
            this.i++
            setTimeout(()=>{
                if (this.category != '99') {
                  exportTb('#exTable',this.categoryName[this.category] + "所有时间" + '.xlsx')                    
                } else {
                  exportTb('#exTable',"所有免费活动所有时间" + '.xlsx')                                      
                }
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
            category: this.category
          },
          data => {
            this.exptableData = data.bean
            this.i++
            setTimeout(()=>{
              if (this.category != '') {
                exportTb('#exTable',this.categoryName[this.category] + this.valueDate[0] +'至'+this.valueDate[1] + '.xlsx')                            
              } else {
                exportTb('#exTable',"所有免费活动 "+ this.valueDate[0] +'至'+this.valueDate[1] + '.xlsx')                            
              }
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
            category: this.category
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
            category: this.category
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
    exReceiver (row) {
      var ordersId = row.id
      $.ajax({
        url: baseUrl + "orders/free/export/address/List",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          ordersId: ordersId
        }
      })
      .done(data => {
        if (data.status == 200) {
          // this.excelUrl = data.bean
          window.location = data.bean   
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      if (this.valueDate == null) {
        this.queryByTimeFun2(this.currentPage,this.statusvalue,this.orderValue,this.category)
      } else {
        this.queryByTimeFun(this.currentPage,this.statusvalue,this.valueDate[0],this.valueDate[1],this.orderValue,this.category)
      }
    },
    removeActivity: function (index, row) {
     var id = row.id;
     $.ajax({
        url: baseUrl + "orders/free/activity/time/remove",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          ordersId: id,
        }
      })
      .done(data => {
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "状态修改成功"
          });
          this.queryByTimeFun(
            this.currentPage,
            this.statusvalue,
            this.valueDate[0],
            this.valueDate[1],
            this.orderValue,
            this.category
          );
        } else {
            this.$message.error(data.msg);
        }        
      })
    },
    startActivity: function (index, row) {
     var id = row.id;
     $.ajax({
        url: baseUrl + "orders/free/activity/start/immediately",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          ordersId: id,
        }
      })
      .done(data => {
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "状态修改成功"
          });
          this.queryByTimeFun(
            this.currentPage,
            this.statusvalue,
            this.valueDate[0],
            this.valueDate[1],
            this.orderValue,
            this.category
          );
        } else {
            this.$message.error(data.msg);
        }        
      })
    },
    /**切换上下架状态 */
    handleStatus(index, row) {
      var id = row.id;
      var status = row.status;
      // status = status == 1 ? 0 : 1;
      // if (status == 1 || status == 2) {
      //   status = 0
      // } else {
      //   status = 1
      // }
      $.ajax({
        url: baseUrl + "orders/free/activity/modify",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          ordersId: id,
          status: 3
        }
      })
        .done(data => {
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "状态修改成功"
            });
            // this.getList(this.currentPage)
            this.queryByTimeFun(
              this.currentPage,
              this.statusvalue,
              this.valueDate[0],
              this.valueDate[1],
              this.orderValue,
              this.category
            );
          } else {
            this.$message.error(data.msg);
          }
        })
    },
    handleModifySortOrder(index,row) {
       var id = row.id
       var sortOrder = row.sortOrder
       $.ajax({
         url: baseUrl + 'orders/free/activity/sort/modify',
         type: "POST",
         dataType: "json",
         data: {
            token: this.token,
            ordersId: id,
            sortOrder: sortOrder
          }
        })
        .done(data => {
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "排序成功"
            });
            // this.getList(this.currentPage)
            this.queryByTimeFun(
              this.currentPage,
              this.statusvalue,
              this.valueDate[0],
              this.valueDate[1],
              this.orderValue,
              this.category
            );
          } else {
            this.$message.error(data.msg);
          }
        })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status == 0 || row.status == 3 || row.status == 4) {
        return "off-row";
      }
      return "";
    },
    queryByTime() {
      if (this.valueDate == null) {
        this.queryByTimeFun2(this.currentPage,this.statusvalue,this.orderValue,this.category)
      } else {
        this.queryByTimeFun(this.currentPage,this.statusvalue,this.valueDate[0],this.valueDate[1],this.orderValue,this.category)
      }
    },
    queryByTimeFun2(pageBegin, status, id, category) {
      $.get(
        baseUrl + "orders/free/get/all/filter",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          status: status,
          id: id,
          category: category
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
    queryByTimeFun(pageBegin, status, timeBegin, timeEnd, id, category) {
      $.get(
        baseUrl + "orders/free/get/all/filter",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          status: status,
          timeBegin: timeBegin,
          timeEnd: timeEnd,
          id: id,
          category: category
        },
        data => {
          console.log(data);
          if (data.status == 200) {
            this.tableData = data.bean;
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
      this.phone = row.receiverPhone;
    },
    handRefund(index, row) {
      console.log(row);
      this.dialogFormVisiblerefund = true;
      this.refundId = row.id;
    },
    handlerrefundFun(from) {
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
            this.$router.go(0);
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
            this.queryByTimeFun(
              this.currentPage,
              this.statusvalue,
              this.valueDate[0],
              this.valueDate[1],
              this.orderValue,
              this.category
            );
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

    handleConsignees(index, row){
      //  console.log(index, row)
      // this.$router.go(0)
      // this.$router.push({ name: 'ConsigneesList', params: { id: row.id }})
      this.$router.push({ path: `/ConsigneesList${row.id}` })
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
    this.queryByTimeFun(
      1,
      this.statusvalue,
      this.valueDate[0],
      this.valueDate[1],
      this.orderValue,
      this.category
    );
  }
};
</script>