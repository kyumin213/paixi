<template>
    <section class="el-container wrapper is-vertical">
        <div class="form-contatiner">
          <el-row>
            <el-col :span="16">
               <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" >
                    <el-form-item label="关联主标签">
                      <el-select v-model="ruleForm.labelId" placeholder="请选择关联的主标签">
                        <el-option
                          filterable 
                          v-for="item in labelOptions"
                          :key="item.id"
                          :label="item.labelName"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="子标签名称">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>   

                    <el-form-item label="立即上架">
                        <el-radio-group v-model="ruleForm.status">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="2">否</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="标签顺序" prop="reorder">
                        <el-input-number v-model="ruleForm.reorder" controls-position="right" :min="1"></el-input-number>
                        <div class="tips">1为优先级别最高</div>
                    </el-form-item>

                   
                  <el-form-item>
                      <el-button type="success" @click="submitForm('ruleForm')">保存</el-button>
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
  name:"EditSmallLabel",
  data() {
    return {
      token: getStore("token"),
      uploadUrl: baseImgPath + 'picture/oss/upload/multi',
      ruleForm: {
        jigsawPicture: "",
        jigsawTitle: "",
        childOrders: '',
        gradeId: '',
        status: '2',
        reorder: 1,
        id: this.$route.params.id
      },
      rules: {
        
      },
      labelOptions: [],
      gradeOptions: [],
      id: this.$route.params.id,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          $.ajax({
            url: baseUrl + "label/update",
            type: "POST",
            dataType: "json",
            data: {
              token: this.token,
              labelId: this.ruleForm.labelId,
              name: this.ruleForm.name,
              status: this.ruleForm.status,
              reorder: this.ruleForm.reorder,
              id: this.id
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.$router.go(0)
                this.$router.push({ path:'/LabelManager'})
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
        baseUrl + "label/get/id",
        { token: this.token, id: this.id },
        data => {
          if (data.status == 200) {
            this.ruleForm = data.bean
            this.ruleForm.labelId = data.bean.labtypeId
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    },
    getLabels () {
        $.get(
            baseUrl + "label/category/get/all",
            { token: this.token, pageBegin: 1, pageSize: 100 },
            data => {
            if (data.status == 200) {
                this.labelOptions = data.bean
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
     this.getLabels()
    this.getData();
  }
};
</script>