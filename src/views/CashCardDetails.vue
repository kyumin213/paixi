<template>
  <section class="el-container wrapper is-vertical">
    <el-row style="height:100%;margin-bottom:20px;">
      <!-- 按编号搜索 -->
      <el-col :span="4">
        <el-input v-model="phones" placeholder="手机号搜索" @blur="cashFilter" style="width:80%;"></el-input>
      </el-col>
      <!-- 按名称搜索 -->
      <el-col :span="4">
        <!-- multiple -->
        <el-input v-model="keyCode" placeholder="提现码搜索" @blur="cashFilter" style="width:80%;"></el-input>        
      </el-col>
      <!-- 按日期搜索 -->
      <el-col :span="4">
        <el-date-picker
          v-model="valueDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="cashFilter">
        </el-date-picker>
      </el-col>
    </el-row>
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
            label="领取用户"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.nicknames }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="手机号"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.phones }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="提现码"
            width="">
            <template slot-scope="scope">
              <span> {{ scope.row.keyCode }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="领取时间"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.created }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="到期时间"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.endTime }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="提现时间"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.txTime }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="状态"
            width="">
            <template slot-scope="scope">
               <span v-if="scope.row.toolStatus == 1">可用</span>
               <span v-if="scope.row.toolStatus == 2">未核销</span>
               <span v-if="scope.row.toolStatus == 3">已过期</span>
               <span v-if="scope.row.toolStatus == 4">已核销</span>
            </template>
            </el-table-column>

            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleCashCard(scope.$index, scope.row)" type="primary" v-if="scope.row.toolStatus == 2">核销</el-button>
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
  name: 'CashCardDetails',
  data() {
    return {
      token: getStore('token'),
      tableData: [],
      taskType:["成长任务","每日任务","每周任务","每月任务"],
      optType: ["浇水","能量收集","推荐1人","推荐5人","推荐10人","拼图通4关", "拼图通8关", "拼图通15关", "拼图通1关"],
      currentPage: 1,
      total: 0,
      id: this.$route.params.id,
      phones: '',
      keyCode: '',
      valueDate: []
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
    handleCurrentChangeQuery (val) {
      this.currentPage = val;
      this.getData(
        val,
        this.valueDate[0],
        this.valueDate[1]
      );
    },
    cashFilter () {
        if (this.valueDate == null) {
            this.getData(
                this.currentPage,
            );
        } else {
           this.getData(
                this.currentPage,
                this.valueDate[0],
                this.valueDate[1]
            );
        }
    },
    getData (pageBegin,startTime,endTime) {
      jQuery.get(baseUrl + 'promise/tree/withdrawal/get/userToolsTxlist', 
      {
          token: this.token,
          toolsId: this.id,
          phones: this.phones,
          keyCode: this.keyCode,
          startTime: startTime,
          endTime: endTime,
          pageSize: 10,
          pageBegin: pageBegin
      },
      (data) => {
        this.tableData = data.bean
        this.total = data.total
      })
    },
    handleCashCard(index, row) {
      $.ajax({
          url: baseUrl + 'promise/tree/withdrawal/updateTask',
          type: 'POST',
          dataType: 'json',
          data: {
              token: this.token,
              id: row.id
          },
      })   
      .done(data => {
            console.log(data);
            if (data.status == 200) {
                this.$message({
                    type: "success",
                    message: "核销成功"
                });
                this.getData(
                    this.currentPage,
                    this.valueDate[0],
                    this.valueDate[1]
                );
            } else {
                this.$message.error(data.msg);
            }
       })
    },    
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      this.getData(this.currentPage);
    },
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'CashCard') {
        this.id = to.params.id
        this.getData(
          this.currentPage,
          this.valueDate[0],
          this.valueDate[1]
        );
      }
    }
  },
  created () {
    this.getData(
        this.currentPage,
        this.valueDate[0],
        this.valueDate[1]
      );
  }
}
</script>