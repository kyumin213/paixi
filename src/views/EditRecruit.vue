<template>
  <section class="el-container wrapper is-vertical">
    <div class="theme-container article">
      <el-row>
        <el-col :span="22">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="招聘职位:" prop="recruitTitle">
                <el-input v-model="ruleForm.recruitTitle"></el-input>
            </el-form-item>

            <el-form-item label="招聘排序:" prop="sortOrders">
              <el-input-number v-model="ruleForm.sortOrders" controls-position="right" :min="1"></el-input-number>
              <div class="tips">1为优先级别最高</div>
            </el-form-item>

            <el-form-item label="招聘要求:" class="box">
              <vue-html5-editor :content="ruleForm.requirement" :height="500"  @change="ctnUpdate"></vue-html5-editor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">更新招聘</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<style>
.article .avatar-uploader-icon,
.article .avatar-uploader img {
  width: 378px;
}
.tips {
  display: inline-block;
  margin-left: 20px;
  color: #666;
}
.box {
  width: 80%;
}
</style>

<script>
import { baseUrl } from "@/config/env";
import { getStore } from "@/config/mUtils";
export default {
  name: "AddRecruit",
  data() {
    return {
      token: getStore("token"),
      id: this.$route.params.id,
      ruleForm: {
        recruitTitle: "",
        requirement: "",
        sortOrders: "1"
      },

      rules: {
        requirement: [{ required: true, message: "请输入职位要求和招聘条件" }],
        recruitTitle: [{ required: true, message: "请输入文章标题" }]
      }
    };
  },
  methods: {
    getEditRecruitById() {
      console.log(this.id);
      $.get(
        baseUrl + "major/recruit/select/by/id",
        { token: this.token, id: this.id },
        data => {
          if (data.status == 200) {
            this.ruleForm.recruitTitle = data.bean.recruitTitle;
            this.ruleForm.requirement = data.bean.requirement;
            this.ruleForm.sortOrders = data.bean.sortOrders;
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          $.ajax({
            url: baseUrl + "major/recruit/update",
            type: "POST",
            dataType: "json",
            data: {
              id:this.id,
              recruitTitle: this.ruleForm.recruitTitle,
              requirement: this.ruleForm.requirement,
              token: this.token,
              sortOrders: this.ruleForm.sortOrders
            }
          }).done(data => {
            if (data.status == 200) {
              this.$message({
                type: "success",
                message: "招聘信息更新成功"
              });
              this.$router.go(0);
              this.$router.push({ path: '/RecruitList' })
            } else {
              this.$message.error(data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    ctnUpdate: function(data) {
      this.ruleForm.requirement = data;
      console.log(this.ruleForm.requirement);
    }
  },
  created(){
    this.getEditRecruitById();
  }
};
</script>

