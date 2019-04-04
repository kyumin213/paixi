<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <!-- 搜索 -->
    <el-row style="height:100%;">
      <!-- 按编号搜索 -->
      <el-col :span="4">
        <el-input v-model="goodsId" placeholder="商品编号" @blur="goodsFilter" style="width:80%;"></el-input>
      </el-col>
      <!-- 按名称搜索 -->
      <el-col :span="4">
        <!-- multiple -->
        <el-input v-model="goodsTitle" placeholder="商品名称" @blur="goodsFilter" style="width:80%;"></el-input>        
      </el-col>
      <!-- 按卖点搜索 -->
      <el-col :span="4">
        <!-- multiple -->
        <el-input v-model="goodsSellpoint" placeholder="商品卖点" @blur="goodsFilter" style="width:80%;"></el-input>        
      </el-col>
      <!-- 按状态搜索 -->
      <el-col :span="4">
        <el-select v-model="statusvalue" placeholder="全部状态" @change="goodsFilter">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
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
          @change="goodsFilter">
        </el-date-picker>
      </el-col>
    </el-row>
    <!-- 搜索结束 -->
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
                <!-- <span>{{ scope.row.image }}</span> -->
                <img v-bind:src="scope.row.pictureCover" class="thumnial">
              </template>
            </el-table-column>

            <el-table-column
            label="商品名称" width="160">
              <template  slot-scope="scope">
                <span>{{ scope.row.title }}</span>
              </template>
            </el-table-column>

            <el-table-column label="库存">
              <template  slot-scope="scope">
                <span>{{ scope.row.stock }}</span>
              </template>
            </el-table-column>

            <el-table-column label="销量" >
              <template  slot-scope="scope">
                <span>{{ scope.row.sales }}</span>
              </template>
            </el-table-column>

            <el-table-column label="状态">
              <template  slot-scope="scope">
                <span v-if="scope.row.status == 1">上架</span>
                <span v-if="scope.row.status == 0">下架</span>
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
                  @click="gotoDetails(scope.$index, scope.row)" type="primary">选为活动商品</el-button>
                  <!-- <router-link :to="'/EditGoods/'+scope.row.id">
                    <el-button size="mini">编辑</el-button>
                  </router-link> -->
                  <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                  size="mini"
                  @click="handleStatus(scope.$index, scope.row)">
                    <span v-if="scope.row.status == 1">下架</span>
                    <span v-if="scope.row.status == 0">上架</span>
                  </el-button>
                  <a href="javascript:" @click="gotoLink(scope.row)" style="margin-left:20px;">商品外链</a>
                  <br>

                  <!-- <el-button
                  size="mini"
                  @click="gotoSpecial(scope.$index, scope.row)">查看所属专题</el-button> -->

                  <el-select class="select-one" v-model="scope.row.themeSelect" @change="getThemeLabelList(scope.$index, scope.row)" placeholder="添加到该专题">
                   <el-option
                      filterable 
                      v-for="item in themeOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select class="select-two" v-model="scope.row.themeLabelSelect" @change="addToTheme(scope.$index, scope.row)" placeholder="添加到该标签" :disabled="themeLabelSelectStatus">
                    <el-option
                      filterable 
                      v-for="item in themeLabelOptions"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <!-- <el-button
                  size="mini"
                  @click="handleLabels(scope.$index, scope.row)">添加/编辑标签</el-button> -->
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
    <el-dialog
      title="所属专题"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span v-for="item in specialList" :key="item.id">{{item.name}} | </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<style>
.goodslist {
  margin-top: 50px;
}
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
  name: "GoodsList",
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
      value: "",
      value1: [],
      value2: [],
      list: [],
      list2: [],
      loading: false,
      goodsTitle: "",
      goodsSellpoint: "",
      goodsId: "",
      tableData: [],
      themeOptions: [],
      themeLabelOptions: [],
      themeLabelSelectStatus: true,
      themeSelect: "",
      themeLabelSelect: "",
      statusvalue: "",
      valueDate: [],
      centerDialogVisible: false,
      specialList: []
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
    gotoLink (row) {
      var id = row.id
      $.get(baseUrl + 'product/get/remark/id',{ token: this.token, productId: id },
        data => {
          if (data.status == 200) {
            var url = data.bean
            window.location.href = url
          } else {
            this.$message.error(data.msg);
          }
      })
    },
    handleSizeChange(val) {
      console.log("每页" + val + "条");
    },
    handleCurrentChange(val) {
      console.log(`当前页:` + val);
      this.currentPage = val;
      this.getList(val);
    },
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      console.log(val);
      this.goodsFilterFun(
        val,
        this.statusvalue,
        this.valueDate[0],
        this.valueDate[1],
        this.goodsId,
        this.goodsTitle,
        this.goodsSellpoint
      );
    },
    goodsFilter() {
      // console.log(this.valueDate)
      this.goodsFilterFun(
        1,
        this.statusvalue,
        this.valueDate[0],
        this.valueDate[1],
        this.goodsId,
        this.goodsTitle,
        this.goodsSellpoint
      );
    },
    goodsFilterFun(pageBegin, status, timeBegin, timeEnd, id, title, sellPoint) {
      $.get(
        baseUrl + "product/get/filter/all",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          status: status,
          timeBegin: timeBegin,
          timeEnd: timeEnd,
          id: id,
          title: title,
          sellingPoint: sellPoint
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
    prevClick() {
      console.log("left");
    },
    nextClick() {
      console.log("right");
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status == 0) {
        return "off-row";
      }
      return "";
    },
    getThemeList() {
      $.get(
        baseUrl + "product/special/get/all",
        { token: this.token },
        data => {
          console.log(data.bean);
          this.themeOptions = data.bean;
        }
      );
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditGoods${row.id}` })
    },
    handleLabels(index, row) {
      $.get(baseUrl + 'producttags/get/productId', {token: this.token, productId: row.id}, data => {
        if (data.bean.length < 1) {
          this.$router.go(0);
          this.$router.push({ name: "SelectLabels", params: { id: row.id } });
        } else {
          this.$router.go(0);
          this.$router.push({ name: "EditSelectedLabels", params: { id: row.id } });
        }
      })
    },
    gotoDetails(index, row) {
      this.$router.go(0);
      this.$router.push({ name: "ProductDetails", params: { id: row.id } });
    },
    handleStatus(index, row) {
      var id = row.id;
      var status = row.status;
      status = status == 1 ? 0 : 1;
      $.ajax({
        url: baseUrl + "product/modify/status",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          id: id,
          status: status
        }
      })
        .done(data => {
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "状态修改成功"
            });
            // this.getList(this.currentPage)
            this.goodsFilterFun(
              this.currentPage,
              this.statusvalue,
              this.valueDate[0],
              this.valueDate[1],
              this.goodsId,
              this.goodsTitle,
              this.goodsSellpoint
            );
          } else {
            this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    getThemeLabelList(index, row) {
      var productId = row.id;
      var specialId = row.themeSelect
      $.get(
        baseUrl + "product/special/label/get/by/special",
        { token: this.token, specialId: row.themeSelect },
        data => {
          console.log(data.bean);
          this.themeLabelOptions = data.bean;
          this.themeLabelSelectStatus = false;
        }
      );
    },
    addToTheme(index, row) {
      var productId = row.id;
      console.log(row.themeLabelSelect)
      for (var i in this.themeLabelOptions) {
        if (row.themeLabelSelect == this.themeLabelOptions[i].id) {
          var specialId = this.themeLabelOptions[i].specialId
          var sortOrder = this.themeLabelOptions[i].sortOrder
        }
      }
      $.ajax({
        url: baseUrl + "product/special/add/relative",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          productId: productId,
          specialId: specialId,
          specialLabelId: row.themeLabelSelect,
          sortOrder: sortOrder
        }
      })
      .done(data => {
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "添加成功！"
          });
        } else if (data.status == 501) {
          this.$message({
            message: data.msg,
            type: "warning"
          });
        } else {
          this.$message.error(data.msg);
        }
      })
      .fail(function(data) {
        console.log(data);
      });
    },
    /**
     * 查看商品所属专题
     */
    gotoSpecial (index, row) {
      var productId = row.id;
      this.centerDialogVisible = true
      $.get(baseUrl + '/producttags/get/product/id', { token: this.token, productId: row.id }, (res) => {
        if (res.status == 200) {
          this.specialList = res.bean
        }
      })
    },
  },
  created() {
    this.goodsFilterFun(
      1,
      this.statusvalue,
      this.valueDate[0],
      this.valueDate[1],
      this.goodsId,
      this.goodsTitle,
      this.goodsSellpoint
    );
    this.getThemeList();
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'EditGoods' || from.name === 'AddGoods') {
        this.goodsFilterFun(
          1,
          this.statusvalue,
          this.valueDate[0],
          this.valueDate[1],
          this.goodsId,
          this.goodsTitle,
          this.goodsSellpoint
        );
      }
    }
  },
};
</script>