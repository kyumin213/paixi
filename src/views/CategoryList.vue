<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%" :row-class-name="tableRowClassName" id="exTable">
            <el-table-column
            label="分类名称"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.name }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="分类图标"
            width="220">
            <template  slot-scope="scope">
              <img v-bind:src="scope.row.picture" class="thumnial32">
            </template>
            </el-table-column>

            <el-table-column
            label="启用状态"
            width="">
            <template slot-scope="scope">
               <span v-if="scope.row.status == 0">已停用</span>
               <span v-if="scope.row.status == 1">已启用</span>
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
                <el-button
                size="mini"
                @click="handleStatus(scope.$index, scope.row)">
                  <span v-if="scope.row.status == 1">停用</span>
                  <span v-if="scope.row.status == 0">启用</span>
                </el-button>
                <!-- <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row> 
     <!-- <el-button @click="exportExcel" style="margin-top: 2px;" size="medium" type="success">导出</el-button> -->
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
import { exportTb } from '@/config/mUtils'
import { getStore } from '@/config/mUtils'

export default {
  name: 'CategoryList',
  data() {
    return {
      token: getStore('token'),
      tableData: []
    }
  },
  methods: {
    exportExcel () {
      exportTb('#exTable','abc.xlsx')
    },
    tableRowClassName({row, rowIndex}) {
      if (row.status == 0) {
        return 'off-row'
      }
      return ''
    },
    getData () {
      jQuery.get(baseUrl + 'product/category/get/all', {token: this.token},(data) => {
        console.log(data)
        this.tableData = data.bean
        this.tableData.sort(compareDown("created"))
      })
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditCategory${row.id}` })
    },
    handleStatus(index, row) {
      var id= row.id
      var status = row.status
      status = (status == 1) ? 0:1
      $.ajax({
        url: baseUrl + 'product/category/modify/status',
        type: 'POST',
        dataType: 'json',
        data: {
          token: this.token,
          id: id,
          status: status
        }
      })
      .done((data) => {
        console.log(data)
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "状态修改成功"
          })
          this.getData()
          // this.$router.go(0)
        } else {
          this.$message.error(data.msg)
        }
      })
      .fail(function (data) {
        console.log(data)
      })
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
  watch: {
    '$route' (to, from) {
      if (from.name === 'EditCategory') {
        this.getData();
      }
    }
  },
  created () {
    this.getData();
  }
}
</script>
