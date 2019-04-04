<template>
  <section class="el-container wrapper is-vertical">
    <div class="theme-container article">
      <el-row>
        <el-col :span="22">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="任务类型">
                <el-select v-model="ruleForm.topicTaskType" placeholder="请选择任务类型">
                  <el-option
                    filterable 
                    v-for="item in taskTypeOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="操作类型" prop="topicOptType">
                <el-select v-model="ruleForm.topicOptType" placeholder="请选择操作类型">
                  <el-option
                    filterable 
                    v-for="item in optTypeOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="奖励类型">
               <el-radio-group v-model="ruleForm.rewardType">
                  <el-radio label="0">能量奖励</el-radio>
                  <el-radio label="1">道具奖励</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="道具类型" v-if="ruleForm.rewardType == 1">
               <el-select v-model="ruleForm.toolsId" placeholder="请选择道具类型">
                  <el-option
                    filterable 
                    v-for="item in toolOption"
                    :key="item.id"
                    :label="item.toolTitle"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="任务标题" prop="taskTitle">
                <el-input v-model="ruleForm.taskTitle"></el-input>
            </el-form-item>

            <el-form-item label="任务子标题" prop="taskSubtitle">
                <el-input v-model="ruleForm.taskSubtitle"></el-input>
            </el-form-item>

            <el-form-item label="任务奖励内容" prop="taskRewardContent">
                <el-input v-model="ruleForm.taskRewardContent"></el-input>
            </el-form-item>

            <el-form-item label="任务目标数" prop="taskAim">
                <el-input v-model="ruleForm.taskAim"></el-input>
            </el-form-item>

            <el-form-item label="任务收获成长值" prop="growthValue">
                <el-input v-model="ruleForm.growthValue"></el-input>
            </el-form-item>

            <el-form-item label="任务排序:" prop="sortOrder">
              <el-input-number v-model="ruleForm.sortOrder" controls-position="right" :min="1"></el-input-number>
              <div class="tips">1为优先级别最高</div>
            </el-form-item>
            
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
  name: "EditTask",
  data() {
    return {
      token: getStore("token"),
      content: "",
      id: this.$route.params.id,
      ruleForm: {
        topicTaskType: "",
        topicOptType: "",
        taskSubtitle: "",
        taskRewardContent: "",
        taskAim: "",
        taskTitle: "",
        growthValue: "",
        sortOrder: "1"
      },
      toolOption: [],
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
      },{
            name: '拼图通1关',
            id: 8
      }]
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          $.ajax({
            url: baseUrl + "promise/tree/task/update",
            type: "POST",
            dataType: "json",
            data: {
              topicTaskType: this.ruleForm.topicTaskType,
              topicOptType: this.ruleForm.topicOptType,
              taskTitle: this.ruleForm.taskTitle,
              taskSubtitle: this.ruleForm.taskSubtitle,
              taskRewardContent: this.ruleForm.taskRewardContent,
              taskAim: this.ruleForm.taskAim,
              growthValue: this.ruleForm.growthValue,
              token: this.token,
              sortOrder: this.ruleForm.sortOrder,
              id: this.id,
              rewardType: this.ruleForm.rewardType,
              toolsId: this.ruleForm.toolsId
            }
          }).done(data => {
            if (data.status == 200) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              // this.$router.go(0);
              this.$router.push({ path: '/TaskList' })
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
    getData () {
      jQuery.get(baseUrl + 'promise/tree/task/get', {token: this.token, id: this.id},(data) => {
        this.ruleForm = data.bean
        this.ruleForm.rewardType = this.ruleForm.rewardType.toString()
      })
    },
    getToolType () {
      $.get(baseUrl + 'promise/tree/tools/get/catalog', {token: this.token}, (res) => {
        if (res.status == 200) {
          this.toolOption = res.bean
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'TaskList') {
        this.id = to.params.id
        this.getData();
      }
    }
  },
  created () {
    this.getData()
    this.getToolType()
  }
};
</script>