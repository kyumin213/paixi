<template>
  <header class="el-header">
      <div class="header-logo">
          <router-link to="/home">派喜科技商城管理系统</router-link>
      </div>
      <ul class="header-operations">
          <li>admin</li>
          <li><a href="javascript:" @click="logout">退出</a></li>
      </ul>
  </header>
</template>
<style>
header{
    height: 70px;
    line-height: 70px;
    background: rgb(0,0,51);
    color: #fff;
}
.header-logo{
    float: left;
    font-size: 18px;
}
.header-operations{
    float: right;
    display: inline-block;
    font-size: 14px;
    padding-right: 30px;
    height: 100%;
}
.header-operations li{
    display: inline;
}
header a{
    color: #fff;
}
</style>
<script>
import { removeStore } from '@/config/mUtils'
export default {
  methods: {
    logout() {
    this.$confirm('确认退出登陆?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        removeStore('token')
        this.$router.push('/')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
    }).catch(() => {
            
    })
    }
  }
}
</script>
