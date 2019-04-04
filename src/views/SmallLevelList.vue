<template>
  <section class="el-container wrapper is-vertical">
     <el-row>
      <el-col :span="4">
        <el-button
            @click="addSmallLevel"  type="primary" style="margin-bottom: 10px;">新增拼图</el-button>
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
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="图片"
            width="">
            <template  slot-scope="scope">
                <img v-bind:src="scope.row.jigsawPicture" class="thumb">
            </template>
            </el-table-column>

            <el-table-column
            label="名称"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.jigsawTitle }}</span>
            </template>
            </el-table-column>
            
            <el-table-column
            label="所属关卡"
            width="">
            <template  slot-scope="scope">
                <span>{{ levelName[scope.row.parentOrders] }} / 第{{ childName[scope.row.childOrders] }}关</span>
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
  name: 'SmallLevelList',
  data() {
    return {
      token: getStore('token'),
      tableData: [],
      levelName:["","关卡一","关卡二","关卡三","关卡四","关卡五","关卡六","关卡七"],
      childName: ["","1","2","3","4","5","6","7"],
      currentPage: 1,
      total: 0
    }
  },
  methods: {
    handleCurrentChangeQuery (val) {
      this.currentPage = val
      this.getData(this.currentPage)
    },
    getData (pageBegin) {
      jQuery.get(baseUrl + 'promise/jigsaw/get/list', {token: this.token, pageBegin: pageBegin, pageSize: 10},(data) => {
        this.tableData = data.bean
        this.total = data.total
      })
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditSmallLevel${row.id}` })
    },
    addSmallLevel () {
      this.$router.push({name: 'AddSmallLevel'})
    },

    handleDelete(index, row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
            url: baseUrl + 'promise/jigsaw/delete',
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
            this.getData(this.currentPage);
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
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'EditSmallLevel' || from.name == 'AddSmallLevel') {
        this.getData(1);
      }
    }
  },
  created () {
    this.getData(1);
  }
}
</script>
