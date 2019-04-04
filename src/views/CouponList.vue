<template>
  <section class="el-container wrapper is-vertical">
    <el-row style="height:100%;">
        <!-- 按名称搜索 -->
      <el-col :span="4">
        <el-input v-model="id" placeholder="优惠券ID" @blur="queryByTime" style="width:80%;"></el-input>
      </el-col>

      <!-- 按名称搜索 -->
      <el-col :span="4">
        <el-input v-model="couponName" placeholder="优惠券名称" @blur="queryByTime" style="width:80%;"></el-input>
      </el-col>
     
      <el-col :span="4">
        <!-- 按日期搜索 -->
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
    <el-row class="interlocutionlist">
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column
            label="优惠券ID"
            width="200">
                <template  slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="优惠券名称"
            width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.couponName}}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="优惠券分类"
            width="100"> 
                <template slot-scope="scope" >
                   <span>{{couponUseType[scope.row.classify]}}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="优惠券满足金额"
            width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.fullPrice}}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="优惠券满足类型"
            width="150">
                <template slot-scope="scope">
                  <span>{{couponType[scope.row.fullType]}}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="优惠券满减金额"
            width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.reducePrice}}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="优惠券数量"
            width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.couponNum}}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="优惠券使用期限"
            width="250">
                <template slot-scope="scope">
                    <span>{{ scope.row.startDate}}-{{ scope.row.endDate}}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="创建日期"
            width="">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span>{{ scope.row.created}}</span>
            </template>
            </el-table-column>

            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <!-- <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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
.thumnial32 {
  width: 32px;
}

.interlocutionlist {
  margin-top: 60px;
}
</style>

<script>
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { getStore } from "@/config/mUtils";
export default {
  name: "CouponList",
  data() {
    return {
      token: getStore("token"),
      tableData: [],
      total: 0,
      currentPage: 1,
      id: "",
      couponName: "",
      problems: "",
      valueDate: [],
      couponType: ["", "下单立减", "满减", "满量则减"],
      couponUseType: ["", "通用", "关联吐槽使用", "关联商品使用"]
    };
  },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.status == 0) {
        return "off-row";
      }
      return "";
    },

    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      this.queryByCoupon(
        val,
        this.id,
        this.couponName,
        this.valueDate[0],
        this.valueDate[1]
      );
    },

    queryByTime() {
      console.log(this.valueDate[0], this.valueDate[1]);
      console.log(this.couponName);
      this.queryByCoupon(
        1,
        this.id,
        this.couponName,
        this.valueDate[0],
        this.valueDate[1]
      );
    },

    queryByCoupon(pageBegin, id, couponName, startDate, endDate) {
      jQuery.get(
        baseUrl + "user/coupon/select/all",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          id: id,
          couponName: couponName,
          startDate: startDate,
          endDate: endDate
        },
        data => {
          console.log(data);
          this.tableData = data.bean;
          this.total = data.total;
        }
      );
    },

    handleEdit(index, row) {
      var id = row.id;
      console.log(id);
      this.$router.go(0);
      this.$router.push({ name: "EditCoupon", params: { id: row.id } });
    },

    handleDelete(index, row) {
      var id = row.id;
      $.ajax({
        url: baseUrl + "user/coupon/delete",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          id: id
        }
      })
        .done(data => {
          console.log(data);
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.queryByCoupon(
              this.currentPage,
              this.couponName,
              this.valueDate[0],
              this.valueDate[1]
            );
          } else {
            this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    }
  },
  created() {
    this.queryByCoupon(
      1,
      this.id,
      this.couponName,
      this.valueDate[0],
      this.valueDate[1]
    );
  }
};
</script>
