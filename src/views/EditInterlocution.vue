<template>
    <section class="el-container wrapper is-vertical">
        <div class="form-contatiner">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" >
                   <el-form-item label="关联的分类" prop="classifyId">
                      <el-select v-model="ruleForm.classifyId" placeholder="请选择关联的分类">
                        <el-option
                          filterable 
                          v-for="item in ruleForm.specialOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="题目:" prop="problems">
                        <el-input v-model="ruleForm.problems"></el-input>
                    </el-form-item>

                    <el-form-item :label="'答案选项:'" prop="chooseAnswers" class="box" >
                    <div v-for="(item, index) in ruleForm.chooseAnswers" :key="index">
                        <el-input v-model="item.choose" placeholder="请输入选项，比如‘A’"  class="info-box"></el-input>
                        <el-input v-model="item.chooseValue" placeholder="请输入选项答案"  class="info-box"></el-input>
                        <el-button @click.prevent="removeChoose(item)">删除</el-button>
                    </div>
                    <i class="el-icon-plus addBtn"  @click="addInfo"></i>
                </el-form-item>

                <el-form-item label="答案:" placeholder="请输入正确答案" prop="answer">
                        <el-input v-model="ruleForm.answer"></el-input>
                </el-form-item>

                <el-form-item>
                     <el-button type="success" @click="submitForm('ruleForm')">更新题目</el-button>
                </el-form-item>
            </el-form>
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
  name: "EditInterlocution",
  data() {
    return {
      token: getStore("token"),
      id: this.$route.params.id,
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
        classifyId: ""
      },

      rules: {
        problems: [
          { required: true, message: "请输入题目", trigger: "blur" },
          { trigger: "blur" }
        ],
        answer: [
          { required: true, message: "请输入答案", trigger: "blur" },
          { trigger: "blur" }
        ],
        chooseAnswers: [{ required: true, message: "请输入答案选项" }]
      }
    };
  },

  methods: {
    addInfo() {
      this.ruleForm.chooseAnswers.push({
        choose: "",
        chooseValue: ""
      });
      console.log(this.ruleForm.chooseAnswers);
    },

    removeChoose(item) {
      var index = this.ruleForm.chooseAnswers.indexOf(item);
      if (index !== -1) {
        this.ruleForm.chooseAnswers.splice(index, 1);
      }
    },
    getEditInterlocutionById() {
      console.log(this.id);
      $.get(
        baseUrl + "major/interlocution/select/by/id",
        { token: this.token, id: this.id },
        data => {
          if (data.status == 200) {
            this.ruleForm.problems = data.bean.problems;
            this.ruleForm.chooseAnswers = JSON.parse(data.bean.chooseAnswers);
            this.ruleForm.answer = data.bean.answer;
            this.ruleForm.classifyId = data.bean.classify;
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var stringChoose = JSON.stringify(this.ruleForm.chooseAnswers);
          $.ajax({
            url: baseUrl + "major/interlocution/update",
            type: "POST",
            dataType: "json",
            data: {
              token: this.token,
              id: this.id,
              problems: this.ruleForm.problems,
              chooseAnswers: stringChoose,
              answer: this.ruleForm.answer,
              classify: this.ruleForm.classifyId
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "更新成功"
                });
                this.$router.push({path: '/InterlocutionList'})
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
    getSpecial() {
      $.get(
        baseUrl + "major/interlocution/select/all/classify",
        { token: this.token },
        data => {
          if (data.status == 200) {
            this.ruleForm.specialOptions = data.bean;
            console.log(this.ruleForm.specialOptions);
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'InterlocutionList') {
        this.id = to.params.id
        this.getEditInterlocutionById();
      }
    }
  },
  created() {
    this.getSpecial();
    this.getEditInterlocutionById();
  }
};
</script>

