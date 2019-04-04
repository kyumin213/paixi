<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <div class="form-contatiner">
    
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>

            <el-form-item label="是否有子分类" prop="isParent">
                <!-- <el-radio-group v-model="ruleForm.isParent"> -->
                <el-radio v-model="ruleForm.isParent" label="1">是</el-radio>
                <el-radio v-model="ruleForm.isParent" label="0">否</el-radio>
                <!-- </el-radio-group> -->
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
            </el-form-item>

            <el-form-item label="分类图标">
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
            </el-form-item> -->


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
    height: 150px;
    display: block;
  }
</style>

<script>
import { baseUrl } from '@/config/env'
import { baseImgPath } from '@/config/env'
import { getStore } from '@/config/mUtils'
export default {
  name: 'EditCategory',
  data() {
    return {
      token: getStore('token'),
      id: this.$route.params.id,
      uploadUrl: baseImgPath + 'picture/oss/upload/multi',
      isShowSecond: false,
      upLoadData: {
        token: getStore('token'),
      },
      list: [],
      ruleForm: { 
        categoryId: '',
        categoryIdSecond: '',
        cateGoryOptions: [{
          id: '0',
          name: ''
        }],
        templateOptions: [],
        parentId: '',
        paramTemplateId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { trigger: 'blur' }
        ],
        sortOrder: [
          { required: true }
        ],
        paramTemplateId: [
          { trigger: 'change' }
        ],
        isParent: [
          { required: true, message: '请选择是否有子分类', trigger: 'change' }
        ]
      }
    }
  },
    methods: {
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
            if (!this.ruleForm.picture) {
              this.ruleForm.picture = 'nopicture'
            }
            var parentId = this.ruleForm.parentIdSecond != ''?this.ruleForm.parentIdSecond:this.ruleForm.parentId
            $.ajax({
              url: baseUrl+'product/category/modify',
              type: 'POST',
              dataType: 'json',
              data: {
                token: this.token,
                id: this.id,
                name: this.ruleForm.name,
                parentId: parentId,
                picture: this.ruleForm.picture,
                isParent: this.ruleForm.isParent,
                sortOrder: this.ruleForm.sortOrder,
                paramTemplateId: this.ruleForm.paramTemplateId
              }
            })
            .done((data) => {
              console.log(data)
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "分类修改成功"
                })
                // this.$router.go(0)
                this.$router.push({ path: '/categoryList' })
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
          this.ruleForm.picture = res.bean
        }
      },
      getData () {
        $.get(baseUrl + 'product/category/get/all',{token: this.token}, (data) => {
          if (data.status == 200) {
            this.ruleForm.cateGoryOptions = data.bean
          } else {
            this.$message.error(data.msg)
          }  
        })
        $.get(baseUrl + 'product/template/get/all',{token: this.token}, (data) => {
          if (data.status == 200) {
            this.ruleForm.templateOptions = data.bean
          } else {
            this.$message.error(data.msg)
          }  
        })
        $.get(baseUrl + 'product/category/get', {token: this.token, id: this.id},(data) => {
          console.log(data.bean)
          this.ruleForm.name = data.bean.name
          this.ruleForm.isParent = data.bean.isParent.toString()
          this.ruleForm.sortOrder = data.bean.sortOrder
          this.ruleForm.paramTemplateId = data.bean.paramTemplateId
          if (data.bean.parentId == 0) {
            this.ruleForm.parentId = ''
          } else {
            this.ruleForm.parentId = data.bean.parentId
          }
        })
      }
    },
    watch: {
      '$route' (to, from) {
        if (from.path === '/categoryList') {
          this.id = to.params.id
          this.getData();
        }
      }
    },
    created () {
      this.getData()
    }
}
</script>
