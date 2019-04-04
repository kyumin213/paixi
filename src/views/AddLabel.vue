<template>
  <section class="el-container wrapper is-vertical">
    <div class="form-contatiner">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="标签名称" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>

            <el-form-item label="秒杀商品封面" prop="coverPic">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="upLoadData">
                  <img v-if="ruleForm.coverPic" :src="ruleForm.coverPic" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>

            <el-form-item label="关联的专题" prop="specialId">
                <el-select v-model="ruleForm.specialId" placeholder="请选择关联的专题">
                  <el-option
                    filterable 
                    v-for="item in ruleForm.specialOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="排序" prop="sortOrder">
                <el-input-number v-model="ruleForm.sortOrder" controls-position="right" :min="1"></el-input-number>
                <div class="tips">1为优先级别最高</div>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">添加标签</el-button>
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
  name: 'AddLabel',
  data() {
      return {
        token: getStore('token'),  
        isShowSecond: false,
        uploadUrl: baseImgPath + 'picture/oss/upload/multi',
        upLoadData: {
          token: getStore('token'),
          // fileName: 'http://image.prise.shop/images/2018/04/03/1522736335352510.png'
        },
        ruleForm: {
          title: '',
          paramTemplateId: '',
          categoryPicture: 'http://image.prise.shop/images/2018/04/09/1523268795038027.png',
          sortOrder: 1,
          specialOptions: [],
          cateGoryOptions: [{
            id: '0',
            name: '请选择父级分类'
          }],
          cateGoryOptionsSecond: [],
          coverPic: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入标签名称', trigger: 'blur' },
            { trigger: 'blur' }
          ],
          sortOrder: [
            { required: true }
          ]
        }
      };
    },
    methods: {
      getSpecial () {
        $.get(baseUrl + 'product/special/get/all',{token: this.token, id: 0}, (data) => {
          if (data.status == 200) {
            this.ruleForm.specialOptions = data.bean
            console.log(this.ruleForm.specialOptions)
          } else {
            this.$message.error(data.msg)
          }  
        })
      },
      selectSecond() {
        var id = this.ruleForm.parentId
        console.log(id)
        $.get(baseUrl + 'product/category/get/children/parent',{token: this.token, id: id}, (data) => {
          if (data.status == 200) {
            if (data.bean.length<1) {
              this.isShowSecond = false
              this.ruleForm.cateGoryOptionsSecond = data.bean
            } else {
              this.isShowSecond = true
              this.ruleForm.cateGoryOptionsSecond = data.bean
            }
          } else {
            this.$message.error(data.msg)
          }  
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            $.ajax({
              url: baseUrl+'product/special/label/add',
              type: 'POST',
              dataType: 'json',
              data: {
                token: this.token,
                title: this.ruleForm.title,
                sortOrder: this.ruleForm.sortOrder,
                specialId: this.ruleForm.specialId,
                picture: this.ruleForm.coverPic
              }
            })
            .done((data) => {
              console.log(data)
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "添加标签成功"
                })
                this.$router.back(-1)
                // this.$router.go(0)
                // this.$router.push({ path:'/labelList'})
              } else {
                this.$message.error(data.msg)
                // console.log('mmm')
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
          this.ruleForm.coverPic = res.bean
        }
      }
    },
    created () {
    //   this.getTemplate()
      this.getSpecial()
    }
}
</script>