<template>
  <section class="el-container wrapper is-vertical">
    <el-row>
      <el-col :span="4">
        <el-button
            @click="addTask"  type="primary" style="margin-bottom: 10px;">新增任务</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column
            label="任务名称"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.taskTitle }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="任务类型"
            width="">
            <template slot-scope="scope">
               <span>{{ taskType[scope.row.topicTaskType] }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="操作类型"
            width="">
            <template slot-scope="scope">
              <span> {{ optType[scope.row.topicOptType] }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="任务目标数"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.taskAim }}</span>
            </template>
            </el-table-column>
            
            <el-table-column
            label="任务奖励内容"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.taskRewardContent }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="任务收获成长值"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.growthValue }}</span>
            </template>
            </el-table-column>

            <el-table-column label="任务状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.topicStatus == 0">未启用</span>
                    <span v-if="scope.row.topicStatus == 1">已启用</span>
                    <span v-if="scope.row.topicStatus == 2">已废弃</span>
                </template>
            </el-table-column>

            <el-table-column
            label="任务排序"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.sortOrder }}</span>
            </template>
            </el-table-column>

            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEnable(scope.$index, scope.row)" v-if="scope.row.topicStatus == 0"  type="primary">启用</el-button>
                    <el-button
                    size="mini"
                    @click="handleDisable(scope.$index, scope.row)" v-if="scope.row.topicStatus == 1" type="danger">废弃</el-button>
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
  name: 'TaskList',
  data() {
    return {
      token: getStore('token'),
      tableData: [],
      taskType:["成长任务","每日任务","每周任务","每月任务"],
      optType: ["浇水","能量收集","推荐1人","推荐5人","推荐10人","拼图通4关", "拼图通8关", "拼图通15关", "拼图通1关"],
      currentPage: 1,
      total: 0
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.topicStatus != 1) {
        return 'off-row'
      }
      return ''
    },
    getData (pageBegin) {
      jQuery.get(baseUrl + 'promise/tree/task/get/list', {token: this.token, pageBegin: pageBegin, pageSize: 10},(data) => {
        this.tableData = data.bean
        this.total = data.total
      })
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditTask${row.id}` })     
    },
    addTask () {
      this.$router.push({name: 'AddTask'})  
    },
    handleEnable(index, row) {
        var id= row.id
        $.ajax({
            url: baseUrl + 'promise/tree/task/modify/enable',
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
                type: "success",
                message: "状态修改成功"
            })
            this.getData(this.currentPage)
        } else {
            this.$message.error(data.msg)
        }
        })
        .fail(function (data) {
            console.log(data)
        })
    },
    handleDisable(index, row) {
        var id= row.id
        $.ajax({
            url: baseUrl + 'promise/tree/task/modify/disable',
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
                type: "success",
                message: "状态修改成功"
            })
            this.getData(this.currentPage)
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
            url: baseUrl + 'promise/tree/task/delete',
            type: 'POST',
            dataType: 'json',
            data: {token: this.token, id: row.id}
        })
        .done((data)=>{
          if (data.status == 200) {
            this.$message({
                type: 'success',
                message: '删除成功!'
            })
            this.getData(this.currentPage)
          }  else {
             this.$message.error(data.msg)
          }        
        })        
      }).catch(() => {
        this.$message({
            type: 'info',
            message: '已取消删除!'
        })   
      })
    },
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      this.getData(this.currentPage);
    },
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'EditTask' || from.name == 'AddTask') {
        this.getData(1);
      }
    }
  },
  created () {
    this.getData(1);
  }
}
</script>