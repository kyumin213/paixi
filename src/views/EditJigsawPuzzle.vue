<template>
  <section class="el-container wrapper is-vertical">
    <div class="form-contatiner">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

            <el-form-item label="图片名称" prop="picName">
                <el-input v-model="ruleForm.picName"></el-input>
            </el-form-item>

            <el-form-item label="图片描述" prop="imageDetails">
                <el-input v-model="ruleForm.imageDetails"></el-input>
            </el-form-item>

             <el-form-item label="关联的分类" prop="classifyId">
                <el-select v-model="ruleForm.classifyId" placeholder="请选择关联的分类">
                  <el-option
                    filterable 
                    v-for="item in ruleForm.specialOptions"
                    :key="item.id"
                    :label="item.classifyName"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="上传拼图">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="upLoadData">
                  <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>

            <el-form-item label="排序" prop="sortOrders">
                <el-input-number v-model="ruleForm.sortOrders" controls-position="right" :min="1"></el-input-number>
                <div class="tips">1为优先级别最高</div>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">更新图片</el-button>
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
import { baseImgPath } from "@/config/env";
import { getStore } from "@/config/mUtils";
export default {
  name: "AddJigsawPuzzle",
  data() {
    return {
      token: getStore("token"),
      id: this.$route.params.id,
      uploadUrl: baseImgPath + 'picture/oss/upload/multi',
      upLoadData: {
        token: getStore("token")
      },
      ruleForm: {
        picName: "",
        imageDetails: "",
        sortOrders: 1,
        imageUrl: "",
        specialOptions: [],
        classifyId:""
      },

      rules: {
        picName: [
          { required: true, message: "请输入拼图名称", trigger: "blur" },
          { trigger: "blur" }
        ],
        sortClassify: [{ required: true }]
      }
    };
  },
  methods: {
    getSpecial() {
      $.get(
        baseUrl + "major/jigsaw/select/jigsaw/all",
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
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          $.ajax({
            url: baseUrl + "major/jigsaw/modify",
            type: "POST",
            dataType: "json",
            data: {
              id: this.id,
              token: this.token,
              name: this.ruleForm.picName,
              sortOrders: this.ruleForm.sortOrders,
              imageUrl: this.ruleForm.imageUrl,
              difficulty: "",
              imageDetails: this.ruleForm.imageDetails,
              classifyId: this.ruleForm.classifyId
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "添加图片成功"
                });
                // this.$router.go(0);
                this.$router.push({ path: "/JigsawPuzzleList" });
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
    handleAvatarSuccess(res, file) {
      if (res.status == 200) {
        this.ruleForm.imageUrl = res.bean;
      }
    },

    getJigsawData() {
      $.get(
        baseUrl + "major/jigsaw/get/jigsaw/by/id",
        { token: this.token, id: this.id },
        data => {
          if (data.status == 200) {
            this.ruleForm.picName = data.bean.name;
            this.ruleForm.sortOrders = data.bean.sortOrders;
            this.ruleForm.imageUrl = data.bean.imageUrl;
            this.ruleForm.difficulty = data.bean.difficulty;
            this.ruleForm.imageDetails = data.bean.imageDetails;
            this.ruleForm.classifyId = data.bean.classifyId;
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.path === '/JigsawPuzzleList') {
        this.id = to.params.id
        this.getJigsawData();
      }
    }
  },
  created() {
    this.getJigsawData();
    this.getSpecial();
  }
};
</script>
