<template>
  <section class="el-container wrapper is-vertical">
    <el-row>
      <el-col :span="2" :offset="21">
        <el-button
            @click="addSurprise"  type="primary" style="margin-bottom: 10px;">添加红包</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%" :row-class-name="tableRowClassName" >
            
            <el-table-column
            label="红包最低金额">
            <template  slot-scope="scope">
                <span>{{ scope.row.surprisePriceMin }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="红包最高金额">
                <template  slot-scope="scope">
                    <span>{{ scope.row.surprisePriceMax }}</span>
                </template>
            </el-table-column>

            <el-table-column label="红包数量">
                <template  slot-scope="scope">
                    <span>{{ scope.row.surpriseStock }}</span>
                </template>
            </el-table-column>

            <el-table-column label="红包状态">
                <template  slot-scope="scope">
                    <span v-if="scope.row.topicSurpriseStatus == 0">未启用</span>
                    <span v-if="scope.row.topicSurpriseStatus == 1">已启用</span>
                    <span v-if="scope.row.topicSurpriseStatus == 2">已废弃</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"  type="primary">编辑</el-button>
                    <el-button
                    size="mini"
                    @click="handleDelete(scope.$index, scope.row)"  type="danger">删除</el-button>
                    
                    <!-- <el-button
                    size="mini"
                    @click="handleEnable(scope.$index, scope.row)" >惊喜红包列表</el-button>
                    -->
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
  name: 'SurpriseList',
  data() {
    return {
      token: getStore('token'),
      tableData: [],
      taskType:["成长任务","每日任务","每周任务","每月任务"],
      optType: ["浇水","能量收集","推荐1人","推荐5人","推荐10人","拼图通4关", "拼图通8关", "拼图通15关"],
      currentPage: 1,
      total: 0,
      id: this.$route.params.id
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.topicSurpriseStatus != 1) {
        return 'off-row'
      }
      return ''
    },
    getData (pageBegin) {
      jQuery.get(baseUrl + 'promise/tree/surprise/get/list', {token: this.token, pageBegin: pageBegin, pageSize: 10, termId: this.id},(data) => {
        this.tableData = data.bean
        this.total = data.total
      })
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditSurprise${row.id}` })
    },
    handleDelete (index, row) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        $.ajax({
          url: baseUrl + "promise/tree/surprise/delete",
          type: "POST",
          dataType: "json",
          data: {
            id: row.id,
            token: this.token
          }
        })
        .done(data => {
          console.log(data);
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功！"
            });
            this.getData(this.currentPage);
          } else {
            this.$message.error(data.msg);
          }
        })
        .fail(data => {
          console.log(data);
        });
      })
    },
    addSurpriseTerm () {
      this.$router.push({name: 'AddSurpriseTerm'})  
    },
    addSurprise () {
        // this.$router.go(0)
        this.$router.push({name: 'AddSurprise', params: {id: this.id}})  
    },
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      this.getData(this.currentPage);
    },
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'SurpriseManager') {
        this.id = to.params.id
        this.getData(1);
      }
    }
  },
  created () {
    this.getData(1);
  }
}
</script>