<template>
  <section class="el-container wrapper is-vertical">
    <el-row>
      <el-col :span="4">
        <el-button
            @click="addMainLabel"  type="primary" style="margin-bottom: 10px;">新增主标签</el-button>
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

            <el-table-column
            label="名称"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.labelName }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="图标"
            width="">
            <template slot-scope="scope">
               <!-- <span></span> -->
               <img v-bind:src="scope.row.labelIcon">
            </template>
            </el-table-column>
            
            <el-table-column
            label="子标签数量"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.number }}</span>
            </template>
            </el-table-column>

            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">已上架</span>
                    <span v-if="scope.row.status == 2">已下架</span>
                    <span v-if="scope.row.status == 3">已废弃</span>
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
                    @click="handleChildLabel(scope.$index, scope.row)" type="primary">管理子标签</el-button>
                    <el-button
                    size="mini"
                    @click="handleStatus(scope.$index, scope.row, 2)" v-if="scope.row.status == 1"  >下架</el-button>
                    <el-button
                    size="mini"
                    @click="handleStatus(scope.$index, scope.row, 1)" v-if="scope.row.status == 2" >上架</el-button>                    
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    @click="handleStatus(scope.$index, scope.row, 3)" v-if="scope.row.status == 1" type="danger">废弃</el-button>
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
  name: 'LabelManager',
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
      if (row.status != 1) {
        return 'off-row'
      }
      return ''
    },
    getData (pageBegin) {
      jQuery.get(baseUrl + 'label/category/get/all', {token: this.token, pageBegin: pageBegin, pageSize: 10},(data) => {
        this.tableData = data.bean
        this.total = data.total
      })
    },
    handleEdit(index, row) {
      this.$router.go(0)
      this.$router.push({name: 'EditMainLabel', params: {id: row.id}})      
    },
    addMainLabel () {
      this.$router.push({name: 'AddMainLabel'})  
    },
    handleStatus(index, row, status) {
      var id= row.id
      $.ajax({
        url: baseUrl + '/label/category/updateStatus',
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
        // var id= row.id
        // var labelName = row.labelName
        this.$router.go(0)   
        this.$router.push({name: 'ChildLabelManager', params: {id: row.id, labelName: row.labelName}})    
        // this.$router.go(0)          
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