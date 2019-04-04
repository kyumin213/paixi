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
            label="标签名称"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.title }}</span>
            </template>
            </el-table-column>

            <!-- <el-table-column
            label="关联的专题"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.name }}</span>
            </template>
            </el-table-column> -->


            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                <el-button
                size="mini"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                
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
  name: 'LabelList',
  data() {
    return {
      token: getStore('token'),
      tableData: [],
      specialId: this.$route.params.id,
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
      // jQuery.get(baseUrl + 'product/special/label/get/all', {token: this.token},(data) => {
      //   console.log(data)
      //   this.tableData = data.bean
      //   this.tableData.sort(compareDown("created"))
      // })
      jQuery.get(baseUrl + 'product/special/label/get/by/special', {token: this.token,specialId: this.specialId},(data) => {
        if(data.bean){
          this.tableData = data.bean
          this.tableData.sort(compareDown("created"))
        }
      })
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditLabel${row.id}` })
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
      var id = row.id
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除接口product/special/label/remove
        $.ajax({
          url: baseUrl + 'product/special/label/remove',
          type: 'POST',
          dataType: 'json',
          data: {
            token: this.token,
            id: id
          }
        })
        .done((data) => {
          console.log(data)
          if (data.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
            // this.$router.go(0)
          } else {
            this.$message.error(data.msg)
          }
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
      if (from.path === '/themeList' || from.name === 'EditLabel') {
        this.specialId = to.params.id
        this.getData()
      }
    }
  },
  created () {
    this.getData();
  }
}
</script>