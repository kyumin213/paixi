<template>
  <section class="el-container wrapper is-vertical">
    <!-- 商品列表 -->
    <el-row class="goodslist">
      <el-col :span="24">
        <el-table
            border
            :data="tableData"
            style="width: 100%;text-align:center;"
            :row-class-name="tableRowClassName">
            <el-table-column
            label="商品编号" width="160">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="封面缩略图"
            >
              <template  slot-scope="scope">
                <img v-bind:src="scope.row.giftPictureCover" class="thumnial">
              </template>
            </el-table-column>

            <el-table-column
            label="商品名称" width="160">
              <template  slot-scope="scope">
                <span>{{ scope.row.giftTitle }}</span>
              </template>
            </el-table-column>

            <el-table-column label="库存">
              <template  slot-scope="scope">
                <span>{{ scope.row.giftStock }}</span>
              </template>
            </el-table-column>

            <el-table-column label="已兑换" >
              <template  slot-scope="scope">
                <span>{{ scope.row.giftConsume }}</span>
              </template>
            </el-table-column>

            <el-table-column label="排序" >
              <template  slot-scope="scope">
                <span>{{ scope.row.sortOrder }}</span>
              </template>
            </el-table-column>

            <el-table-column label="状态">
              <template  slot-scope="scope">
                <span v-if="scope.row.promiseStatus == 1">愿望</span>
                <span v-if="scope.row.promiseStatus == 0">非愿望</span>
              </template>
            </el-table-column>

            <el-table-column label="更新时间" width="200">
              <template  slot-scope="scope">
                <span>{{scope.row.updated}}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="600">
              <template slot-scope="scope">
                 <el-button
                  size="mini"
                  @click="handleDelete(scope.$index, scope.row)" type="danger">删除</el-button>                  
                  <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>                  
                  <el-button
                  size="mini"
                  @click="handleSetEnable(scope.$index, scope.row)" type="primary" v-if="scope.row.promiseStatus == 0">选为愿望</el-button>
                  <el-button
                  size="mini"
                  @click="handleSetDisable(scope.$index, scope.row)" type="primary" v-if="scope.row.promiseStatus == 1">下架愿望</el-button>
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
.thumnial {
  width: 100px;
  height: 100px;
}
.select-two {
  width: 160px;
  margin-top: 10px;
}
.select-one{
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
  name: "GiftsList",
  data() {
    return {
      options: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: "0",
          label: "下架"
        },
        {
          value: "1",
          label: "上架"
        }
      ],
      token: getStore("token"),
      total: 0,
      currentPage: 1,
      loading: false,
      tableData: [],
      statusvalue: "",
      valueDate: []
    };
  },
  methods: {
    formatDate(ns) {
      var d = new Date(ns);
      var dformat =
        [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("-") +
        " " +
        [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
      return dformat;
    },
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      console.log(val);
      this.goodsFilterFun(this.currentPage);
    },
    goodsFilterFun(pageBegin) {
      $.get(
        baseUrl + "promise/get/list",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
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
    tableRowClassName({ row, rowIndex }) {
      if (row.promiseStatus == false) {
        return "off-row";
      }
      return "";
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditGifts${row.id}` })
    },
    handleDelete(index, row) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        $.ajax({
          url: baseUrl + 'promise/delete',
          type: 'POST',
          dataType: 'json',
          data: {
            token: this.token,
            id: row.id
          }
        })
        .done((data) => {
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.goodsFilterFun(this.currentPage)
          } else {
            this.$message({
              type: "error",
              message: data.msg
            })
          }
        })
        
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除!"
        });
      });
    },
    handleSetEnable (index, row) {
      $.ajax({
        url: baseUrl + 'promise/modify/enable',
        type: 'POST',
        dataType: 'json',
        data: {
          token: this.token,
          id: row.id
        }
      })
      .done((data) => {
        if (data.status == 200) {
          this.goodsFilterFun(this.currentPage)
        } else {
          this.$message({
            type: "error",
            message: data.msg
          })
        }
      })
    },
    handleSetDisable (index, row) {
      $.ajax({
          url: baseUrl + 'promise/modify/disable',
          type: 'POST',
          dataType: 'json',
          data: {
            token: this.token,
            id: row.id
          }
        })
        .done((data) => {
          if (data.status == 200) {
            this.goodsFilterFun(this.currentPage)
          } else {
            this.$message({
              type: "error",
              message: data.msg
            })
          }
        })
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'EditGifts' || from.name === 'AddGifts') {
        this.goodsFilterFun(1);
      }
    }
  },
  created() {
    this.goodsFilterFun(
      1
    );
  }
};
</script>