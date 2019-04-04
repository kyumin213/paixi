<template>
  <section class="el-container wrapper is-vertical">
    <div class="theme-container article">
      <el-row>
        <el-col :span="10">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="220px" class="demo-ruleForm">           

            <el-form-item label="红包最低金额（精确到0.01元）" prop="surprisePriceMin">
                <el-input v-model="ruleForm.surprisePriceMin"></el-input>
            </el-form-item>

            <el-form-item label="红包最高金额（精确到0.01元）" prop="surprisePriceMax">
                <el-input v-model="ruleForm.surprisePriceMax"></el-input>
            </el-form-item>

            <el-form-item label="红包数量" prop="surpriseStock">
                <el-input v-model="ruleForm.surpriseStock"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存修改</el-button>
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
  name: "EditSurprise",
  data() {
    return {
      token: getStore("token"),
      content: "",
      id: this.$route.params.id,
      startTime: "",
      endTime: "",
      ruleForm: {
        surprisePriceMin: "",
        surprisePriceMax: "",
        surpriseStock: ""
      },
      rules: {}
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          $.ajax({
            url: baseUrl + "promise/tree/surprise/update",
            type: "POST",
            dataType: "json",
            data: {
              token: this.token,
              surprisePriceMax: this.ruleForm.surprisePriceMax,
              surprisePriceMin: this.ruleForm.surprisePriceMin,
              surpriseStock: this.ruleForm.surpriseStock,
              termId: this.ruleForm.termId,
              id: this.id
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
    getData() {
        $.get(baseUrl + 'promise/tree/surprise/get', {token: this.token, id: this.id}, (data) => {
            if (data.status == 200) {
                this.ruleForm = data.bean
            }
        })
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'SurpriseList') {
        this.id = to.params.id
        this.getData();
      }
    }
  },
  created () {
   this.getData()
  }
};
</script>