<template>
  <section class="el-container wrapper is-vertical">
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%" :row-class-name="tableRowClassName">

             <el-table-column
            label="图片编号" width="260">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>


            <el-table-column
            label="图片名称"
            width="160">
            <template  slot-scope="scope">
                <span>{{ scope.row.name }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="图片描述"
            width="160">
            <template  slot-scope="scope">
                <span>{{ scope.row.imageDetails }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="拼图图片"
            width="320">
            <template  slot-scope="scope">
              <img v-bind:src="scope.row.imageUrl" class="thumnial32">
            </template>
            </el-table-column>

            <el-table-column
            label="创建日期"
            width="">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span>{{ scope.row.created }}</span>
            </template>
            </el-table-column>

            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="selectImg(scope.$index, scope.row)" type="primary">选为拼图活动图片</el-button>
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                size="mini"
                @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
</style>

<script>
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { getStore } from "@/config/mUtils";
export default {
  data() {
    return {
      token: getStore("token"),
      tableData: [],
      total: 0,
      currentPage: 1
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log("每页" + val + "条");
    },

    tableRowClassName({ row, rowIndex }) {
      if (row.status == 0) {
        return "off-row";
      }
      return "";
    },

    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      console.log(val);
      this.queryByEvery(val);
    },

    queryByEvery(pageBegin) {
      $.get(
        baseUrl + "major/jigsaw/get/all",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10
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

    handleDel(index, row) {
      var id = row.id;
      $.ajax({
        url: baseUrl + "major/jigsaw/delete/jigsaw",
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
            this.queryByEvery(this.currentPage);
          } else {
            this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditJigsawPuzzle${row.id}` })
    },
    selectImg(index, row) {
      // var picture = row.imageUrl
      console.log(row.imageUrl)
      this.$router.go(0);
      this.$router.push({ name: "ShoppingCar", params: { picture:  row.imageUrl } });
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'EditJigsawPuzzle' || from.name === 'AddJigsawPuzzle') {
        this.queryByEvery(1);
      }
    }
  },
  created() {
    this.queryByEvery(1);
  }
};
</script>
