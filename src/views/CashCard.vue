<template>
  <section class="el-container wrapper is-vertical">
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%">

            <el-table-column
            label="编号"
            type="index"
            :index="indexMethod" width="100">
            </el-table-column>

            <el-table-column
            label="名称"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.toolTitle }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="单位（元）"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.withdrawAmount }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="发放数量"
            width="">
            <template slot-scope="scope">
              <span> {{ scope.row.grantNumber }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="已核销数量"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.verification }}</span>
            </template>
            </el-table-column>

            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleDetails(scope.$index, scope.row)" type="primary">详情</el-button>
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
  name: 'CashCard',
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
    indexMethod (index) {
        return index + 1;
    },
    tableRowClassName({row, rowIndex}) {
      if (row.topicStatus != 1) {
        return 'off-row'
      }
      return ''
    },
    getData (pageBegin) {
      jQuery.get(baseUrl + 'promise/tree/withdrawal/get/list', {token: this.token, pageBegin: pageBegin, pageSize: 10},(data) => {
        this.tableData = data.bean
        this.total = data.total
      })
    },
    handleDetails(index, row) { 
      this.$router.push({ path: `/CashCardDetails${row.id}` })
    },
    addTask () {
      this.$router.push({name: 'AddTask'})  
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