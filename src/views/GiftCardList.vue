<template>
  <section class="el-container wrapper is-vertical">
     <el-row style="height:100%; margin-bottom:20px;">
        <el-col :span="4">
          <!-- multiple -->
          <el-input v-model="themeCard" placeholder="主题搜索" @blur="cardFilter" style="width:80%;"></el-input>        
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
            @click="addGiftCard"  type="primary" style="margin-bottom: 10px;">新增礼品卡</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%">
            <el-table-column
            label="主题"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.themeCard }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="批量"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.cardNumber }} </span>
            </template>
            </el-table-column>

            <el-table-column
            label="额度"
            width="">
            <template slot-scope="scope">
               <span>{{ scope.row.cardMoney }}</span>
            </template>
            </el-table-column>
            
            <el-table-column
            label="企业兑换码"
            width="">
            <template  slot-scope="scope">
                <span>{{ scope.row.keyCode }}</span>
            </template>
            </el-table-column>

            <el-table-column
            label="激活时间"
            width="">
            <template slot-scope="scope">
                <span>{{ scope.row.startTime }}</span>
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
            label="状态"
            width="">
            <template slot-scope="scope">
                <span>{{ statusTxt[scope.row.status] }}</span>
            </template>
            </el-table-column>

            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleActive(scope.$index, scope.row)" v-if="scope.row.status == 0">激活</el-button>
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.status == 0">编辑</el-button>

                <el-button
                size="mini"
                @click="handleDetails(scope.$index, scope.row)" v-if="scope.row.status != 0">查看详情</el-button>
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
      tableData: [],
      levelName:["","关卡一","关卡二","关卡三","关卡四","关卡五","关卡六","关卡七"],
      childName: ["","1","2","3","4","5","6","7"],
      currentPage: 1,
      total: 0,
      themeCard: '',
      cardMoney: '',
      statusTxt: ["未激活", "已激活", "已过期"]
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
      jQuery.get(baseUrl + 'user/cardbatch/all', {token: this.token, pageBegin: pageBegin, pageSize: 10, cardMoney: cardMoney, themeCard: themeCard},(data) => {
        this.tableData = data.bean
        this.total = data.total
      })
    },
    handleEdit(index, row) {
      this.$router.push({ path: `/EditGiftCard${row.id}` })
    },
    addGiftCard () {
      this.$router.push({name: 'AddGiftCard'})
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
    handleDetails (index, row) {
      this.$router.push({ path: `/GiftCardDetails${row.id}` })
    },
    handleActive (index, row) {      
      jQuery.get(baseUrl + 'user/cardbatch/activated/id', {token: this.token, id: row.id},(data) => {
        if (data.status == 200) {
          this.getData(this.currentPage, this.themeCard, this.cardMoney);
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'EditGiftCard' || from.name === 'AddGiftCard') {
        this.getData(1, this.themeCard, this.cardMoney);
      }
    }
  },
  created () {
    this.getData(1, this.themeCard, this.cardMoney);
  }
}
</script>
