<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <div class="theme-container">
      <el-row>
        <el-col :span="16">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
            <el-form-item label="专题名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入专题名称（1-20字符）"></el-input>
            </el-form-item>
            <el-form-item label="专题描述" prop="bewrite">
              <el-input v-model="ruleForm.bewrite" placeholder="请输入专题描述"></el-input>
            </el-form-item>
            
            <el-form-item label="专题上架时间">
              <el-date-picker
									v-model="ruleForm.beginTime"
									type="datetime"
									@change="getStartTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择专题上架时间">
								</el-date-picker>
            </el-form-item>

            <el-form-item label="专题下架时间">
              <el-date-picker
									v-model="ruleForm.endTime"
									type="datetime"
									@change="getEndTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择专题下架时间">
								</el-date-picker>
            </el-form-item>

            <el-form-item label="是否为秒杀活动">
              <el-radio-group v-model="ruleForm.category">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="专题排序" prop="sortOrder">
              <el-input-number v-model="ruleForm.sortOrder" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
              <div class="tips">1为优先级别最高</div>
            </el-form-item>
            <el-form-item label="封面图片" prop="pictureCover">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="upLoadData">
                  <img v-if="ruleForm.pictureCover" :src="ruleForm.pictureCover" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <!-- <el-form-item label="banner图片" prop="pictureBanner">
              <el-upload
                  class="avatar-uploader"
                  name="uploadFile"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessBanner"
                  :data="upLoadDataBanner">
                  <img v-if="ruleForm.pictureBanner" :src="ruleForm.pictureBanner" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item> -->
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
    width: 150px;
    height: auto;
    display: block;
  }
</style>

<script>
import { baseUrl } from '@/config/env'
import { baseImgPath } from '@/config/env'
import { getStore } from '@/config/mUtils'
export default {
  name: 'EditTheme',
  data() {
      return {
        token: getStore('token'),
        id: this.$route.params.id,
        uploadUrl: baseImgPath + 'picture/oss/upload/multi',
        upLoadData: {
          token: getStore('token'),
        //   fileName: 'http://image.prise.shop/images/2018/04/03/1522736335352510.png'
        },
        pictureBanner: '',
        upLoadDataBanner: {
          token: getStore('token'),
          // fileName: ''
        },
        list: [],
        ruleForm: {},
        rules: {
          name: [
            { required: true, message: '请输入专题名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          bewrite: [
            { required: true, message: '请输入专题描述', trigger: 'blur' }
          ],
          sortOrder: [
            { required: true, trigger: 'change' }
          ],
          pictureCover: [
            { required: true }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      getStartTime (date) {
        this.startTime = date;
        console.log(date)
      },
      getEndTime (date) {
        this.endTime = date;
        console.log(date)        
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var _this = this
            $.ajax({
              url: baseUrl+'product/special/modify',
              type: 'POST',
              dataType: 'json',
              data: {
                token: this.token,
                id: this.id,
                name: this.ruleForm.name,
                pictureCover: this.ruleForm.pictureCover,
                pictureBanner: 'https://image.prise.shop/images/2018/06/27/1530087052454036.jpg',
                sortOrder: this.ruleForm.sortOrder,
                bewrite: this.ruleForm.bewrite,
                category: this.ruleForm.category,
                beginTime: this.ruleForm.beginTime,
                endTime: this.ruleForm.endTime
              }
            })
            .done((data) => {
              console.log(data)
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "修改专题成功"
                })
                // this.$router.go(0)
                this.$router.push({ path: '/themeList' })
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
      handleChange(value) {
        console.log(value)
      },
      handleAvatarSuccess(res, file) {
        if (res.status == 200) {
          this.ruleForm.pictureCover = res.bean
        }
        // this.ruleForm.imageUrlCover = URL.createObjectURL(file.raw);
      },
      handleAvatarSuccessBanner(res, file) {
        if (res.status == 200) {
          this.ruleForm.pictureBanner = res.bean
          this.$message({
            type: "success",
            message: "图片已替换成功，请稍后刷新"
          })
        } else {
          this.$message.error(res.msg)
        }
      },
      getData () {
        console.log('id:' + this.id)
        jQuery.get(baseUrl + 'product/special/get', {token: this.token, id: this.id},(data) => {
          if (data.status == 200) {
            this.ruleForm = data.bean
            this.ruleForm.category = data.bean.category.toString()
            // this.upLoadDataBanner.fileName = data.bean.pictureBanner
            console.log(data.bean)
          }
        })
      }
    },
    created () {
      this.getData()
    },
    watch: {
      '$route' (to, from) {
        if (from.path === '/themeList') {
          this.id = to.params.id
          this.getData()
        }
      }
    },
}
</script>
