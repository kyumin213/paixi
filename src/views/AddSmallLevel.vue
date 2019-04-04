<template>
    <section class="el-container wrapper is-vertical">
        <div class="form-contatiner">
          <el-row>
            <el-col :span="16">
               <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" >
                    <el-form-item label="关联的关卡" prop="parentOrders">
                      <el-select v-model="ruleForm.parentOrders" placeholder="请选择关联的关卡">
                        <el-option
                          filterable 
                          v-for="item in gradeOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="关卡排序" prop="childOrders">
                      <el-select v-model="ruleForm.childOrders" placeholder="请选择关卡排序">
                        <el-option
                          filterable 
                          v-for="item in childOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="拼图名称" prop="jigsawTitle">
                        <el-input v-model="ruleForm.jigsawTitle"></el-input>
                    </el-form-item>   

                    <el-form-item label="拼图图片" prop="jigsawPicture">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl"
                            name="uploadFile"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            >
                            <img v-if="ruleForm.jigsawPicture" :src="ruleForm.jigsawPicture" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>           

                  <el-form-item>
                      <el-button type="success" @click="submitForm('ruleForm')">添加拼图</el-button>
                      <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
                  </el-form-item>
              </el-form>
            </el-col>
          </el-row>            
        </div>
    </section>
</template>

<script>
import { baseUrl } from "@/config/env";
import { baseImgPath } from '@/config/env'
import { getStore } from "@/config/mUtils";

export default {
  name:"AddSmallLevel",
  data() {
    return {
      token: getStore("token"),
      uploadUrl: baseImgPath + 'picture/oss/upload/multi',
      ruleForm: {
        jigsawPicture: "",
        jigsawTitle: "",
        childOrders: '',
        gradeId: ''
      },
      rules: {
        
      },
      childOptions: [{
            id: 1,
            name:"第1小关"
        },{
            id: 2,
            name:"第2小关"
        },{
            id: 3,
            name:"第3小关"
        },{
            id: 4,
            name:"第4小关"
        },{
            id: 5,
            name:"第5小关"
        },{
            id: 6,
            name:"第6小关"
        },{
            id: 7,
            name:"第7小关"
      }],
      gradeOptions: []
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var chooseAnswers = JSON.stringify(this.ruleForm.chooseAnswers);
          $.ajax({
            url: baseUrl + "promise/jigsaw/add",
            type: "POST",
            dataType: "json",
            data: {
              token: this.token,
              jigsawPicture: this.ruleForm.jigsawPicture,
              childOrders: this.ruleForm.childOrders,
              jigsawTitle: this.ruleForm.jigsawTitle,
              parentOrders: this.ruleForm.parentOrders
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                // this.$router.go(0)
                this.$router.push({ path:'/SmallLevelList'})
              } else {
                this.$message.error(data.msg);
              }
            })
            .fail(function(data) {
              console.log(data);
            });
          return false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getData() {
      $.get(
        baseUrl + "promise/jigsaw/grade/get/list",
        { token: this.token, pageBegin: 1, pageSize: 100 },
        data => {
          if (data.status == 200) {
            var arr = ['','第一关卡','第二关卡','第三关卡','第四关卡','第五关卡','第六关卡','第七关卡']
            for (var i in data.bean) {
              // this.gradeOptions[i].name = arr[data.bean[i].gradeOrders]
              // this.gradeOptions[i].id = data.bean[i].id
              this.gradeOptions.push({
                id: data.bean[i].gradeOrders,
                name: arr[data.bean[i].gradeOrders]
              })
            }
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    },
    handleAvatarSuccess (res) {
      if (res.status == 200) {
        this.ruleForm.jigsawPicture = res.bean
      }
    }
  },
  created() {
    this.getData();
  }
};
</script>