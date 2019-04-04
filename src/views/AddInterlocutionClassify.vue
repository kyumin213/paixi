<template>
  <section class="el-container wrapper is-vertical">
    <div class="form-contatiner">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

            <el-form-item label="分类名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>

            <el-form-item label="排序" prop="classifySort">
                <el-input-number v-model="ruleForm.classifySort" controls-position="right" :min="1"></el-input-number>
                <div class="tips">1为优先级别最高</div>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">添加分类</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </section>
</template>

<style>
.form-contatiner {
  max-width: 600px;
  margin: 50px 0 0 50px;
}
.tips {
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
import { baseUrl } from "@/config/env";
import { getStore } from "@/config/mUtils";
export default {
  name: "AddInterlocutionClassify",
  data() {
    return {
      token: getStore("token"),
      ruleForm: {
        name: "",
        classifySort: 1
      },

      rules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { trigger: "blur" }
        ],
        classifySort: [{ required: true }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            $.ajax({
              url: baseUrl+'major/interlocution/add/classify',
              type: 'POST',
              dataType: 'json',
              data: {
                token: this.token,
                name: this.ruleForm.name,
                classifySort: this.ruleForm.classifySort
              }
            })
            .done((data) => {
              console.log(data)
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "添加分类成功"
                })

              } else {
                this.$message.error(data.msg)
              }
            })
             .fail(function (data) {
              console.log(data)
            })
            return false
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

