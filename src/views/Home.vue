<template>
  <section class="el-container wrapper is-vertical">
    <Header></Header>
    <el-row style="height:100%;">
      <side-bar></side-bar>
      <el-col :span="21">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in $route.meta" :key="item.id">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>

      </el-col>
    </el-row>
  </section>
</template>
<style>
.el-breadcrumb {
    border-bottom: solid 1px #e6e6e6;
    padding-bottom: 10px;
    margin-bottom: 10px;
}
.el-col-20,.el-col-21 {
  padding: 20px;
  border-left: solid 1px #e6e6e6;
  min-height: 600px;
}
</style>

<script>
import Header from '@/components/Header'
import SideBar from '@/components/SideBar'
import { getStore } from '@/config/mUtils'
export default {
  name: 'Home',
  components: {
    Header,
    SideBar
  },
  data() {
      return {
        token: getStore('token'),
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          email: ''
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: ''
        })
        console.log(this.dynamicValidateForm.domains)
      }
    }
}
</script>
