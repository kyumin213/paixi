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
            label="文章编号"
            width="250">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="文章封面"
            width="250">
            <template  slot-scope="scope">
              <img v-bind:src="scope.row.articleAbstract" class="thumnial">
            </template>
            </el-table-column>

            <el-table-column
            label="文章标题"
            >
              <template  slot-scope="scope">
                <span>{{ scope.row.title }}</span>
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
                <!-- <el-button
                size="mini"
                @click="handleCheck(scope.$index, scope.row)">
                 查看
                </el-button> -->
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
  name: 'ArticleList',
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
      jQuery.get(baseUrl + 'major/article/get/show', {token: this.token},(data) => {
        this.tableData = data.bean
        this.tableData.sort(compareDown("created"))
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.$router.go(0)
      this.$router.push({ name: 'EditArticle', params: { id: row.id }})
    },
    // handleCheck(index, row) {
    //   this.$router.go(0)
    //   this.$router.push({ name: 'ArticleDetails', params: { id: row.id }})
    // },
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
          url: baseUrl + 'major/article/delete',
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
  created () {
    this.getData()
  }
}
</script>
