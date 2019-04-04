<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <el-row>
      <el-col :span="2" :offset="22">
        <el-button  size="mini" @click="exReceiver" type="success" v-if="tableData.length > 0">导出收货人</el-button>
      </el-col>
    </el-row>
    <el-row class="ordersList">
      <el-col :span="24">
        <el-table
            border
            :data="tableData"
            style="width: 100%;text-align:center;"
            >
            <el-table-column
             label="参与人昵称">
              <template  slot-scope="scope">
                <span v-html="scope.row.nickname"></span>
              </template>
            </el-table-column>

            <el-table-column
            label="参与人头像">
              <template  slot-scope="scope">
                <img v-bind:src="scope.row.picture" class="thumnial">
              </template>
            </el-table-column>

            <el-table-column
             label="参与人手机号">
              <template  slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="收货人">
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
             label="收货地址" width="300">
              <template  slot-scope="scope">
                <span>{{ scope.row.receiverLocation }}</span>
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
                          @click="handleQueryJoiner(scope.row)">查看参与人</el-button>
                    <el-button
                          size="mini" v-show="(scope.row.addressId != 'PX_6666666666666' && scope.row.addressId  !='PX_5555555555555')&&scope.row.expressStatus==0"
                          @click="sendOrderIds(scope.row)">发送物流</el-button>
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
  </section>
</template>

<style>
.ordersList {
  margin-top: 20px;
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
  name: "ConsigneesList",
  data() {
    return {
      token: getStore("token"),
      tableData: [],
      shipperCode: "",
      phone: "",
      id: this.$route.params.id,
      formLabelWidth: "120px",
      dialogFormVisibl: false,
      userId: "",
      from: {
        phone: "",
        logistics: ""
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
    };
  },
  methods: {
    exReceiver () {
      $.ajax({
        url: baseUrl + "orders/free/export/address/List",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          ordersId: this.id
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
    sendOrderIds(row) {
      this.dialogFormVisibl = true;
      this.orderId = row.id;
      this.phone = row.receiverPhone;
      this.userId = row.userId;
    },
    queryConsignees() {
      jQuery.get(
        baseUrl + "orders/free/address/List",
        {
          token: this.token,
          ordersId: this.id
        },
        data => {
          console.log(data);
          this.tableData = data.bean || [];
        }
      );
    },
    handleQueryJoiner (row) {
      this.$router.push({ path: `/JoinerList${row.userId}` })
    },
    handlerLogistics(from) {
      this.dialogFormVisibl = false;
      $.ajax({
        url: baseUrl + "orders/free/logistics/notify",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          shipperCode: this.shipperCode,
          number: from.logistics,
          ordersId: this.id,
          userId: this.userId
        }
      })
        .done(data => {
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "发货成功"
            });
            this.queryConsignees();
          } else {
            this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.path === '/OrdersListFreeActivity') {
        this.id = to.params.id
        this.queryConsignees()
      }
    }
  },
  created() {
    this.queryConsignees();
  }
};
</script>