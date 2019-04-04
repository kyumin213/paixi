<template>
    <section class="el-container wrapper is-vertical">
        <div class="form-contatiner">
          <el-row>
            <el-col :span="16">
               <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" >
                    <el-form-item label="奖励名次" prop="rankOrders">
                      <el-select v-model="ruleForm.rankOrders" placeholder="请选择奖励名次">
                        <el-option
                          filterable 
                          v-for="item in gradeOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="奖品名称">
                        <el-input v-model="ruleForm.rewardName"></el-input>
                    </el-form-item>  

                    <el-form-item label="奖励能量值">
                        <el-input v-model="ruleForm.rewardValue"></el-input>
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
  name:"AddRankRewards",
  data() {
    return {
      token: getStore("token"),
      uploadUrl: baseImgPath + 'picture/oss/upload/multi',
      ruleForm: {
        rewardValue: "",
        rewardName: "",
        rankOrders: '',
        gradeId: '',
        rankName: ''
      },
      rules: {
        
      },
      gradeOptions: [{
            id: 1,
            name:"第一名"
        },{
            id: 2,
            name:"第二名"
        },{
            id: 3,
            name:"第三名"
        },{
            id: 4,
            name:"第四名"
        },{
            id: 5,
            name:"第五名"
        },{
            id: 6,
            name:"第六名"
        },{
            id: 7,
            name:"第七名"
        },{
                id: 8,
                name:"第八名"
        },{
                id: 9,
                name:"第九名"
        },{
                id: 10,
                name:"第十名"
        }]
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var chooseAnswers = JSON.stringify(this.ruleForm.chooseAnswers);
          for (var i in this.gradeOptions) {
            if (this.gradeOptions[i].id == this.ruleForm.rankOrders) {
              this.ruleForm.rankName = this.gradeOptions[i].name
            }
          }
          console.log(this.ruleForm.rankName)
          $.ajax({
            url: baseUrl + "promise/rank/reward/add",
            type: "POST",
            dataType: "json",
            data: {
              token: this.token,
              rewardValue: this.ruleForm.rewardValue,
              rankOrders: this.ruleForm.rankOrders,
              rewardName: this.ruleForm.rewardName,
              rankName: this.ruleForm.rankName
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
            this.$router.push({ path:'/RankRewardList'})
            } else {
            this.$message.error(data.msg);
            }
        })
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
    // this.getData();
  }
};
</script>