<template>
    <section class="el-container wrapper is-vertical">
            <el-row style="height:100%;">
                <el-col :span="10">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" >
                        <el-form-item label="选择优惠券：" class="box" prop="couponId">
                            <el-select v-model="ruleForm.couponId" placeholder="请选择优惠券" @change="getCoupon">
                                <el-option
                                filterable 
                                v-for="item in ruleForm.couponOption"
                                :key="item.id"
                                :label="item.couponName"
                                :value="item.id">
                                </el-option>
                            </el-select>
                             <div class="coupon-num">剩余优惠券数量：{{ ruleForm.couponNum }}</div>
                        </el-form-item>
                        <el-form-item label="用户编号：">
                            <el-input v-model="ruleForm.userId"  placeholder="选填 用户编号与手机号选填其一"></el-input>
                        </el-form-item>
                        <el-form-item label="用户手机号：">
                            <el-input v-model="ruleForm.phone"  placeholder="选填 用户编号与手机号选填其一"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="submitForm('ruleForm')">确认发放</el-button>
                            <span class="tips">*此发放操作不可逆，请确认完成再发放！</span>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
    </section>
</template>

<style>
.el-input {
  display: inline-block;
}
.box {
  width: 100%;
  margin-top: 10px;
}
.tips {
  color: red;
}
.coupon-num {
  margin-left: 20px;
  display: inline;
}
</style>
<script>
import { baseUrl } from "@/config/env";
import { getStore } from "@/config/mUtils";
export default {
  name: 'PersonalCoupon',
  data() {
    return {
      token: getStore("token"),
      ruleForm: {
        couponOption: [],
        userId: '',
        couponNum: null,
        phone: ''
      },
      rules: {
        userId: [
          { required: true, message: "请输入ID", trigger: "blur" },
          { trigger: "blur" }
        ],
        couponId: [
          { required: true, message: "请选择优惠券"}
        ],
      }
    };
  },
  methods: {
    getCoupon (val) {
      for (var i in this.ruleForm.couponOption) {
        if (this.ruleForm.couponOption[i].id == val) {
          this.ruleForm.couponNum = this.ruleForm.couponOption[i].couponNum
        }
      }
    },
    // 查询优惠券
    getCoupondetail () {
      $.get(baseUrl + 'coupon/select/one/by/id', {token: this.token, id: this.ruleForm.couponId}, (data) => {
        if ( data.status == 200) {
            this.ruleForm.couponNum = data.bean.couponNum
        } else {
            alert(data.msg)
        }
      })
    },
    // 获取优惠券列表
    getPersonalCoupon() {
        $.get(baseUrl + 'coupon/user/get', {token: this.token}, (data) => {
            if ( data.status == 200) {
               this.ruleForm.couponOption = data.bean
            } else {
                alert(data.msg)
            }
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          $.ajax({
            url: baseUrl + "coupon/user/add",
            type: "POST",
            dataType: "json",
            data: {
              token: this.token,
              couponId: this.ruleForm.couponId,
              userId: this.ruleForm.userId,
              phone: this.ruleForm.phone
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "发放成功"
                });
                this.getCoupondetail()
                // this.$router.go(0);
                // this.$router.push({ path: "/CouponList" });
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
    }
  },
  created () {
      this.getPersonalCoupon()
  }
};
</script>