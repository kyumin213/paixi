<template>
  <section class="el-container wrapper is-vertical">
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="抽奖列表" name="first">
      
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

                    <el-form-item label="分享文案" prop="title">
                        <el-input v-model="ruleForm.title" placeholder="请输入分享文案"></el-input>
                    </el-form-item>

                    <el-form-item label="分享图片" prop="imageUrlBanner">
                    <el-upload
                        class="avatar-uploader"
                        name="uploadFile"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccessBanner"
                        :data="upLoadData">
                        <img v-if="ruleForm.imageUrlBanner" :src="ruleForm.imageUrlBanner" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">文件大小不能超过500kb</div>
                    </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>        
        </el-tab-pane>
        <el-tab-pane label="摇骰子活动助力" name="second">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="key值" prop="configKey">
                        <el-input v-model="ruleForm.configKey" placeholder="dice50"></el-input>
                    </el-form-item>

                    <el-form-item label="分享文案" prop="title2">
                        <el-input v-model="ruleForm.title2" placeholder="请输入分享文案"></el-input>
                    </el-form-item>

                    <el-form-item label="分享图片" prop="imageUrlBanner2">
                    <el-upload
                        class="avatar-uploader"
                        name="uploadFile"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccessBanner2"
                        :data="upLoadData">
                        <img v-if="ruleForm.imageUrlBanner2" :src="ruleForm.imageUrlBanner2" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">文件大小不能超过500kb</div>
                    </el-upload>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
        </el-tab-pane>
    </el-tabs>
    
  </section>
</template>
<style>
.avatar {
    width: 150px;
    height: 150px;
}
.form-contatiner{
    max-width: 600px;
    margin: 50px 0 0 50px;
}
.tips{
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
import { baseUrl } from '@/config/env'
import { baseImgPath } from '@/config/env'
import { getStore } from '@/config/mUtils'
export default {
  name: 'ActivitySharePic',
  data() {
      return {
        activeName2:'first',
        token: getStore('token'),  
        uploadUrl: baseImgPath + 'picture/oss/upload/multi',
        upLoadData: {
          token: getStore('token'),
        },
        activeTab: '0',
        ruleForm:{
          imageUrlBanner: '',
          title: '',
          configKey: '',
          imageUrlBanner2: '',
          title2: '',
          imageUrlBanner3: '',
          title3: '',
          imageUrlBanner4: '',
          title4: '',
          imageUrlBanner5: '',
          title5: '',
          imageUrlBanner6:'',
          title6:''
        },
        rules: {
            
        }
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab.index)
        this.activeTab = tab.index
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
            if (valid) {
                var chooseAnswers = JSON.stringify(this.ruleForm.chooseAnswers);
                var configKey = ''
                var configValue = ''
                var description = ''
                if (this.activeTab == 0) {
                    configKey = 'shareList'
                    configValue = this.ruleForm.imageUrlBanner
                    description = this.ruleForm.title
                } else if (this.activeTab == 1) {
                    configKey = this.ruleForm.configKey                    
                    configValue = this.ruleForm.imageUrlBanner2
                    description = this.ruleForm.title2                
                } else if (this.activeTab == 2) {
                    configKey = 'dice50'
                    configValue = this.ruleForm.imageUrlBanner3
                    description = this.ruleForm.title3               
                } else if (this.activeTab == 3) {
                    configKey = 'dice15'
                    configValue = this.ruleForm.imageUrlBanner4
                    description = this.ruleForm.title4               
                } else if (this.activeTab == 4) {
                    configKey = 'dice5'
                    configValue = this.ruleForm.imageUrlBanner5
                    description = this.ruleForm.title5               
                } else {
                    configKey = 'diceDefault'
                    configValue = this.ruleForm.imageUrlBanner6
                    description = this.ruleForm.title6
                }
                $.ajax({
                    url: baseUrl + "system/config/add",
                    type: "POST",
                    dataType: "json",
                    data: {
                        token: this.token,
                        configKey: configKey,
                        configValue: configValue,
                        description: description
                    }
                })
                .done(data => {
                if (data.status == 200) {
                    this.$message({
                        type: "success",
                        message: "添加成功"
                    });
                    this.$refs[formName].resetFields();
                } else {
                    this.$message.error(data.msg);
                }
                })
                .fail(function(data) {
                console.log(data);
                });
                return false;
            } else {
              return false;
            }
        });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    handleAvatarSuccessBanner(res, file) {
        if (res.status == 200) {
          this.ruleForm.imageUrlBanner = res.bean
        }
    },
    handleAvatarSuccessBanner2(res, file) {
        if (res.status == 200) {
          this.ruleForm.imageUrlBanner2 = res.bean
        }
    },
    handleAvatarSuccessBanner3(res, file) {
        if (res.status == 200) {
          this.ruleForm.imageUrlBanner3 = res.bean
        }
    },
    handleAvatarSuccessBanner4(res, file) {
        if (res.status == 200) {
          this.ruleForm.imageUrlBanner4 = res.bean
        }
    },
    handleAvatarSuccessBanner5(res, file) {
        if (res.status == 200) {
          this.ruleForm.imageUrlBanner5 = res.bean
        }
    },
    handleAvatarSuccessBanner6(res, file) {
        if (res.status == 200) {
          this.ruleForm.imageUrlBanner6 = res.bean
        }
    },
 },
}
</script>