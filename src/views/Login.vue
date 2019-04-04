<template>
  <div class="login_page fillcontain">
    <div class="login-container">
      
      <transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">	
          <div class="manage_tip">
            <h1>派喜商城后台管理系统</h1>
          </div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm">
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" placeholder="用户名"><span>dsfsf</span></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
					</el-form-item>
					<el-form-item>
				    	<el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
				  	</el-form-item>
				</el-form>
	  		</section>
	  	</transition>
    </div>
  	</div>
</template>

<script>
import { baseUrl } from '@/config/env'
import { setStore } from '@/config/mUtils'
export default {
  name: 'Login',  
  data() {
    return {
      token: 'paixi_123',
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      showLogin: true
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          $.ajax({
            url: baseUrl+'user/admin/login',
            type: 'POST',
            dataType: 'json',
            data: {
              token: this.token,
              name: this.loginForm.username,
              password: this.loginForm.password,
            }
          })
          .done((data) => {
            console.log(data)
            if (data.status == 200) {
              var token = data.bean
              console.log(token)
              setStore('token',token)
              this.$message({
                type: "success",
                message: "登录成功"
              })
              this.$router.push("goodsList")
            } else {
              this.$message({
                type: "error",
                message: "用户名或密码错误"
              })
            }
          })
          .fail(function (data) {
            console.log(data)
          })
          // if (this.loginForm.username=='paixi888'&&this.loginForm.password=='paixi666') {
          //   this.$message({
          //     type: "success",
          //     message: "登录成功"
          //   })
          //   this.$router.push("home")
          // } else {
          //   this.$message({
          //     type: "error",
          //     message: "用户名或密码错误"
          //   })
          // }
        } else {
          console.log('error submit!!')
          return false;
        }
      });
    },
    // submitForm: function() {
    //   this.$message({
    //     type: "success",
    //     message: "登录成功"
    //   })
    //   this.$router.push("home")
    // }
  }
};
</script>


<style scoped>
.login-container{
  width: 400px;
  margin: 0 auto;
}
.manage_tip h1{
  font-weight: normal;
  font-size: 24px;
  margin-bottom: 20px;
}
.login_page {
  background-color: #324057;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* align-content: center; */
  justify-content: center;
}
.form_contianer {
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
