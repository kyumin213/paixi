<template>
    <section class="el-container wrapper is-vertical">
        <div class="form-contatiner">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" >

                    <el-form-item label="优惠券名称:" prop="couponName">
                        <el-input v-model="ruleForm.couponName"></el-input>
                    </el-form-item>

                    <el-form-item label="是否对所有用户开放">
                      <el-radio-group v-model="ruleForm.communal">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item label="优惠券满足金额:" prop="fullPrice" class="box" >
                          <el-input v-model="ruleForm.fullPrice" placeholder="请输入满足金额"  class="info-box"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券满足类型:" prop="fullType" class="box" >
                            <el-select v-model="ruleForm.fullType" placeholder="请选择优惠券类型">
                              <el-option
                                filterable 
                                v-for="item in ruleForm.ticketType"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                    </el-form-item>

                <el-form-item label="满减金额" placeholder="请输入满减金额" prop="reducePrice">
                        <el-input v-model="ruleForm.reducePrice"></el-input>
                </el-form-item>

                <el-form-item label="优惠券使用类别" prop="classify">
                  <el-select v-model="ruleForm.classify" placeholder="请选择优惠券使用类别">
                    <el-option
                      filterable 
                      v-for="item in ruleForm.useType"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item   v-show="ruleForm.classify==3" label="关联商品ID" placeholder="请输入关联商品ID">
                        <el-input v-model="ruleForm.relationId"></el-input>
                </el-form-item>

                <el-form-item label="优惠券数量" placeholder="请输入优惠券数量" prop="couponNum">
                        <el-input v-model="ruleForm.couponNum"></el-input>
                </el-form-item>

                <el-form-item label="优惠券有效期">
                     <!-- 按日期搜索 -->
                    <el-date-picker
                        v-model="ruleForm.valueDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                     <el-button type="success" @click="submitForm('ruleForm')">添加优惠券</el-button>
                     <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
               
            </el-form>
        </div>
    </section>
</template>

<style>
.box {
  width: 100%;
  margin-top: 10px;
}

.tips {
  color: red;
}
</style>


<script>
import { baseUrl } from "@/config/env";
import { getStore } from "@/config/mUtils";

export default {
  data() {
    return {
      token: getStore("token"),
      ruleForm: {
        couponName: "",
        communal: '1',
        fullPrice: "",
        fullType: "",
        useType: [
          {
            name: "通用使用",
            id: "1"
          },
          {
            name: "关联吐槽使用",
            id: "2"
          },
          {
            name: "关联商品使用",
            id: "3"
          }
        ],
        ticketType: [
          {
            name: "下单立减",
            id: "1"
          },
          {
            name: "满减使用",
            id: "2"
          },
          {
            name: "满量则减",
            id: "3"
          }
        ],
        reducePrice: "",
        classify: "",
        relationId: "",
        couponNum: "",
        startDate: "",
        valueDate: [],
        endDate: ""
      },

      rules: {
        problems: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
          { trigger: "blur" }
        ],
        reducePrice: [
          { required: true, message: "请输入优惠券满减金额", trigger: "blur" },
          { trigger: "blur" }
        ],
        relationId: [
          { required: true, message: "请输入优惠券满减金额", trigger: "blur" },
          { trigger: "blur" }
        ],
        classify: [{ trigger: "change" }],
        couponNum: [
          { required: true, message: "请输入优惠券数量", trigger: "blur" },
          { trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log(this.ruleForm.fullType);
        if (valid) {
          var fullCondition = JSON.stringify(this.ruleForm.fullCondition);
          console.log(null == this.ruleForm.relationId);
          if (this.ruleForm.classify == 3 && "" == this.ruleForm.relationId) {
            this.$message.error("商品ID为空");
            return;
          }
          $.ajax({
            url: baseUrl + "major/coupon/add",
            type: "POST",
            dataType: "json",
            data: {
              token: this.token,
              couponName: this.ruleForm.couponName,
              fullPrice: this.ruleForm.fullPrice,
              fullType:this.ruleForm.fullType,
              reducePrice: this.ruleForm.reducePrice,
              classify: this.ruleForm.classify,
              relationId: this.ruleForm.relationId,
              couponNum: this.ruleForm.couponNum,
              startDate: this.ruleForm.valueDate[0],
              endDate: this.ruleForm.valueDate[1],
              communal: this.ruleForm.communal
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.$router.go(0);
                this.$router.push({ path: "/CouponList" });
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
  }
};
</script>

