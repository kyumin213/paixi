<template>
  <section class="el-container wrapper is-vertical">
      <el-row class="card">
          <el-col :span="12">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

                <el-form-item label="主题" prop="themeCard">
                    <el-input v-model="ruleForm.themeCard" maxlength="8"></el-input>
                </el-form-item>

                 <el-form-item label="是否限制兑换" prop="cardLimit ">
                    <el-radio-group v-model="ruleForm.cardLimit ">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="兑换次数" v-if="ruleForm.cardLimit == 1">
                    <el-input type="number" min="0" v-model="ruleForm.limitNumber"></el-input>
                </el-form-item>

                <el-form-item label="卡片额度" prop="cardMoney">
                    <el-input v-model="ruleForm.cardMoney" type="number" min="1"></el-input>
                </el-form-item>

                <el-form-item label="卡片数量" prop="cardNumber ">
                    <el-input type="number" v-model="ruleForm.cardNumber " min="1" max="10000"></el-input>
                </el-form-item>

                <el-form-item label="卡片有效期" prop="endDay">
                    <el-input type="number" v-model="ruleForm.endDay" min="1"  style="display:inline-block"></el-input> 天
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">生成卡片</el-button>
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
.card .el-input {
    width: auto;
}
</style>
<script>
import { baseUrl } from '@/config/env'
import { baseImgPath } from '@/config/env'
import { getStore } from '@/config/mUtils'
export default {
  name: 'AddGiftCard',
  data() {
      return {
        token: getStore('token'),  
        isShowSecond: false,
        uploadUrl: baseImgPath + 'picture/oss/upload/multi',
        upLoadData: {
          token: getStore('token'),
          // fileName: 'http://image.prise.shop/images/2018/04/03/1522736335352510.png'
        },
        ruleForm: {
          themeCard: '',
          cardLimit: '0',
          giftPrice: '',
          limitNumber: 0,
          cardMoney: null,
          cardNumber: null,
          endDay: null
        },
        rules: {
          themeCard: [
            { required: true, message: '请输入卡片主题', trigger: 'blur' },
            { trigger: 'blur' }
          ],
          cardMoney: [
            { required: true, message: '请输入卡片金额', trigger: 'blur' }
          ],
          cardNumber: [
            { required: true, message: '请输入卡片数量', trigger: 'blur' }
          ],
          endDay: [
            { required: true, message: '请输入卡片有效期', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            $.ajax({
              url: baseUrl+'user/cardbatch/add',
              type: 'POST',
              dataType: 'json',
              data: {
                token: this.token,
                themeCard: this.ruleForm.themeCard,
                cardMoney: this.ruleForm.cardMoney,
                cardLimit: this.ruleForm.cardLimit,
                limitNumber: this.ruleForm.limitNumber,
                cardNumber: this.ruleForm.cardNumber,
                endDay: this.ruleForm.endDay
              }
            })
            .done((data) => {
              console.log(data)
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "生成卡片成功"
                })
                // this.$router.go(0)
                this.$router.push({ path:'/GiftCardList'})
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