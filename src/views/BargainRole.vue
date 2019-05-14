<template>
      <div>
       <div class="block">
        <el-row>
          <el-button type="primary" class="addBtns"  @click="addInfoModel()">添加活动规则</el-button>
        </el-row>
      </div>
    <div>
        <el-table :data="bargainInfoData" border style="width: 100%">
          <el-table-column prop="id" label="id" align="center"></el-table-column>
          <el-table-column prop="ruleName" label="名称" align="center"></el-table-column>
          <el-table-column prop="isQuota" label="是否开启限购" align="center" :formatter="isQuota"></el-table-column>
          <el-table-column prop="quotaNumber" label="限购数量" align="center" width="100"></el-table-column>
          <el-table-column prop="helpCrowd" label="助力人群" align="center" :formatter="help"></el-table-column>
          <el-table-column prop="limited" label="限时数量" align="center"  width="100"></el-table-column>
          <el-table-column prop="payLimit" label="支付时限" align="center"  width="100"></el-table-column>
          <el-table-column prop="isHelpReward" label="开启助力奖励" align="center" :formatter="isHelpReward"></el-table-column>
          <el-table-column prop="rewardType" label="奖励方式" align="center" :formatter="rewardTypeTxt"></el-table-column>
          <el-table-column prop="created" label="创建时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <!-- <el-button size="small" type="danger" @click="handleDele(scope.$index, scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 增加修改弹窗 -->
        <el-dialog :title="dailogTitleType" :visible.sync="addVisible" :close-on-click-modal="false" :before-close="cancelBargain" width="30%">
                <el-form :model="bargainForm" :rules="rules" ref="bargainForm" label-width="130px" class="demo-forms">
            <el-form-item label="活动名称" prop="ruleName">
                <el-input v-model="bargainForm.ruleName" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="限购数量" prop="quotaNumber">
                <el-input v-model="bargainForm.quotaNumber" placeholder="限购数量"></el-input>
            </el-form-item>
            <el-form-item label="是否开启限购" prop="isQuota">
                <el-radio-group v-model="bargainForm.isQuota">
                   <el-radio-button :label="0">不限购</el-radio-button>
                   <el-radio-button :label="1">限购</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="助力人群" prop="helpCrowd">
                <el-radio-group v-model="bargainForm.helpCrowd">
                   <el-radio-button :label="0">所有用户</el-radio-button>
                   <el-radio-button :label="1">新授权用户</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否开启助力奖励" prop="isHelpReward">
                <el-radio-group v-model="bargainForm.isHelpReward">
                   <el-radio-button :label="0">不开启</el-radio-button>
                   <el-radio-button :label="1">开启</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="奖励方式" prop="rewardType">
                 <el-radio-group v-model="bargainForm.rewardType">
                   <el-radio-button :label="0">助力砍价值</el-radio-button>
                   <el-radio-button :label="1">固定值</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="限时数量" prop="limited">
                <el-input v-model="bargainForm.limited" placeholder="限时数量">
                     <template slot="append">小时</template>
                </el-input>
            </el-form-item>
            <el-form-item label="支付时限" prop="payLimit">
                <el-input v-model="bargainForm.payLimit" placeholder="支付时限">
                    <template slot="append">小时</template>
                </el-input>
                 
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFormEdit('bargainForm')" v-if="editVisible">确定1</el-button>
                <el-button type="primary" @click="submitForm('bargainForm')" v-else>确定2</el-button>
                <el-button @click="cancelBargain()">取消</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { baseUrl } from "@/config/env";
import { baseImgPath } from "@/config/env";
import { getStore } from "@/config/mUtils";
export default {
  name: "BargainRole",
  data() {
    return {
      token: getStore("token"),
      upLoadData: {
        token: getStore("token")
      },
      uploadUrl: baseImgPath + "picture/oss/upload/multi",
      bargainInfoData: [],
      deleteVisible: false,
      addVisible: false,
      editVisible: false,
      dailogTitleType: "新增",
      bargainForm: {
        id: "",
        ruleName: "",
        isQuota: "0",
        quotaNumber: "",
        helpCrowd: "0",
        limited: "",
        payLimit: "",
        isHelpReward: "0",
        rewardType: "0"
      },
      rules: {
        ruleName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
          //   { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        quotaNumber: [
          { required: true, message: "请输入限购数量", trigger: "blur" }
        ],
        limited: [
          { required: true, message: "请输入限时数量", trigger: "blur" }
        ],
        payLimit: [
          { required: true, message: "请输入支付时限", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    let _this = this;
    _this.getAllRole();
  },
  methods: {
    //   获取全部活动
    getAllRole() {
      let _this = this;
      $.get(
        baseUrl + "/bargain/rule/get/all",
        { token: _this.token, pageBegin: 1, pageSize: 10 },
        data => {
          if (data.status == 200) {
            _this.bargainInfoData = data.bean;
          } else {
            _this.message.error(data.msg);
          }
        }
      );
    },
    // 是否限购转文字
    isQuota(val) {
      if (val.isQuota === "0") {
        return "不限购";
      } else if (val.isQuota === "1") {
        return "限购";
      }
    },
    // 助力人群转文字
    help(val) {
      if (val.helpCrowd === "0") {
        return "所有用户";
      } else if (val.helpCrowd === "1") {
        return "新授权用户";
      }
    },
    // 是否开启奖励
    isHelpReward(val) {
      if (val.isHelpReward === "0") {
        return "不开启";
      } else if (val.isHelpReward === "1") {
        return "开启";
      }
    },
    // 奖励方式
    rewardTypeTxt(val) {
      if (val.rewardType === "0") {
        return "助力砍价值";
      } else if (val.rewardType === "1") {
        return "固定值";
      }
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      let _this = this;
      if (res.status == 200) {
        _this.bargainForm.background = res.bean;
      }
    },
    handleSuccess(res, file) {
      let _this = this;
      if (res.status == 200) {
        _this.bargainForm.bargainBanner = res.bean;
      }
    },
    // 添加弹窗
    addInfoModel() {
      let _this = this;
      _this.addVisible = true;
      _this.dailogTitleType = "新增";
    },
    // 编辑弹窗
    handleEdit(index, row) {
      let _this = this;
      _this.addVisible = true;
      _this.editVisible = true;
      _this.dailogTitleType = "修改";
      let item = _this.bargainInfoData[index];
      console.log(item.id);
      _this.bargainForm = {
        id: item.id,
        ruleName: item.ruleName,
        isQuota: item.isQuota,
        quotaNumber: item.quotaNumber,
        helpCrowd: item.helpCrowd,
        limited: item.limited,
        payLimit: item.payLimit,
        isHelpReward: item.isHelpReward,
        rewardType: item.rewardType
      };
    },
    // 弹窗取消
    cancelBargain() {
      let _this = this;
      _this.addVisible = false;
      _this.bargainForm = {
        id: "",
        ruleName: "",
        isQuota: "0",
        quotaNumber: "",
        helpCrowd: "0",
        limited: "",
        payLimit: "",
        isHelpReward: "0",
        rewardType: "0"
      };
    },
    // 添加确认
    submitForm(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          $.ajax({
            url: baseUrl + "/bargain/rule/add",
            type: "POST",
            dataType: "json",
            data: {
              token: _this.token,
              ruleName: _this.bargainForm.ruleName,
              isQuota: _this.bargainForm.isQuota,
              quotaNumber: _this.bargainForm.quotaNumber,
              helpCrowd: _this.bargainForm.helpCrowd,
              limited: _this.bargainForm.limited,
              payLimit: _this.bargainForm.payLimit,
              isHelpReward: _this.bargainForm.isHelpReward,
              rewardType: _this.bargainForm.rewardType
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                _this.$message({
                  type: "success",
                  message: "添加成功"
                });
                _this.addVisible = false;
                _this.getAllRole();
                // this.$router.go(0)
                // this.$router.push({ path: "/themeList" });
              } else {
                _this.$message.error(data.msg);
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
    // 修改确认
    submitFormEdit(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(_this.bargainForm.id);
          $.ajax({
            url: baseUrl + "/bargain/rule/update",
            type: "POST",
            dataType: "json",
            data: {
              token: _this.token,
              id: _this.bargainForm.id,
              ruleName: _this.bargainForm.ruleName,
              isQuota: _this.bargainForm.isQuota,
              quotaNumber: _this.bargainForm.quotaNumber,
              helpCrowd: _this.bargainForm.helpCrowd,
              limited: _this.bargainForm.limited,
              payLimit: _this.bargainForm.payLimit,
              isHelpReward: _this.bargainForm.isHelpReward,
              rewardType: _this.bargainForm.rewardType
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                _this.$message({
                  type: "success",
                  message: "修改成功"
                });
                _this.getAllRole();
                _this.addVisible = false;
              } else {
                _this.$message.error(data.msg);
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
    }
  }
};
</script>
<style>
.addBtns {
  margin-bottom: 20px;
}
</style>
