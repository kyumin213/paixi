<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <div class="theme-container">
      <el-row>
        <el-col :span="16">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="banner图片" prop="imageUrlBanner">
              <el-upload
                  class="avatar-uploader"
                  name="uploadFile"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessBanner"
                  :data="upLoadData">
                  <img v-if="ruleForm.imageUrlBanner" :src="ruleForm.imageUrlBanner" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">文件大小不能超过500kb</div>
              </el-upload>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">保存封面</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item> -->
          </el-form>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<style>
.tips{
    display: inline-block;
    margin-left: 15px;
    color: #b3b3b3;
}
.theme-container{
  margin-top: 20px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 750px;
    height: 350px;
    display: block;
  }
</style>

<script>
import { baseUrl } from '@/config/env'
import { baseImgPath } from '@/config/env'
import { getStore } from '@/config/mUtils'
export default {
  name: 'banner',
  data() {
      return {
        token: getStore('token'),
        uploadUrl: baseImgPath + 'picture/oss/upload/multi',
        upLoadData: {
          token: getStore('token'),
          fileName: 'http://image.prise.shop/images/2018/04/12/1523518301145139.png'
        },
        list: [],
        ruleForm: {
          imageUrlBanner: 'https://image.prise.shop/images/2018/04/12/1523518301145139.png',
        },
        rules: {
          imageUrlBanner: [
            { required: true, message: '请上传banner图' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleChange(value) {
        console.log(value)
      },
      handleAvatarSuccessBanner(res, file) {
        if (res.status == 200) {
          this.ruleForm.imageUrlBanner = res.bean
          this.$message({
            type: "success",
            message: "图片修改成功"
          })
          this.$router.go(0)
        }
        // this.ruleForm.imageUrlBanner = URL.createObjectURL(file.raw);
      }
    }
}
</script>
