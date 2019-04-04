<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <!-- 搜索 -->
    <el-row style="height:100%;">
      <!-- 按编号搜索 -->
      <el-col :span="4">
        <el-input v-model="userId" placeholder="用户编号" @blur="userFilter" style="width:80%;"></el-input>
      </el-col>
      <!-- 按名称搜索 -->
      <el-col :span="4">
        <el-input v-model="nickname" placeholder="用户昵称" @blur="userFilter" style="width:80%;"></el-input>        
      </el-col>
    </el-row>
    <!-- 搜索结束 -->
    <!-- 商品列表 -->
    <el-row class="goodslist">
      <el-col :span="24">
        <el-table
            border
            :data="tableData"
            style="width: 100%;text-align:center;">
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

            <el-table-column label="状态">
              <template  slot-scope="scope">
                <span v-if="scope.row.status == 1">活动</span>
                <span v-if="scope.row.status == 0">冻结</span>
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
.goodslist {
  margin-top: 50px;
}
.thumnial {
  width: 100px;
  height: 100px;
}
.select-two {
  width: 160px;
  margin-top: 10px;
}
.select-one {
  width: 160px;
  margin-top: 10px;
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { getStore } from "@/config/mUtils";
export default {
  name: "GoodsList",
  data() {
    return {
      token: getStore("token"),
      total: 0,
      currentPage: 1,
      loading: false,
      goodsTitle: "",
      goodsId: "",
      tableData: [],
      statusvalue: "",
      valueDate: [],
      userId: '',
      nickname: ''
    };
  },
  methods: {
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      this.getUserAll(this.currentPage, this.userId, this.nickname)
    },
    userFilter () {
      this.getUserAll(this.currentPage, this.userId, this.nickname)
    },
    getUserAll(pageBegin, id, nickname) {
      $.get(
        baseUrl + "user/px/get/user/all",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          id: id,
          nickname: nickname
        },
        data => {
          console.log(data);
          if (data.status == 200) {
            this.tableData = data.bean;
            if (this.tableData) {
              this.tableData.sort(compareDown("created"));
            }
            this.total = data.total;
          }
        }
      );
    }
  },
  created() {
    this.getUserAll(this.currentPage, this.userId, this.nickname);
  }
};
</script>