<template>
  <section class="el-container wrapper is-vertical">
    <div class="form-contatiner">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>

            <el-form-item label="是否有子分类" prop="isParent">
                <el-radio-group v-model="ruleForm.isParent">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="父级分类" prop="parentId">
                <el-select v-model="ruleForm.parentId" placeholder="请选择父级分类" @change="selectSecond">
                    <el-option
                        filterable 
                        v-for="item in ruleForm.cateGoryOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="ruleForm.parentIdSecond" placeholder="二级分类" v-if="isShowSecond">
                   <el-option
                      filterable 
                      v-for="item in ruleForm.cateGoryOptionsSecond"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
                
            </el-form-item>
            <!-- https://cms.prise.shop/picture/upload/multi -->
            <el-form-item label="分类图标">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="upLoadData">
                  <img v-if="ruleForm.categoryPicture" :src="ruleForm.categoryPicture" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>


            <!-- <el-form-item label="模板" prop="paramTemplateId">
                <el-select v-model="ruleForm.paramTemplateId" placeholder="请选择模板">
                  <el-option
                    filterable 
                    v-for="item in ruleForm.templateOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <router-link :to="{ name: 'TemplateList'}" class="link">模板管理</router-link>
            </el-form-item> -->


            <el-form-item label="排序" prop="sortOrder">
                <el-input-number v-model="ruleForm.sortOrder" controls-position="right" :min="1"></el-input-number>
                <div class="tips">1为优先级别最高</div>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">创建分类</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!-- <form id="uploadForm" enctype="multipart/form-data">  
      <input id="file" type="file" name="file"/>  
      <button id="upload" type="button">upload</button>  
    </form>   -->
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
  name: 'AddCategory',
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
          name: '',
          paramTemplateId: '',
          categoryPicture: 'http://image.prise.shop/images/2018/04/09/1523268795038027.png',
          isParent: '',
          sortOrder: 1,
          parentId: '',
          parentIdSecond: '',
          templateOptions: [],
          cateGoryOptions: [{
            id: '0',
            name: '请选择父级分类'
          }],
          cateGoryOptionsSecond: []
        },
        rules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { trigger: 'blur' }
          ],
          sortOrder: [
            { required: true }
          ],
          isParent: [
            { required: true, message: '请选择是否有子分类', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      getTemplate () {
        $.get(baseUrl + 'product/template/get/all',{token: this.token}, (data) => {
          console.log(data.bean)
          this.ruleForm.templateOptions = data.bean
        })
      },
      getCategory () {
        $.get(baseUrl + 'product/category/get/children',{token: this.token, id: 0}, (data) => {
          if (data.status == 200) {
            this.ruleForm.cateGoryOptions = data.bean
            console.log(this.ruleForm.cateGoryOptions)
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
            console.log(this.ruleForm.isParent)
            if (this.ruleForm.parentId == '') {
              this.ruleForm.parentId = 0
            }
            var parentId = this.ruleForm.parentIdSecond != ''?this.ruleForm.parentIdSecond:this.ruleForm.parentId
            $.ajax({
              url: baseUrl+'product/category/add',
              type: 'POST',
              dataType: 'json',
              data: {
                token: this.token,
                parentId: parentId,
                name: this.ruleForm.name,
                picture: this.ruleForm.categoryPicture,
                sortOrder: this.ruleForm.sortOrder,
                isParent: parseInt(this.ruleForm.isParent),
                paramTemplateId: this.ruleForm.paramTemplateId
              }
            })
            .done((data) => {
              console.log(data)
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "创建分类成功"
                })
                // this.$router.go(0)
                this.$router.push({ path:'/categoryList'})
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
          this.ruleForm.categoryPicture = res.bean
        }
      }
    },
    created () {
      this.getTemplate()
      this.getCategory()
    }
}
</script>