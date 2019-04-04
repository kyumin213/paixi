<template>
  <section class="el-container wrapper is-vertical">
     <div class="form-contatiner">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="题目数量" >
                <el-input v-model="ruleForm.subjectNumber" ></el-input>
            </el-form-item>

            <el-form-item label="奖励能量" >
                <el-input v-model="ruleForm.reward"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </section>
</template>
<style>
.avatar {
    width: 150px;
    height: 150px;
}
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
  name: 'TreeAnswersetting',
  data() {
      return {
        token: getStore('token'),  
        ruleForm:{
          subjectNumber: '',
          reward: ''
        },
        rules: {
            
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
            if (valid) {
                $.ajax({
                    url: baseUrl + "promise/answer/update",
                    type: "POST",
                    dataType: "json",
                    data: {
                        token: this.token,
                        number: this.ruleForm.subjectNumber,
                        reward: this.ruleForm.reward,
                        id: this.ruleForm.id
                    }
                })
                .done(data => {
                if (data.status == 200) {
                    this.$message({
                        type: "success",
                        message: "更新成功"
                    });
                    this.getData();
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
        getData () {
            jQuery.get(baseUrl + 'promise/answer/get', 
            {
                token: this.token
            },
            (data) => {
                this.ruleForm = data.bean
            })
        },
    },
    created () {
        this.getData()
    }
}
</script>