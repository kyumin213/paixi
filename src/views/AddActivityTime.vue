<template>
  <section class="el-container wrapper is-vertical">
    <div class="form-contatiner">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="下期活动时间" prop="title">
                <el-input v-model="ruleForm.title" placeholder="下期派喜免费活动将于09月07日21:00开始敬请期待！"></el-input>
            </el-form-item>

            <el-form-item label="下期活动描述" prop="describe">
                <el-input v-model="ruleForm.describe" placeholder="选填"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </section>
</template>
<style>
.form-contatiner{
    max-width: 600px;
    margin: 50px 0 0 50px;
}
.tips{
    display: inline-block;
    margin-left: 15px;
    color: #b3b3b3;
}
.link {
  color: #0896ec;
  cursor: pointer;
  margin-left: 20px;  
}
</style>
<script>
import { baseUrl } from '@/config/env'
import { getStore } from '@/config/mUtils'
export default {
  name: 'AddActivityTime',
  data() {
      return {
        token: getStore('token'),  
        ruleForm:{
          describe: '',
          title: ''
        },
        rules: {
            title: [
                { required: true, message: "请输入活动时间", trigger: "blur" },
                { trigger: "blur" }
            ],
            chooseAnswers: [{ required: true, message: "请输入答案选项" }]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
            if (valid) {
            var chooseAnswers = JSON.stringify(this.ruleForm.chooseAnswers);
            $.ajax({
                url: baseUrl + "system/config/add/activity/date",
                type: "POST",
                dataType: "json",
                data: {
                    token: this.token,
                    configValue: this.ruleForm.title,
                    description: this.ruleForm.describe
                }
            })
            .done(data => {
            if (data.status == 200) {
                this.$message({
                    type: "success",
                    message: "添加成功"
                });
                this.$refs[formName].resetFields();
            } else {
                this.$message.error(data.msg);
            }
            })
            .fail(function(data) {
              console.log(data);
            });
             return false;
            } else {
             return false;
            }
        });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
    },
}
</script>