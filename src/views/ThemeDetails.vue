<template>
  <section class="el-container wrapper is-vertical theme">
    <!-- <Header></Header> -->
    <el-row>
      <el-col :span="24">
          <el-table
            :data="tableData"
            style="width: 100%">

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
                <span>{{ formatDate(scope.row.updated) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="标签">
              <template  slot-scope="scope">
                <span>{{ scope.row.specialLabelId }}</span>
                <!-- <span>{{ scope.row.arrLabel}}</span> -->
              </template>
              
            </el-table-column>

            <el-table-column label="操作" width="420px;">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">移除</el-button>

                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                <el-select v-model="scope.row.themeSelect" @change="addToLabel(scope.row)" placeholder="添加到该标签" class="select-box">
                  <el-option
                    filterable 
                    v-for="item in specialOptions"
                    :key="item.sortOrder"
                    :label="item.title"
                    :value="item">
                  </el-option>
                </el-select>

            </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row> 
  </section>
</template>

<style>
.edit {
  color: #606266;
}
.thumnial {
  width: 100px;
}

</style>

<script>
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { getStore } from "@/config/mUtils";
export default {
  name: "ThemeDetails",
  data() {
    return {
      token: getStore("token"),
      tableData: [],
      id: this.$route.params.id,
      themeSelect: '',
      recommendSelect:'',
      specialOptions: [],
      recommendIndexs: [{"index":1,"label":"推荐1"},{"index":2,"label":"推荐2"},{"index":3,"label":"推荐3"}],
      objLabel: {}
    };
  },
  methods: {
    getThemeGoods() {
      console.log(this.token);
      console.log(this.id);
      jQuery.get(
        baseUrl + "product/special/get/relative/all",
        { token: this.token, id: this.id },
        data => {
          this.tableData = data.bean;
          // 如果存在标签对象，则把标签的name赋值给id
          if (this.objLabel) {
            for (var i in this.tableData) {
              this.tableData[i].specialLabelId = this.objLabel[this.tableData[i].specialLabelId]
            }
          }
        }
      );
    },
    getSpecialLabel() {
      jQuery.get(
        baseUrl + "product/special/label/get/by/special",
        { token: this.token, specialId: this.id },
        data => {

          this.specialOptions = data.bean;
          this.labelId = data.bean.id
  
          var obj = {}
          this.specialOptions.forEach(function (v,i) {
              obj[v.id] = v.title;
          });
          this.objLabel = obj
        }
      );
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("确认移除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.ajax({
            url: baseUrl + "product/special/delete/relative/id",
            type: "POST",
            dataType: "json",
            data: {
              token: this.token,
              relativeId: row.relativeId
            }
          })
            .done(data => {
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "移除成功!"
                });
                this.getThemeGoods();
              } else {
                this.$message.error(data.msg);
              }
            })
            .fail(function(data) {
              console.log(data);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消移除!"
          });
        });
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditGoods${row.id}` })
    },
    addToLabel (row) {
      $.ajax({
        url: baseUrl + "product/special/modify/order/rId",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          relativeId: row.relativeId,
          sortOrder: row.themeSelect.sortOrder,
          specialLabelId: row.themeSelect.id
        }
      })
        .done(data => {
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "变换标签成功"
            });
            this.getThemeGoods();
          } else {
            this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    addToSpecialRecommend (row) {
      $.ajax({
        url: baseUrl + "product/special/recommend/modify",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          relativeId: row.relativeId,
          recommendIndex: row.recommendSelect
        }
      })
        .done(data => {
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "设置为封面推荐商品"
            });
            this.getThemeGoods();
          } else {
            this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
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
      if (from.path === '/themeList') {
        this.id = to.params.id
        this.getThemeGoods();
        this.getSpecialLabel();
      }
    }
  },
  created() {
    this.getThemeGoods();
    this.getSpecialLabel();
  }
};
</script>
