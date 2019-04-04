<template>
  <section class="el-container wrapper is-vertical">
    <el-row class="feedback">
      <el-col :span="24">
        <el-table
            border
            :data="tableData"
            style="width: 100%;text-align:center;"
            >

            <el-table-column
            label="序号" width="200">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="用户ID" width="200">
              <template  slot-scope="scope">
                <span>{{ scope.row.userId }}</span>
              </template>
            </el-table-column>

             <el-table-column
            label="用户昵称" width="160">
            <template slot-scope="scope">
                <span>{{ scope.row.nickname }}</span>
            </template>
            </el-table-column>

            <el-table-column
             label="反馈内容" width="400">
              <template  slot-scope="scope">
                <span>{{ scope.row.content }}</span>
              </template>
            </el-table-column>

            <el-table-column
             label="联系方式" width="180">
              <template  slot-scope="scope">
                  <span>{{ scope.row.contactWay }}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" width="190">
              <template  slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="danger"
                    @click="delFeedback(scope.$index, scope.row)">删除</el-button>
              </template>

            </el-table-column>

        </el-table>
      </el-col>
    </el-row>
  </section>
</template>

<style>
.feedback {
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
      tableData: [],
      loading: false,
      token: getStore("token")
    };
  },
  mounted() {
  
  },
  methods: {
    getFeedbacks() {
      console.log(this.token);
      jQuery.get(
        baseUrl + "user/feedback/select/all",
        { token: this.token},
        data => {
          this.tableData = data.bean;
        //   this.tableData.sort(compareDown("created"));
        }
      );
    },

    delFeedback(index,row) {
      console.log(this.token);
      jQuery.get(
        baseUrl + "user/feedback/delete",
        { token: this.token,id:row.id},
        data => {
          this.tableData = data.bean;
        //   this.tableData.sort(compareDown("created"));
        this.getFeedbacks();
        }
      );
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
    this.getFeedbacks();
  }
};
</script>
