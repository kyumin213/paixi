<template>
      <div>
       <div class="block">
        <el-row>
          <el-button type="primary" class="addBtns"  @click="addInfoModel()">添加活动详情</el-button>
        </el-row>
      </div>
    <div>
        <el-table :data="bargainInfoData" border style="width: 100%">
          <el-table-column prop="id" label="id" align="center"></el-table-column>
          <el-table-column prop="name" label="活动名称" align="center"></el-table-column>
          <el-table-column prop="brief" label="简介" align="center"></el-table-column>
          <!-- <el-table-column prop="background" label="背景" align="center">
              <template  slot-scope="scope">
                <img v-bind:src="scope.row.background" class="thumnial">
              </template>
          </el-table-column>
          <el-table-column prop="bargainBanner" label="banner" align="center">
              <template  slot-scope="scope">
                <img v-bind:src="scope.row.bargainBanner" class="thumnial">
              </template>
          </el-table-column> -->
          <el-table-column prop="stock" label="库存" align="center" width="80"></el-table-column>
          <el-table-column prop="sales" label="销量" align="center"></el-table-column>
          <!-- <el-table-column prop="bargainText" label="描述" align="center"></el-table-column> -->
          <el-table-column prop="beginTime" label="上架时间" align="center"></el-table-column>
          <el-table-column prop="endTime" label="下架时间" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center" :formatter="statusTxt" width="80"></el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button size="small" type="success" @click="handleViewGoods(scope.$index, scope.row)">查看</el-button>
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDele(scope.$index, scope.row)">删除</el-button>
              <el-button size="small" type="warning" @click="handStatus(scope.$index,scope.row)">
                <span v-if="scope.row.status == 1">下架</span>
                <span v-if="scope.row.status == 0">上架</span>
              </el-button>
              <!-- <el-button size="small" type="danger">下架</el-button> -->
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 删除弹窗 -->
      <el-dialog title="温馨提示" :visible.sync="deleteVisible" center width="30%">
        <div class="del-dialog-cnt" style="text-align:center">是否确定删除</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible=false">取消</el-button>
          <el-button type="primary" @click="deleteBanner">确定</el-button>
        </span>
      </el-dialog>
      <!-- 增加修改弹窗 -->
    <el-dialog :title="dailogTitleType" :visible.sync="addVisible" :close-on-click-modal="false" :before-close="cancelBargain">
        <el-form :model="bargainForm" :rules="rules" ref="bargainForm" label-width="120px" class="demo-forms">
            <el-form-item label="规则名称" prop="ruleId">
                <el-select v-model="bargainForm.ruleId" placeholder="请选择">
                    <el-option
                        v-for="item in roleNameData"
                        :key="item.id"
                        :label="item.ruleName"
                        :value="item.id">
                  </el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="bargainForm.name" placeholder="请输入活动名称"></el-input>
            </el-form-item>
      
            <el-form-item label="活动简介" prop="brief">
                <el-input v-model="bargainForm.brief" placeholder="请输入活动简介"></el-input>
            </el-form-item>
            <el-form-item label="库存" prop="stock">
                <el-input v-model="bargainForm.stock" placeholder="请输入库存"></el-input>
            </el-form-item>
            <el-form-item label="销量" prop="sales">
                <el-input v-model="bargainForm.sales" placeholder="请输入销量"></el-input>
            </el-form-item>
            <el-form-item label="上架时间" prop="beginTime">
                <el-date-picker
									v-model="bargainForm.beginTime"
									type="datetime"
									@change="getStartTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择上架时间">
				</el-date-picker>
            </el-form-item>
            <el-form-item label="下架时间" prop="endTime">
                <el-date-picker
									v-model="bargainForm.endTime"
									type="datetime"
									@change="getEndTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择下架时间">
				</el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="bargainForm.status" size="medium">
                    <el-radio-button label="1">上架</el-radio-button>
                    <el-radio-button label="0">下架</el-radio-button>
            </el-radio-group>
            </el-form-item>
            <el-form-item label="活动描述" prop="bargainText">
                <el-input v-model="bargainForm.bargainText" placeholder="请输入活动描述" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="列表背景" prop="background">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="upLoadData"
                  accept="image/png,image/gif,image/jpeg,image/jpg">
                  <img v-if="bargainForm.background" :src="bargainForm.background" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">不能超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="介绍页背景" prop="bargainBanner">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleSuccess"
                  :data="upLoadData"
                  accept="image/png,image/gif,image/jpeg,image/jpg">
                  <img v-if="bargainForm.bargainBanner" :src="bargainForm.bargainBanner" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">不能超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFormEdit('bargainForm')" v-if="editVisible">确定</el-button>
                <el-button type="primary" @click="submitForm('bargainForm')" v-else>确定</el-button>
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
  name: "BargainInfo",
  data() {
    return {
      token: getStore("token"),
      upLoadData: {
        token: getStore("token")
      },
      uploadUrl: baseImgPath + "picture/oss/upload/multi",
      bargainInfoData: [],
      roleNameData: [], //规则名称
      relativeData: [], //商品列表
      multipleSelection: [], //批量添加选中信息
      moreAdds: [],
      deleteVisible: false,
      addVisible: false,
      editVisible: false,
      goodsListVisible: false,
      dailogTitleType: "新增",
      ids: "", //删除id
      bargainForm: {
        id: "",
        ruleId: "",
        name: "",
        brief: "",
        stock: "",
        sales: "",
        beginTime: "",
        endTime: "",
        status: "1",
        bargainText: "",
        background: "",
        bargainBanner: ""
      },
      rules: {
        ruleId: [
          { required: true, message: "请选择规则名称", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
          //   { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        brief: [{ required: true, message: "请输入活动简介" }],
        bargainText: [{ required: true, message: "请输入活动描述" }],
        stock: [{ required: true, message: "请输入库存" }],
        sales: [{ required: true, message: "请输入销量" }],
        beginTime: [{ required: true, message: "请选择上架时间" }],
        endTime: [{ required: true, message: "请输选择下架时间" }],
        background: [
          { required: true, message: "请选择列表背景", trigger: "change" }
        ],
        bargainBanner: [
          { required: true, message: "请选择介绍页背景", trigger: "change" }
        ]
      }
    };
  },
  created() {
    let _this = this;
    _this.getAllInfo();
    _this.getAllRoleName();
  },
  methods: {
    // 上下架
    handStatus(index, row) {
      let _this = this;
      let id = row.id;
      var status = row.status;
      status = status == 1 ? 0 : 1;
      $.ajax({
        url: baseUrl + "/bargain/info/update/status",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.token,
          id: id,
          status: status
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "状态修改成功"
            });
            _this.getAllInfo();
          } else {
            _this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    // 查看活动详情
    handleViewGoods(index, row) {
      let _this = this;
      _this.$router.push({ name: "AllRelative", params: { id: row.id } });
    },
    handleSelectionChange(val) {
      let _this = this;
      _this.multipleSelection = val;
    },
    //   获取全部活动
    getAllInfo() {
      let _this = this;
      $.get(
        baseUrl + "/bargain/info/get/all",
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
    // 获取全部规则名称
    getAllRoleName() {
      let _this = this;
      $.get(
        baseUrl + "/bargain/rule/get/allname",
        { token: _this.token },
        data => {
          if (data.status == 200) {
            _this.roleNameData = data.bean;
          } else {
            _this.message.error(data.msg);
          }
        }
      );
    },
    // 状态转文字
    statusTxt(val) {
      if (val.status === "0") {
        return "下架";
      }
      if (val.status === "1") {
        return "上架";
      }
    },
    // 开始时间
    getStartTime(date) {
      let _this = this;
      _this.bargainForm.beginTime = date;
      console.log(date);
    },
    // 结束时间
    getEndTime(date) {
      let _this = this;
      _this.bargainForm.endTime = date;
      console.log(date);
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
      console.log(12);
      _this.dailogTitleType = "修改";
      let item = _this.bargainInfoData[index];
      _this.bargainForm = {
        id: item.id,
        ruleId: item.ruleId,
        name: item.name,
        brief: item.brief,
        stock: item.stock,
        sales: item.sales,
        status: item.status,
        beginTime: item.beginTime,
        endTime: item.endTime,
        bargainText: item.bargainText,
        background: item.background,
        bargainBanner: item.bargainBanner
      };
    },
    // 删除弹窗
    handleDele(index, row) {
      let _this = this;
      _this.ids = row.id;
      this.deleteVisible = true;
    },
    // 弹窗取消
    cancelBargain() {
      let _this = this;
      _this.addVisible = false;
      _this.bargainForm = {
        id: "",
        ruleId: "",
        name: "",
        brief: "",
        stock: "",
        sales: "",
        beginTime: "",
        endTime: "",
        status: "1",
        bargainText: "",
        background: "",
        bargainBanner: ""
      };
    },
    // 添加确认
    submitForm(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          $.ajax({
            url: baseUrl + "/bargain/info/add",
            type: "POST",
            dataType: "json",
            data: {
              token: _this.token,
              ruleId: _this.bargainForm.ruleId,
              name: _this.bargainForm.name,
              brief: _this.bargainForm.brief,
              stock: _this.bargainForm.stock,
              sales: _this.bargainForm.sales,
              beginTime: _this.bargainForm.beginTime,
              endTime: _this.bargainForm.endTime,
              status: _this.bargainForm.status,
              bargainText: _this.bargainForm.bargainText,
              background: _this.bargainForm.background,
              bargainBanner: _this.bargainForm.bargainBanner
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
                _this.getAllInfo();
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
          $.ajax({
            url: baseUrl + "/bargain/info/update",
            type: "POST",
            dataType: "json",
            data: {
              token: _this.token,
              id: _this.bargainForm.id,
              ruleId: _this.bargainForm.ruleId,
              name: _this.bargainForm.name,
              brief: _this.bargainForm.brief,
              stock: _this.bargainForm.stock,
              sales: _this.bargainForm.sales,
              beginTime: _this.bargainForm.beginTime,
              endTime: _this.bargainForm.endTime,
              status: _this.bargainForm.status,
              bargainText: _this.bargainForm.bargainText,
              background: _this.bargainForm.background,
              bargainBanner: _this.bargainForm.bargainBanner
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                _this.$message({
                  type: "success",
                  message: "修改成功"
                });
                _this.addVisible = false;
                _this.getAllInfo();
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
    // 确定删除
    deleteBanner() {
      let _this = this;
      $.ajax({
        url: baseUrl + "/bargain/info/delete/bargaininfo",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.token,
          id: _this.ids
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "删除成功"
            });
            _this.deleteVisible = false;
            _this.getAllInfo();
          } else {
            _this.message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
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
