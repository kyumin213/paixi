<template>
  <section class="el-container wrapper is-vertical">
    <el-form>
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%" :row-class-name="tableRowClassName">
            
            <el-table-column
            label="主标签（可多选）"
            width="">
                <template  slot-scope="scope">
                    <el-checkbox v-model="mainLabels" :label="scope.row.labelTypeId">{{ scope.row.labelTypeName }}</el-checkbox>
                </template>
            </el-table-column>

            <el-table-column
            label="子标签（可多选）"
            width="">
                <template  slot-scope="scope">
                  <!-- @change="handleCheckedCitiesChange(scope.row)" -->
                    <el-checkbox-group v-model="checkedLabels">
                      <el-checkbox v-for="item in scope.row.labelList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-table-column>

            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">修改子标签</el-button>   
            </template>
            </el-table-column>
        </el-table>
        <el-row style="margin-top:20px;">
            <el-col :span="2" :offset="4">
                <el-button
                    @click="handleSave" type="primary">保存</el-button>
            </el-col>
            <el-col :span="2">
                <el-button
                      @click="resetForm('ruleForm')">重置</el-button>
            </el-col>
        </el-row>
        
      </el-col>
    </el-row> 
    </el-form>
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
  name: 'SelectLabels',
  data() {
    return {
      token: getStore('token'),
      tableData: [],
      id: this.$route.params.id,
      checkedLabels: [],
      mainLabels: []
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.status == 0) {
        return 'off-row'
      }
      return ''
    },
    handleCheckedCitiesChange(row) {
        // row.checkedLabels
        console.log(row.checkedLabels)
        // console.log(value)
    },
    getData () {
      jQuery.get(baseUrl + 'producttags/get/all', {token: this.token},(data) => {
        if(data.bean){
          this.tableData = data.bean
          for (var i in this.tableData) {
            this.tableData[i].checkedLabels = []
          }
          console.log(this.tableData)
        }
      })
    },
    handleEdit(index, row) {
      this.$router.go(0)
      this.$router.push({name: 'ChildLabelManager', params: {id: row.labelTypeId}})
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
    // 保存
    handleSave () {
      // console.log(this.mainLabels,this.checkedLabels)
      var mainLabels = this.mainLabels.toString()
      var checkedLabels = this.checkedLabels.toString()
      var reg = new RegExp( ',' , "g" )
      mainLabels = mainLabels.replace( reg , '，' );
      checkedLabels = checkedLabels.replace( reg , '，' );
      $.ajax({
        url: baseUrl + 'producttags/add',
        type: 'POST',
        dataType: 'json',
        data: {
          token: this.token,
          productId: this.id,
          labelsId: mainLabels,
          sunLabelsId: checkedLabels
        }
      })
      .done((data) => {
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "保存成功"
          })
          this.$router.go(0)
          this.$router.push({name: 'GoodsList'})
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  },
  created () {
    this.getData();
  }
}
</script>