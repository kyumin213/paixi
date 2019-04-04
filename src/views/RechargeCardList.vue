<template>
  <section class="el-container wrapper is-vertical">
     <el-row style="height:100%; margin-bottom:20px;">
        <el-col :span="4">
          <!-- multiple -->
          <el-input v-model="themeCard" placeholder="主题名称搜索" @blur="cardFilter" style="width:80%;"></el-input>        
        </el-col>
        <!-- 按卖点搜索 -->
        <el-col :span="4">
          <!-- multiple -->
          <el-input v-model="cardMoney" placeholder="额度搜索" @blur="cardFilter" style="width:80%;"></el-input>        
        </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-button
            @click="exportCard"  type="primary" style="margin-bottom: 10px;">导出</el-button>
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
                <span>{{ scope.row.cardId }} </span>
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
            label="用户编号"
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

            <el-table-column
            label="兑换时间"
            width="">
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
  name: 'RechargeCardList',
  data() {
    return {
      token: getStore('token'),
      tableData: [],
      levelName:["","关卡一","关卡二","关卡三","关卡四","关卡五","关卡六","关卡七"],
      childName: ["","1","2","3","4","5","6","7"],
      currentPage: 1,
      total: 0,
      themeCard: '',
      cardMoney: '',
      statusTxt: ["未使用", "已使用", "已过期"],
      cardMoney: '',
      themeCard: ''
    }
  },
  methods: {
    cardFilter () {
      this.getData(this.currentPage, this.themeCard, this.cardMoney);
    },
    handleCurrentChangeQuery (val) {
      this.currentPage = val
      this.getData(this.currentPage, this.themeCard, this.cardMoney);
    },
    getData (pageBegin, themeCard, cardMoney) {
      jQuery.get(baseUrl + 'user/recharge/card/all', {token: this.token, pageBegin: pageBegin, pageSize: 10, cardMoney: cardMoney, themeCard: themeCard},(data) => {
        this.tableData = data.bean
        this.total = data.total
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.$router.go(0)
      this.$router.push({name: 'EditGiftCard', params: {id: row.id}})
    },

    handleDetails (index, row) {
      this.$router.go(0)
      this.$router.push({name: 'GiftCardDetails', params: {id: row.id}})
    },
    handleActive (index, row) {      
      jQuery.get(baseUrl + 'user/cardbatch/activated/id', {token: this.token, id: row.id},(data) => {
        if (data.status == 200) {
          this.getData(this.currentPage, this.themeCard, this.cardMoney);
        }
      })
    },
    exportCard: function () {
        jQuery.get(baseUrl + 'user/recharge/card/get/excelRechargeCardAll', {token: this.token, themeCard: this.themeCard, cardMoney: this.cardMoney},(data) => {
            window.location = data.bean  
            console.log(data.bean)
        })
    }
  },
  created () {
    this.getData(this.currentPage, this.themeCard, this.cardMoney);
  }
}
</script>
