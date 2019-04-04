<template>
  <section class="el-container wrapper is-vertical">
      <el-row>
          <el-col :span="12">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <el-form-item label="礼物类别">
                    <el-select v-model="ruleForm.promiseType" placeholder="请选择礼物类型">
                      <el-option
                        filterable 
                        v-for="item in giftsType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="礼物名称" prop="giftTitle">
                    <el-input v-model="ruleForm.giftTitle"></el-input>
                </el-form-item>

                <el-form-item label="礼物图片" prop="giftPictureCover">
                <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    name="uploadFile"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :data="upLoadData">
                    <img v-if="ruleForm.giftPictureCover" :src="ruleForm.giftPictureCover" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
                </el-form-item>

                <el-form-item label="售价/红包金额" prop="giftPrice">
                    <el-input v-model="ruleForm.giftPrice"></el-input>
                </el-form-item>

                <el-form-item label="礼物库存" prop="giftStock">
                    <el-input v-model="ruleForm.giftStock"></el-input>
                </el-form-item>

                <el-form-item label="成熟值" prop="growthValue">
                    <el-input v-model="ruleForm.growthValue"></el-input>
                </el-form-item>

                <el-form-item label="设为愿望" prop="maxValues">
                <el-radio-group v-model="ruleForm.promiseStatus">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                </el-radio-group>
                </el-form-item>

                <el-form-item label="愿望排序" prop="sortOrder">
                    <el-input-number v-model="ruleForm.sortOrder" controls-position="right" :min="1"></el-input-number>
                    <div class="tips">1为优先级别最高</div>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">添加礼物</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
          </el-col>
      </el-row>
  </section>
</template>
<style>
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
  name: 'AddGifts',
  data() {
      return {
        token: getStore('token'),  
        giftsType: [{
          name: '实物礼品',
          id: '0'
        },{
          name: '虚拟礼品',
          id: '1'
        },
        // {
        //   name: '购物券',
        //   id: '2'
        // }
        ],
        isShowSecond: false,
        uploadUrl: baseImgPath + 'picture/oss/upload/multi',
        upLoadData: {
          token: getStore('token'),
          // fileName: 'http://image.prise.shop/images/2018/04/03/1522736335352510.png'
        },
        ruleForm: {
          giftTitle: '',
          promiseStatus: '1',
          giftStock: null,
          giftPictureCover: '',
          sortOrder: 1,
          growthValue: '',
          promiseType: '0',
          giftPrice: ''
        },
        rules: {
          giftTitle: [
            { required: true, message: '请输入标签名称', trigger: 'blur' },
            { trigger: 'blur' }
          ],
          sortOrder: [
            { required: true }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            $.ajax({
              url: baseUrl+'promise/add',
              type: 'POST',
              dataType: 'json',
              data: {
                token: this.token,
                giftTitle: this.ruleForm.giftTitle,
                giftStock: this.ruleForm.giftStock,
                growthValue: this.ruleForm.growthValue,
                giftPictureCover: this.ruleForm.giftPictureCover,
                promiseStatus: this.ruleForm.promiseStatus,
                sortOrder: this.ruleForm.sortOrder,
                giftPrice: this.ruleForm.giftPrice,
                promiseType: this.ruleForm.promiseType
              }
            })
            .done((data) => {
              console.log(data)
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "添加礼物成功"
                })
                this.$router.push({ path:'/GiftsList'})
              } else {
                this.$message.error(data.msg)
                // console.log('mmm')
              }
            })
            .fail(function (data) {
              console.log(data)
            })
            return false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleAvatarSuccess(res, file) {
        if (res.status == 200) {
          this.ruleForm.giftPictureCover = res.bean
        }
      }
    },
    created () {
      
    }
}
</script>