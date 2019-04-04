<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <div class="theme-container article">
      <el-row>
        <el-col :span="22">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="文章标题" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>

            <el-form-item label="专题排序" prop="sortOrder">
              <el-input-number v-model="ruleForm.sortOrder" controls-position="right" :min="1"></el-input-number>
              <div class="tips">1为优先级别最高</div>
            </el-form-item>

            <el-form-item label="文章封面" prop="imageUrlBanner">
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
            <el-form-item label="文章内容">
              <vue-html5-editor :content="ruleForm.content" :height="500"  @change="ctnUpdate"></vue-html5-editor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存文章</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<style>
  .article .avatar-uploader-icon, .article .avatar-uploader img {
    width: 378px;
  }
  .tips {
    display: inline-block;
    margin-left: 20px;
    color: #666;
  }
</style>

<script>
import { baseUrl } from '@/config/env'
import { baseImgPath } from '@/config/env'
import { getStore } from '@/config/mUtils'
export default {
  name: 'AddArticle',
  data() {
      return {
        token: getStore('token'),
        content: '',
        uploadUrl: baseImgPath + 'picture/oss/upload/multi',
        upLoadData: {
          token: getStore('token'),
          // fileName: 'http://image.prise.shop/images/2018/04/12/1523518301145139.png'
        },
        list: [],
        ruleForm: {
          imageUrlBanner: '',
          name: '',
          content: '',
          sortOrder: '1'
        },
        rules: {
          imageUrlBanner: [
            { required: true, message: '请上传banner图' }
          ],
          name: [
            { required: true, message: '请输入文章标题' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            $.ajax({
              url: baseUrl + 'major/article/add',
              type: 'POST',
              dataType: 'json',
              data: {
                title: this.ruleForm.name,
                articleAbstract: this.ruleForm.imageUrlBanner,
                articleContent: this.ruleForm.content,
                token: this.token,
                sortOrder: this.ruleForm.sortOrder
              }
            })
            .done((data) => {
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "文章发布成功"
                })
                this.$router.go(0)
                this.$router.push({ path: '/articleList' })
              } else {
                this.$message.error(data.msg)
              }
            })
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
        }
      },
      ctnUpdate: function (data) {
        this.ruleForm.content = data
        console.log(this.ruleForm.content)
      }
    }
}
</script>
