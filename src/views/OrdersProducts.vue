<template>
  <section class="el-container wrapper is-vertical">
    <el-row class="ordersList">
      <el-col :span="24">
        <el-table
            border
            :data="tableData"
            style="width: 100%;text-align:center;">
            <el-table-column
            label="商品编号" width="200">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="商品名称" width="300">
              <template  slot-scope="scope">
                <span>{{ scope.row.productTitle }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="商品价格" width="160">
              <template  slot-scope="scope">
                <span>{{ scope.row.productPrice }}</span>
              </template>
            </el-table-column>

            <el-table-column label="商品规格" width="180">
              <template  slot-scope="scope">
                <span v-if="scope.row.productParamText">{{JSON.parse(scope.row.productParamText).propName}}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="商品图片" width="200">
              <template  slot-scope="scope">
                <img v-bind:src="scope.row.productPicture" class="thumnial">
              </template>
            </el-table-column>

            <el-table-column label="商品数量" width="100">
              <template  slot-scope="scope">
                <span>{{ scope.row.num }}</span>
              </template>
            </el-table-column>

            <el-table-column label="更新时间" width="200">
              <template  slot-scope="scope">
                <span>{{formatDate(scope.row.updated)}}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" width="200">
              <template  slot-scope="scope">
                <span>{{formatDate(scope.row.created)}}</span>
              </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row>
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
  name: "OrdersProducts",
  data() {
    return {
      id: this.$route.params.id,
      tableData: [],
      loading: false,
      token: getStore("token"),
      specifications:"",
    };
  },
  mounted() {
  
  },
  methods: {
    getOrdersByProducts() {
      console.log(this.token);
      console.log(this.id);
      jQuery.get(
        baseUrl + "orders/get/orders/by/products",
        { token: this.token, ordersId: this.id },
        data => {
          this.tableData = data.bean;
          // this.tableData.sort(compareDown("created"));
          console.log(this.tableData);
        }
      );
    },

    tableRowClassName({ row, rowIndex }) {
      if (row.status == 0) {
        return "off-row";
      }
      return "";
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
  watch: {
    '$route' (to, from) {
      if (from.path === '/orderList' || from.path === '/OrderListAnalyse' || from.path === '/OrderListqiaoqiao' || from.path === '/OrdersListOpenBox'|| from.path === '/OrdersListPuzzle'|| from.path === '/OrdersListInterlocution'|| from.path === '/OrdersListGroupGifts'|| from.path === '/OrdersListDice'|| from.path === '/OrdersListDirect' || from.path == '/OrdersListFreeActivity') {
        this.id = to.params.id
        this.getOrdersByProducts()
      }
    }
  },
  created() {
    this.getOrdersByProducts();
  }
};
</script>