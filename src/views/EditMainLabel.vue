<template>
  <section class="el-container wrapper is-vertical">
    <div class="form-contatiner">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="场景名称" prop="labelName">
                <el-input v-model="ruleForm.labelName"></el-input>
            </el-form-item>

            <el-form-item label="标签图标" prop="url">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="upLoadData">
                  <img v-if="ruleForm.labelIcon" :src="ruleForm.labelIcon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>

            <el-form-item label="标签顺序" prop="reorder">
                <el-input-number v-model="ruleForm.reorder" controls-position="right" :min="1"></el-input-number>
                <div class="tips">1为优先级别最高</div>
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
import { baseImgPath } from '@/config/env'
import { getStore } from '@/config/mUtils'
export default {
  name: 'EditMainLabel',
  data() {
      return {
        token: getStore('token'),  
        id: this.$route.params.id,
        isShowSecond: false,
        uploadUrl: baseImgPath + 'picture/oss/upload/multi',
        upLoadData: {
          token: getStore('token'),
        },
        ruleForm: {
          
        },
        rules: {
      
        }
      };
    },
    methods: {
      getDetails () {
        $.get(baseUrl + 'label/category/get/id',{token: this.token, id: this.id}, (data) => {
          if (data.status == 200) {
            this.ruleForm = data.bean
          } else {
            this.$message.error(data.msg)
          }  
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            $.ajax({
              url: baseUrl+'label/category/update',
              type: 'POST',
              dataType: 'json',
              data: {
                token: this.token,
                labelName: this.ruleForm.labelName,
                url: this.ruleForm.labelIcon,
                reorder: this.ruleForm.reorder,
                id: this.id
              }
            })
            .done((data) => {
              console.log(data)
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                })
                // this.$router.back(-1)
                this.$router.go(0)
                this.$router.push({ path:'/LabelManager'})
              } else {
                this.$message.error(data.msg)
              }
            })
            .fail(function (data) {
              console.log(data)
            })
            return false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleAvatarSuccess(res, file) {
        if (res.status == 200) {
          this.ruleForm.labelIcon = res.bean
        }
      }
    },
    created () {
      this.getDetails()
    }
}
</script>