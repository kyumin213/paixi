<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <div class="theme-container article">
      <el-row>
        <el-col :span="22">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>

            <el-form-item label="专题排序" prop="sortOrder">
              <el-input-number v-model="ruleForm.sortOrder" controls-position="right" :min="1"></el-input-number>
              <div class="tips">1为优先级别最高</div>
            </el-form-item>

            <el-form-item label="文章封面" prop="articleAbstract">
              <el-upload
                  class="avatar-uploader"
                  name="uploadFile"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessBanner"
                  :data="upLoadData">
                  <img v-if="ruleForm.articleAbstract" :src="ruleForm.articleAbstract" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">文件大小不能超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="文章内容">
              <vue-html5-editor :content="ruleForm.articleContent" :height="500"  @change="ctnUpdate"></vue-html5-editor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存修改</el-button>
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
  name: 'EditArticle',
  data() {
      return {
        token: getStore('token'),
        id: this.$route.params.id,
        uploadUrl: baseImgPath + 'picture/oss/upload/multi',
        upLoadData: {
          token: getStore('token'),
          // fileName: 'http://image.prise.shop/images/2018/04/12/1523518301145139.png'
        },
        list: [],
        ruleForm: {
          articleAbstract: '',
          title: '',
          articleContent: '',
          sortOrder: '1'
        },
        rules: {
          articleAbstract: [
            { required: true, message: '请上传banner图' }
          ],
          title: [
            { required: true, message: '请输入文章标题' }
          ]
        }
      };
    },
    methods: {
      getData () {
        jQuery.get(baseUrl + 'major/article/get/details', {token: this.token, id: this.id},(data) => {
            this.ruleForm = data.bean
            this.ruleForm.sort(compareDown("created"))
        })
      },
      //   提交修改
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            $.ajax({
              url: baseUrl + 'major/article/modify',
              type: 'POST',
              dataType: 'json',
              data: {
                title: this.ruleForm.title,
                articleAbstract: this.ruleForm.articleAbstract,
                articleContent: this.ruleForm.articleContent,
                token: this.token,
                sortOrder: this.ruleForm.sortOrder,
                id: this.id
              }
            })
            .done((data) => {
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "文章修改成功"
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
      // 删除
         
      handleChange(value) {
        console.log(value)
      },
      handleAvatarSuccessBanner(res, file) {
        if (res.status == 200) {
          this.ruleForm.imageUrlBanner = res.bean
        }
      },
      ctnUpdate: function (data) {
        this.ruleForm.articleContent = data
        console.log(this.ruleForm.articleContent)
      }
    },
    created() {
      this.getData()
    }
}
</script>