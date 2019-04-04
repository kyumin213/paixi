<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%" :row-class-name="tableRowClassName">

            <el-table-column
            label="模板编号"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="模板名称"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.name }}</span>
            </template>
            </el-table-column>


            <el-table-column
            label="创建日期"
            width="">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span>{{ scope.row.updated }}</span>
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
  </section>
</template>
<style>
.thumnial32{
  width: 32px;
}
</style>

<script>
import { baseUrl } from '@/config/env'
import { compareDown } from '@/config/mUtils'
import { getStore } from '@/config/mUtils'
export default {
  name: 'TemplateList',
  data() {
    return {
      token: getStore('token'),
      tableData: []
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.status == 0) {
        return 'off-row'
      }
      return ''
    },
    getData () {
      jQuery.get(baseUrl + 'product/template/get/all', {token: this.token},(data) => {
        console.log(data)
        this.tableData = data.bean
        this.tableData.sort(compareDown("created"))
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.$router.go(0)
      this.$router.push({name: 'EditTemplate', params: {id: row.id}})
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
        type: 'success',
        message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
        type: 'info',
        message: '已取消删除!'
        })   
      })
    }
  },
  created () {
    this.getData();
  }
}
</script>
