<template>
    <section class="el-container wrapper is-vertical">
        <div class="form-contatiner">            
            <el-row>
                <el-col :span="16">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" >
                        <el-form-item label="关卡选择" prop="gradeOrders">
                            <el-select v-model="ruleForm.gradeOrders" placeholder="请选择要设置的关卡">
                                <el-option
                                filterable 
                                v-for="item in gradeOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="图片分割" prop="pictureSplit">
                            <el-select v-model="ruleForm.pictureSplit" placeholder="请选择图片分割">
                                <el-option
                                filterable 
                                v-for="item in pictureOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="关卡限时:" prop="limitTime">
                            <el-input v-model="ruleForm.limitTime" placeholder="请以秒为单位上传"></el-input>
                        </el-form-item>  
                        <el-form-item label="成功能量值:" prop="growthValue">
                            <el-input v-model="ruleForm.growthValue"></el-input>
                        </el-form-item>                                          

                        <el-form-item>
                            <el-button type="success" @click="submitForm('ruleForm')">添加关卡设置</el-button>
                            <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>          
        </div>
    </section>
</template>

<style>
.box {
  width: 100%;
}

.info-box {
  margin-top: 5px;
  margin-bottom: 10px;
  width: 40%;
}
</style>


<script>
import { baseUrl } from "@/config/env";
import { getStore } from "@/config/mUtils";

export default {
  name:"AddBigLevel",
  data() {
    return {
      token: getStore("token"),
      ruleForm: {
        problems: "",
        chooseAnswers: [
          {
            choose: "",
            chooseValue: ""
          }
        ],
        answer: "",
        specialOptions: [],
        gradeOrders: null,
        growthValue: "",
        limitTime: "",
      },
      rules: {
        limitTime: [
          { required: true, message: "请输入关卡限时", trigger: "blur" }
        ],
        growthValue: [
          { required: true, message: "请输入关卡成熟值", trigger: "blur" }
        ],
        pictureSplit: [
          { required: true, message: "请选择图片分割" },
        ],
        gradeOrders: [{ required: true, message: "请选择关卡" }],
      },
      gradeOptions: [{
            id: 1,
            name:"第一关卡"
        },{
            id: 2,
            name:"第二关卡"
        },{
            id: 3,
            name:"第三关卡"
        },{
            id: 4,
            name:"第四关卡"
        },{
            id: 5,
            name:"第五关卡"
        },{
            id: 6,
            name:"第六关卡"
        },{
            id: 7,
            name:"第七关卡"
      }],
      pictureOptions: [{
            id: 3,
            name:"3X3"
        },{
            id: 4,
            name:"4X4"
        },{
            id: 5,
            name:"5X5"
        },{
            id: 6,
            name:"6X6"
        },{
            id: 7,
            name:"7X7"
        },{
            id: 8,
            name:"8X8"
        },{
            id: 9,
            name:"9X9"
      }]
    };
  },

  methods: {
    addInfo() {
      this.ruleForm.chooseAnswers.push({
        choose: "",
        chooseValue: ""
      });
      // console.log(this.ruleForm.chooseAnswers);
    },

    removeChoose(item) {
      var index = this.ruleForm.chooseAnswers.indexOf(item);
      if (index !== -1) {
        this.ruleForm.chooseAnswers.splice(index, 1);
      }
    },
    submitForm(formName) {
        console.log(this.ruleForm.pictureSplit)
        console.log(typeof(this.ruleForm.pictureSplit))
      this.$refs[formName].validate(valid => {
        if (valid) {
          var chooseAnswers = JSON.stringify(this.ruleForm.chooseAnswers);
          $.ajax({
            url: baseUrl + "promise/jigsaw/grade/add",
            type: "POST",
            dataType: "json",
            data: {
              token: this.token,
              gradeOrders: this.ruleForm.gradeOrders,
              limitTime: this.ruleForm.limitTime,
              pictureSplit: this.ruleForm.pictureSplit,
              growthValue: this.ruleForm.growthValue
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.$router.push({ name: "BigLevelList" });
                // this.$router.go(0)
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
  },
  created() {
    
  }
};
</script>