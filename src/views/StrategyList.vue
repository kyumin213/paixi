<template>
  <section class="el-container wrapper is-vertical">
     <el-row>
        <el-col :span="4">
          <el-button
              @click="addStrategy"  type="primary" style="margin-bottom: 10px;">新增奖励说明</el-button>
        </el-col>
      </el-row>
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%">

            <el-table-column
            label="编号"
            width="250">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="名称">
              <template  slot-scope="scope">
                <span>{{ scope.row.strategyTitle }}</span>
              </template>
            </el-table-column>

            <el-table-column
            label="排序" width="500px">
              <template  slot-scope="scope" >
                  <div class="item-text">
                    <dl v-html="scope.row.sortOrder">
                        {{scope.row.sortOrder}}
                    </dl>
                  </div>
              </template>
            </el-table-column>

            <el-table-column
            label="创建时间" width="220px">
              <template  slot-scope="scope">
                <span>{{ scope.row.created }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="300px;">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">
                 编辑
                </el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
.edit {
  color: #606266;
}
.thumnial {
  width: 100px;
}
.item-text {
  width: 200px;
  height: 20px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
</style>

<script>
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { getStore } from "@/config/mUtils";
export default {
  name: "StrategyList",
  data() {
    return {
      token: getStore("token"),
      tableData: [],
      currentPage: 1,
      total: 0
    };
  },
  methods: {
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      this.getData(val);
    },

    getData(pageBegin) {
      jQuery.get(
        baseUrl + "promise/strategy/get/filter/list",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10
        },
        data => {
          this.tableData = data.bean;
          this.total = data.total;
        }
      );
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditStrategy${row.id}` })
    },
    addStrategy () {
      this.$router.push({ name: "AddStrategy" })
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.ajax({
            url: baseUrl + "promise/strategy/delete",
            type: "POST",
            dataType: "json",
            data: {
              id: row.id,
              token: this.token
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功！"
                });
                this.getData(this.currentPage);
              } else {
                this.$message.error(data.msg);
              }
            })
            .fail(data => {
              console.log(data);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除!"
          });
        });
    }
  },
  created() {
    this.getData(1);
  }
};
</script>
