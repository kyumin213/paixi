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
            label="专题编号"
            width="250">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="专题封面"
            width="250">
            <template  slot-scope="scope">
              <img v-bind:src="scope.row.pictureCover" class="thumnial">
            </template>
            </el-table-column>

            <el-table-column
            label="专题名称"
            >
              <template  slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>


            <el-table-column
            label="状态"
            >
              <template  slot-scope="scope">
                <span v-if="scope.row.status == 0">已下架</span>
                <span v-if="scope.row.status == 1">已上架</span>
              </template>
            </el-table-column>

            <el-table-column
            label="创建时间" width="220px">
              <template  slot-scope="scope">
                <span>{{ scope.row.created }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="500px;">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleQuery(scope.$index, scope.row)">
                 查看
                </el-button>
                <el-button
                size="mini"
                @click="handleQueryLabel(scope.$index, scope.row)">
                 管理专题标签
                </el-button>
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">
                 编辑
                </el-button>
                <el-button
                size="mini"
                @click="handleStatus(scope.$index, scope.row)">
                  <span v-if="scope.row.status == 1">下架</span>
                  <span v-if="scope.row.status == 0">上架</span>
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
  </section>
</template>

<style>
.edit{
  color:#606266;
}
.thumnial{
  width: 100px;
}
</style>

<script>
import { baseUrl } from '@/config/env'
import { compareDown } from '@/config/mUtils'
import { getStore } from '@/config/mUtils'
export default {
  name: 'ThemeList',
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
      jQuery.get(baseUrl + 'product/special/get/all', {token: this.token},(data) => {
        // console.log(data)
        if(data.bean){
          this.tableData = data.bean
          this.tableData.sort(compareDown("created"))
        }
      })
    },
    handleQuery(index, row) {
      this.$router.push({ path: `/ThemeDetails${row.id}` })
    },
    handleQueryLabel(index, row) {
      this.$router.push({ path: `/LabelList${row.id}` })
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditTheme${row.id}` })
    },
    handleStatus(index, row) {
      var id= row.id
      var status = row.status
      status = (status == 1) ? 0:1
      $.ajax({
        url: baseUrl + 'product/special/modify/status',
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
        $.ajax({
          url: baseUrl + 'product/special/delete',
          type: 'POST',
          dataType: 'json',
          data: {
            id: row.id,
            token: this.token
          }
        })
        .done((data) => {
          console.log(data)
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功！"
            })
            this.getData()
          } else {
            this.$message.error(data.msg)
          }
        })
        .fail((data) => {
          console.log(data)
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
      if (from.name === 'EditTheme' || from.name === 'CreateTheme') {
        this.getData()
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>
