<template>
  <section class="el-container wrapper is-vertical">
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%" :row-class-name="tableRowClassName">
             <el-table-column
            label="分类编号" width="260">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="分类名称"
            width="160">
            <template  slot-scope="scope">
                <span>{{ scope.row.classifyName }}</span>
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
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row> 
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
      total: 0
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.status == 0) {
        return "off-row";
      }
      return "";
    },
    getData() {
      jQuery.get(
        baseUrl + "major/jigsaw/select/jigsaw/all",
        { token: this.token },
        data => {
          console.log(data);
          this.tableData = data.bean;
        }
      );
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditClassifyPuzzle${row.id}` })
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'EditClassifyPuzzle' || from.name == 'AddPuzzleClassify') {
        this.getData();
      }
    }
  },
  created() {
    this.getData();
  }
};
</script>

