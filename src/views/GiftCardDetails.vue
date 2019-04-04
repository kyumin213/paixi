<template>
  <section class="el-container wrapper is-vertical">
    <el-row>
      <el-col :span="4">
        <el-button
            @click="exportCardInfo"  type="primary" style="margin-bottom: 10px;">导出</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%">

            <el-table-column
            label="卡号"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.cardId }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="额度"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.rechargeMoney }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="用户ID"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.userId }}</span>
            </template>
            </el-table-column>
            
            <el-table-column
            label="密码"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.cardPassword }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="状态"
            width="">
            <template slot-scope="scope">
                <span>{{ statusTxt[scope.row.status] }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="主题"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.themeCard }}</span>
            </template>
            </el-table-column>

            <el-table-column label="兑换时间">
            <template slot-scope="scope">
                <span>{{ scope.row.rechargeTime }}</span>
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
  name: 'GiftCardList',
  data() {
    return {
      token: getStore('token'),
      id: this.$route.params.id,
      tableData: [],
      levelName:["","关卡一","关卡二","关卡三","关卡四","关卡五","关卡六","关卡七"],
      childName: ["","1","2","3","4","5","6","7"],
      currentPage: 1,
      total: 0,
      themeCard: '',
      cardMoney: '',
      statusTxt: ["未激活", "已激活"]
    }
  },
  methods: {
    cardFilter () {
      this.getData(this.currentPage);
    },
    handleCurrentChangeQuery (val) {
      this.currentPage = val
      this.getData(this.currentPage);
    },
    getData (pageBegin) {
      jQuery.get(baseUrl + 'user/recharge/card/get/card', {token: this.token, pageBegin: pageBegin, pageSize: 10,id: this.id},(data) => {
        this.tableData = data.bean
        this.total = data.total
      })
    },
    exportCardInfo () {
        $.ajax({
            url: baseUrl + 'user/recharge/card/get/excelDetails',
            type: 'POST',
            dataType: 'json',
            data: {token: this.token, id: this.id}
        })
        .done((data)=>{
          if (data.status == 200) {
            window.location = data.bean
          }  else {
             this.$message.error(data.msg)
          }        
        })        
    },
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'GiftCardList') {
        this.id = to.params.id
        this.getData(this.currentPage);
      }
    }
  },
  created () {
      this.getData(this.currentPage);
  }
}
</script>
