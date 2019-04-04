<template>
  <section class="el-container wrapper is-vertical">
    <el-row>
      <el-col :span="4">
        <el-button
            @click="addReward"  type="primary" style="margin-bottom: 10px;">新增排行榜奖励</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%">
            <el-table-column
            label="名次"
            width="">
            <template  slot-scope="scope">
                <span>{{scope.row.rankName}}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="奖品名称"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.rewardName }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="奖励能量值"
            width="">
            <template slot-scope="scope">
               <!-- <span>{{ scope.row.growthValue * 0.1 }}</span> -->
              <span> {{ scope.row.rewardValue }}</span>
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
.thumnial32{
  width: 32px;
}
</style>

<script>
import { baseUrl } from '@/config/env'
import { compareDown } from '@/config/mUtils'
import { getStore } from '@/config/mUtils'

export default {
  name: 'RankRewardList',
  data() {
    return {
      token: getStore('token'),
      tableData: [],
      levelName:["","关卡一","关卡二","关卡三","关卡四","关卡五","关卡六","关卡七"],
      pictureName: ["","","","3X3","4X4","5X5","6X6","7X7","8X8","9X9"]
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
      jQuery.get(baseUrl + 'promise/rank/reward/get/list', {token: this.token, pageBegin: 1, pageSize: 100},(data) => {
        this.tableData = data.bean
      })
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditRewardList${row.id}` })     
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
            url: baseUrl + 'promise/rank/reward/del',
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
            this.getData()
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
    addReward () {
      this.$router.push({path: 'AddRankRewards'})
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'EditRewardList' || from.name === 'AddRankRewards') {
        this.getData();
      }
    }
  },
  created () {
    this.getData();
  }
}
</script>
