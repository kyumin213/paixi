<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%;text-align:center;"
            :row-class-name="tableRowClassName">
            <el-table-column
            label="用户编号" width="160">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="头像"
            >
              <template  slot-scope="scope">
                <img v-bind:src="scope.row.picture" class="thumnial">
              </template>
            </el-table-column>

            <el-table-column
            label="用户昵称" width="160">
              <template  slot-scope="scope">
                  <span v-html="scope.row.nickname"></span>
              </template>
            </el-table-column>

            <el-table-column label="认证手机号">
              <template  slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>

            <el-table-column label="注册时间" width="200">
              <template  slot-scope="scope">
                <span>{{scope.row.created}}</span>
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
  name: 'JoinerList',
  data() {
    return {
      token: getStore('token'),
      tableData: [],
      userId: this.$route.params.id,
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
      jQuery.get(baseUrl + 'user/px/get/details', {token: this.token, userId: this.userId},(data) => {
        if(data.bean){
          var obj = data.bean
          this.tableData.push(obj)
        //   this.tableData.sort(compareDown("created"))
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'ConsigneesList') {
        this.userId = to.params.id
        this.getData()
      }
    }
  },
  created () {
    this.getData();
  }
}
</script>