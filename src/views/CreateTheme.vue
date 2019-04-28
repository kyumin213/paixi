<template>
  <section class="el-container wrapper is-vertical">
    <!-- <Header></Header> -->
    <div class="theme-container">
      <el-row>
        <el-col :span="16">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
            <el-form-item label="专题名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入专题名称（1-20字符）"></el-input>
            </el-form-item>
   
            <el-form-item label="专题描述" prop="bewrite">
              <el-input v-model="ruleForm.bewrite" placeholder="请输入专题描述"></el-input>
            </el-form-item>
                        <el-form-item label="节日名称" prop="festivalName">
              <el-input v-model="ruleForm.festivalName" placeholder="请输入节日名称"></el-input>
            </el-form-item>
            <el-form-item label="节日简介" prop="festivalBrief">
              <el-input v-model="ruleForm.festivalBrief" placeholder="请输入节日简介"></el-input>
            </el-form-item>
            <el-form-item label="节日时间" prop="festivalTime">
            <el-date-picker
      v-model="festivalTime"  
      type="datetime"
      placeholder="请选择节日时间"
      value-format="yyyy-MM-dd HH:mm:ss"
      @change="getFestTime"
      >
    </el-date-picker>
            </el-form-item>
            <el-form-item label="节目描述" prop="festivalText">
              <el-input v-model="ruleForm.festivalText" type="textarea" placeholder="请输入节目描述"></el-input>
            </el-form-item>
            <el-form-item label="专题背景" prop="background">
               <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessBackground"
                  :data="uploadBackground">
                  <img v-if="ruleForm.background" :src="ruleForm.background" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="节目科普背景" prop="festivalBanner">
              <!-- <el-input v-model="ruleForm.festivalBanner" placeholder="请选择节目科普背景"></el-input> -->
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessFestival"
                  :data="uploadFestBanner">
                  <img v-if="ruleForm.festivalBanner" :src="ruleForm.festivalBanner" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>

            <el-form-item label="专题上架时间">
              <el-date-picker
									v-model="startTime"
									type="datetime"
									@change="getStartTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择专题上架时间">
								</el-date-picker>
            </el-form-item>

            <el-form-item label="专题下架时间">
              <el-date-picker
									v-model="endTime"
									type="datetime"
									@change="getEndTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择专题下架时间">
								</el-date-picker>
            </el-form-item>

            <el-form-item label="是否为秒杀活动">
              <el-radio-group v-model="ruleForm.category">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="专题排序" prop="sortOrder">
              <el-input-number v-model="ruleForm.sortOrder" controls-position="right" @change="handleChange" :min="1"></el-input-number>
              <div class="tips">1为优先级别最高</div>
            </el-form-item>
            <el-form-item label="封面图片" prop="imageUrlCover">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="upLoadData">
                  <img v-if="ruleForm.imageUrlCover" :src="ruleForm.imageUrlCover" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <!-- <el-form-item label="banner图片" prop="imageUrlBanner">
              <el-upload
                  class="avatar-uploader"
                  name="uploadFile"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessBanner"
                  :data="upLoadData">
                  <img v-if="ruleForm.imageUrlBanner" :src="ruleForm.imageUrlBanner" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import { baseUrl } from "@/config/env";
import { baseImgPath } from "@/config/env";
import { getStore } from "@/config/mUtils";
export default {
  name: "CreateTheme",
  data() {
    return {
      token: getStore("token"),
      uploadUrl: baseImgPath + "picture/oss/upload/multi",
      upLoadData: {
        token: getStore("token")
        // fileName: 'http://image.prise.shop/images/2018/04/03/1522736335352510.png'
      },
      uploadBackground: {
        token: getStore("token")
      },
      uploadFestBanner: {
        token: getStore("token")
      },
      startTime: "",
      endTime: "",
      festivalTime: "",
      list: [],
      ruleForm: {
        name: "",
        sortOrder: 1,
        imageUrlCover: "",
        imageUrlBanner: "",
        bewrite: "",
        category: "0",
        festivalName: "",
        festivalBrief: "",
        festivalText: "",
        background: "",
        festivalBanner: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入专题名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        bewrite: [{ required: true, message: "请输入专题描述" }],
        sortOrder: [{ required: true, trigger: "change" }],
        festivalBanner: [{ required: true }],
        background: [{ required: true }],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        festivalName: [
          { required: true, message: "请输入界面名称", trigger: "change" }
        ],
        festivalBrief: [
          { required: true, message: "请输入节目简介", trigger: "change" }
        ],
        festivalText: [
          { required: true, message: "请输入节目描述", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    getStartTime(date) {
      this.startTime = date;
      console.log(date);
    },
    getEndTime(date) {
      this.endTime = date;
      console.log(date);
    },
    getFestTime(date) {
      this.festivalTime = date;
      console.log(date);
    },
    submitForm(formName) {
      console.log(this.festivalTime);
      this.$refs[formName].validate(valid => {
        if (valid) {
          var _this = this;
          $.ajax({
            url: baseUrl + "product/special/add",
            type: "POST",
            dataType: "json",
            data: {
              token: this.token,
              name: this.ruleForm.name,
              pictureCover: this.ruleForm.imageUrlCover,
              pictureBanner:
                "https://image.prise.shop/images/2018/06/27/1530087052454036.jpg",
              sortOrder: this.ruleForm.sortOrder,
              bewrite: this.ruleForm.bewrite,
              category: this.ruleForm.category,
              beginTime: this.startTime,
              endTime: this.endTime,
              festivalName: this.ruleForm.festivalName,
              festivalBrief: this.ruleForm.festivalBrief,
              festivalTime: this.festivalTime,
              festivalText: this.ruleForm.festivalText,
              festivalBanner: this.ruleForm.festivalBanner,
              background: this.ruleForm.background
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "创建专题成功"
                });
                // this.$router.go(0)
                this.$router.push({ path: "/themeList" });
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
    handleChange(value) {
      console.log(value);
    },
    handleAvatarSuccess(res, file) {
      if (res.status == 200) {
        this.ruleForm.imageUrlCover = res.bean;
      }
      // this.ruleForm.imageUrlCover = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccessBanner(res, file) {
      if (res.status == 200) {
        this.ruleForm.imageUrlBanner = res.bean;
      }
      // this.ruleForm.imageUrlBanner = URL.createObjectURL(file.raw);
    },
    // 节目背景
    handleAvatarSuccessBackground(res, file) {
      if (res.status == 200) {
        this.ruleForm.background = res.bean;
      }
      // this.ruleForm.imageUrlCover = URL.createObjectURL(file.raw);
    },
    // 节目科普背景
    handleAvatarSuccessFestival(res, file) {
      if (res.status == 200) {
        this.ruleForm.festivalBanner = res.bean;
      }
      // this.ruleForm.imageUrlCover = URL.createObjectURL(file.raw);
    }
  }
};
</script>
<style>
.tips {
  display: inline-block;
  margin-left: 15px;
  color: #b3b3b3;
}
.theme-container {
  margin-top: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
</style>
