<template>
  <section class="el-container wrapper is-vertical">
    <div class="theme-container article">
      <el-row>
        <el-col :span="22">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="攻略名称:" prop="strategyTitle">
                <el-input v-model="ruleForm.strategyTitle"></el-input>
            </el-form-item>

            <el-form-item label="攻略排序:" prop="sortOrder">
              <el-input-number v-model="ruleForm.sortOrder" controls-position="right" :min="1"></el-input-number>
              <div class="tips">1为优先级别最高</div>
            </el-form-item>

            <el-form-item label="攻略内容:" class="box" prop="strategyContent">
              <vue-html5-editor :content="ruleForm.strategyContent" :height="500"  @change="ctnUpdate"></vue-html5-editor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">添加攻略</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
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
  name: "AddStrategy",
  data() {
    return {
      token: getStore("token"),
      content: "",

      ruleForm: {
        strategyTitle: "",
        strategyContent: "",
        sortOrder: "1"
      },
      rules: {
        strategyTitle: [{ required: true, message: "请输入攻略标题" }],
        strategyContent: [{ required: true, message: "请输入攻略内容" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          $.ajax({
            url: baseUrl + "promise/strategy/add",
            type: "POST",
            dataType: "json",
            data: {
              strategyTitle: this.ruleForm.strategyTitle,
              strategyContent: this.ruleForm.strategyContent,
              token: this.token,
              sortOrder: this.ruleForm.sortOrder
            }
          }).done(data => {
            if (data.status == 200) {
              this.$message({
                type: "success",
                message: "攻略添加成功"
              });
              this.$router.go(0);
              this.$router.push({ path: '/StrategyList' })
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
      this.ruleForm.strategyContent = data;
      // console.log(this.ruleForm.strategyContent);
    }
  }
};
</script>