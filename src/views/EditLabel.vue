<template>
  <section class="el-container wrapper is-vertical">
    <div class="form-contatiner">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="标签名称" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
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

            <el-form-item label="秒杀商品封面" prop="picture">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="upLoadData">
                  <img v-if="ruleForm.picture" :src="ruleForm.picture" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>

            <el-form-item label="排序" prop="sortOrder">
                <el-input-number v-model="ruleForm.sortOrder" controls-position="right" :min="1"></el-input-number>
                <div class="tips">1为优先级别最高</div>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存修改</el-button>
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
  name: 'EditLabel',
  data() {
      return {
        id: this.$route.params.id,
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
          specialId: '',
          categoryPicture: 'http://image.prise.shop/images/2018/04/09/1523268795038027.png',
          sortOrder: 1,
          specialOptions: [],
          cateGoryOptions: [{
            id: '0',
            name: '请选择父级分类'
          }],
          cateGoryOptionsSecond: []
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
        $.get(baseUrl + 'product/special/get/all',{token: this.token, id: this.id}, (data) => {
            if (data.status == 200) {
            this.ruleForm.specialOptions = data.bean
            console.log(this.ruleForm.specialOptions)
            } else {
            this.$message.error(data.msg)
            }  
        })
        $.get(baseUrl + 'product/special/label/get/by/id',{token: this.token, id: this.id}, (data) => {
          if (data.status == 200) {
            this.ruleForm.title = data.bean.title
            this.ruleForm.specialId = data.bean.specialId
            this.ruleForm.sortOrder = data.bean.sortOrder
            this.ruleForm.picture = data.bean.picture
            // console.log(this.ruleForm)
          } else {
            this.$message.error(data.msg)
          }  
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            $.ajax({
              url: baseUrl+'product/special/label/modify',
              type: 'POST',
              dataType: 'json',
              data: {
                token: this.token,
                id: this.id,
                title: this.ruleForm.title,
                sortOrder: this.ruleForm.sortOrder,
                specialId: this.ruleForm.specialId,
                picture: this.ruleForm.picture
              }
            })
            .done((data) => {
              console.log(data)
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "修改标签成功"
                })
                this.$router.back(-1)
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
          this.ruleForm.picture = res.bean
        }
      }
    },
    watch: {
      '$route' (to, from) {
        if (from.name === 'LabelList') {
          this.id = to.params.id
          this.getSpecial()
        }
      }
    },
    created () {
      this.getSpecial()
    }
}
</script>