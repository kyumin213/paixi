<template>
  <section class="el-container wrapper is-vertical">
    <div class="theme-container article">
      <el-row>
        <el-col :span="22">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">           

            <el-form-item label="惊喜开始时间">
                <el-date-picker
                    v-model="startTime"
                    type="datetime"
                    @change="getStartTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择惊喜开始时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="惊喜结束时间">
                <el-date-picker
                    v-model="endTime"
                    type="datetime"
                    @change="getEndTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择惊喜结束时间">
                </el-date-picker>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">添加期限</el-button>
                <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<style>
.article .avatar-uploader-icon,
.article .avatar-uploader img {
  width: 378px;
}
.tips {
  display: inline-block;
  margin-left: 20px;
  color: #666;
}
.box {
  width: 80%;
}
</style>

<script>
import { baseUrl } from "@/config/env";
import { getStore } from "@/config/mUtils";
export default {
  name: "AddSurpriseTerm",
  data() {
    return {
      token: getStore("token"),
      content: "",
      startTime: "",
      endTime: "",
      ruleForm: {
        topicTaskType: "",
        topicOptType: "",
        taskSubtitle: "",
        taskRewardContent: "",
        taskAim: "",
        taskTitle: "",
        growthValue: "",
        sortOrder: "1",
        rewardType: "0",
        toolsId: ""
      },
      rules: {
        strategyTitle: [{ required: true, message: "请输入攻略标题" }],
        strategyContent: [{ required: true, message: "请输入攻略内容" }]
      },
      taskTypeOption: [{
            name: '成长任务',
            id: 0
        },{
            name: '每日任务',
            id: 1
        },{
            name: '每周任务',
            id: 2
        },{
            name: '每月任务',
            id: 3
      }],
      optTypeOption: [{
            name: '浇水',
            id: 0
        },{
            name: '能量收集',
            id: 1
        },{
            name: '推荐1人',
            id: 2
        },{
            name: '推荐5人',
            id: 3
        },{
            name: '推荐10人',
            id: 4
        },{
            name: '拼图通4关',
            id: 5
        },{
                name: '拼图通8关',
                id: 6
        },{
                name: '拼图通15关',
                id: 7
        }],
      toolOption: []
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          $.ajax({
            url: baseUrl + "promise/tree/surprise/add/term",
            type: "POST",
            dataType: "json",
            data: {
              token: this.token,
              beginTime: this.startTime,
              endTime: this.endTime
            }
          }).done(data => {
            if (data.status == 200) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              // this.$router.go(0);
              this.$router.push({ path: '/SurpriseManager' })
            } else {
              this.$message.error(data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getStartTime (date) {
        this.startTime = date;
        console.log(date)
    },
    getEndTime (date) {
        this.endTime = date;
        console.log(date)        
    }
  },
  created () {
   
  }
};
</script>