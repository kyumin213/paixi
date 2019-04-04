<template>
  <section class="el-container wrapper is-vertical">
    <el-row>
      <el-col :span="4">
        <el-button
            @click="addChildLabel"  type="primary" style="margin-bottom: 10px;">新增子标签</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%" :row-class-name="tableRowClassName">

            <el-table-column
            label="编号"
            type="index"
            :index="indexMethod" width="100">
            </el-table-column>
            
            <!-- <el-table-column
            label="主标签"
            width="">
            <template slot-scope="scope">
                <span>{{ labelName }}</span>
            </template>
            </el-table-column> -->

            <el-table-column
            label="子标签名称"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.name }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="排序"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.reorder }}</span>
            </template>
            </el-table-column>

            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">已上架</span>
                    <span v-if="scope.row.status == 2">已下架</span>
                    <span v-if="scope.row.status == 3">已废除</span>
                </template>
            </el-table-column>

            <el-table-column
            label="创建时间"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.created }}</span>
            </template>
            </el-table-column>

            <el-table-column label="操作" width="400px">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    @click="handleStatus(scope.$index, scope.row, 2)" v-if="scope.row.status == 1"  >下架</el-button>
                    <el-button
                    size="mini"
                    @click="handleStatus(scope.$index, scope.row, 1)" v-if="scope.row.status == 2" >上架</el-button>                    
                    <el-button
                    size="mini"
                    @click="handleStatus(scope.$index, scope.row, 3)" type="danger">删除</el-button>
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
.thumnial32{
  width: 32px;
}
</style>

<script>
import { baseUrl } from '@/config/env'
import { compareDown } from '@/config/mUtils'
import { getStore } from '@/config/mUtils'

export default {
  name: 'ChildLabelManager',
  data() {
    return {
      token: getStore('token'),
      tableData: [],
      taskType:["成长任务","每日任务","每周任务","每月任务"],
      optType: ["浇水","能量收集","推荐1人","推荐5人","推荐10人","拼图通4关", "拼图通8关", "拼图通15关", "拼图通1关"],
      currentPage: 1,
      total: 0,
      id: this.$route.params.id,
      labelName: this.$route.params.labelName
    }
  },
  methods: {
    indexMethod (index) {
        return index + 1 + (this.currentPage-1)*10;
    },
    tableRowClassName({row, rowIndex}) {
      if (row.status != 1) {
        return 'off-row'
      }
      return ''
    },
    getData (pageBegin) {
      jQuery.get(baseUrl + '/label/get/all', {token: this.token, pageBegin: pageBegin, pageSize: 10, labelId: this.id},(data) => {
        this.tableData = data.bean
        this.total = data.total
      })
    },
    handleEdit(index, row) {
      this.$router.go(0)
      this.$router.push({name: 'EditSmallLabel', params: {id: row.id}})      
    },
    addChildLabel () {
      this.$router.push({name: 'AddSmallLabel'})  
    },
    handleStatus(index, row, status) {
      var id= row.id
      $.ajax({
        url: baseUrl + 'label/updateStatus',
        type: 'POST',
        dataType: 'json',
        data: {
          token: this.token,
          status: status,
          id: id
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
    handleChildLabel(index, row) {
        var id= row.id
        this.$router.push({name: 'ChildLabelManager', params: {id: row.id}})      
    },
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      this.getData(this.currentPage);
    },
  },
  created () {
    this.getData(1);
  }
}
</script>