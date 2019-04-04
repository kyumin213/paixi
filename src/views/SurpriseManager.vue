<template>
  <section class="el-container wrapper is-vertical">
    <el-row>
      <el-col :span="4">
        <el-button
            @click="addSurpriseTerm"  type="primary" style="margin-bottom: 10px;">添加红包活动时间段</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%" >
            
            <el-table-column
            label="红包活动开始时间"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.topicBeginTime }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="红包活动结束时间"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.topicEndTime }}</span>
            </template>
            </el-table-column>


            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="addSurprise(scope.$index, scope.row)"  type="primary">添加红包</el-button>

                    <el-button
                    size="mini"
                    @click="goSurpriseList(scope.$index, scope.row)" >红包列表</el-button>
                   
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
  name: 'SurpriseManager',
  data() {
    return {
      token: getStore('token'),
      tableData: [],
      taskType:["成长任务","每日任务","每周任务","每月任务"],
      optType: ["浇水","能量收集","推荐1人","推荐5人","推荐10人","拼图通4关", "拼图通8关", "拼图通15关"],
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
      jQuery.get(baseUrl + 'promise/tree/surprise/get/term/list', {token: this.token, pageBegin: pageBegin, pageSize: 10},(data) => {
        this.tableData = data.bean
        this.total = data.total
      })
    },
    addSurpriseTerm () {
      this.$router.push({name: 'AddSurpriseTerm'})  
    },
    addSurprise (index, row) {
        this.$router.push({ path: `/AddSurprise${row.id}` })
    },
    goSurpriseList (index, row) {
      this.$router.push({ path: `/SurpriseList${row.id}` })     
    },
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      this.getData(this.currentPage);
    },
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'EditSurprise' || from.name === 'AddSurpriseTerm' || from.name == 'AddSurprise') {
        this.getData(1);
      }
    }
  },
  created () {
    this.getData(1);
  }
}
</script>