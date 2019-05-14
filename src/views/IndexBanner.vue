<template>
  <!-- <section class="el-container wrapper is-vertical"> -->
      <div>
       <div class="block">
        <el-row>
          <el-button type="primary" class="addBtn"  @click="addBanner()">添加图片</el-button>
        </el-row>
      </div>
    <div>
        <el-table :data="BannerListData" border style="width: 100%">
          <!-- <el-table-column prop="id" label="id" align="center"></el-table-column> -->
          <el-table-column prop="title" label="标题" align="center"></el-table-column>
          <el-table-column prop="url" label="图片" align="center">
              <template  slot-scope="scope">
                <img v-bind:src="scope.row.url" class="thumnial">
              </template>
          </el-table-column>
          <el-table-column prop="sortOrder" label="排序" align="center" width="80"></el-table-column>
          <el-table-column prop="link" label="跳转地址" align="center"></el-table-column>
          <el-table-column prop="created" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="updated" label="修改时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="220px">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDele(scope.$index, scope.row)">删除</el-button>
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
      <el-dialog :title="dailogTitleType" :visible.sync="addModel" :close-on-click-modal="false" :before-close="cancelBanner">
                <el-form :model="forms" :rules="rules" ref="forms" label-width="120px" class="demo-forms">
            <el-form-item label="标题" prop="title">
                <el-input v-model="forms.title"></el-input>
            </el-form-item>
            <el-form-item label="banner图片" prop="url">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="upLoadData"
                  accept="image/png,image/gif,image/jpeg,image/jpg">
                  <img v-if="forms.url" :src="forms.url" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">不能超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="跳转地址" prop="link">
                <el-input v-model="forms.link" placeholder="请输入跳转地址"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sortOrder">
                <el-input-number v-model="forms.sortOrder" controls-position="right" :min="1"></el-input-number>
                <div class="tips">1为优先级别最高</div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFormEdit('forms')" v-if="editVisible">确定</el-button>
                <el-button type="primary" @click="submitForm('forms')" v-else>确定</el-button>
                <el-button @click="cancelBanner()">取消</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
    </div>
  <!-- </section> -->
</template>
<script>
import { baseUrl } from "@/config/env";
import { baseImgPath } from "@/config/env";
import { getStore } from "@/config/mUtils";
export default {
  name: "IndexBanner",
  data() {
    return {
      token: getStore("token"),
      upLoadData: {
        token: getStore("token")
      },
      uploadUrl: baseImgPath + "picture/oss/upload/multi",
      addModel: false, //新增编辑弹窗
      deleteVisible: false, //删除弹窗
      editVisible: false, //编辑按钮
      BannerListData: [],
      dailogTitleType: "新增",
      ids: -1,
      forms: {
        id: "",
        title: "",
        url: "",
        sortOrder: "",
        link: "",
        created: "",
        updated: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入图片标题", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        link: [{ required: true, message: "请输入图片链接" }],
        sortOrder: [{ required: true, trigger: "change" }],
        url: [{ required: true, message: "请选择图片资源", trigger: "change" }]
      },
      startTime: "",
      endTime: ""
    };
  },
  created() {
    this.getBannerAll();
  },
  methods: {
    //   获取全部banner列表
    getBannerAll() {
      let _this = this;
      let token = getStore("token");
      $.get(baseUrl + "theme/get/all", { token: token }, data => {
        if (data.status == 200) {
          _this.BannerListData = data.bean;
        } else {
          _this.message.error(data.msg);
        }
      });
    },
    // 新增弹窗
    addBanner() {
      let _this = this;
      _this.addModel = true;
      _this.editVisible = false;
      _this.dailogTitleType = "新增";
    },
    // 取消编辑
    cancelBanner() {
      let _this = this;
      _this.addModel = false;
      _this.forms = {
        id: "",
        title: "",
        url: "",
        link: "",
        sortOrder: ""
      };
    },
    // 编辑弹窗
    handleEdit(index, row) {
      let _this = this;
      _this.addModel = true;
      _this.editVisible = true;
      _this.dailogTitleType = "修改";
      let item = _this.BannerListData[index];
      _this.forms = {
        id: item.id,
        title: item.title,
        url: item.url,
        sortOrder: item.sortOrder,
        link: item.link
        // created: item.created,
        // updated: item.updated
      };
    },
    // 删除弹窗
    handleDele(index, row) {
      let _this = this;
      let item = _this.BannerListData[index];
      _this.ids = item.id;
      this.deleteVisible = true;
    },
    getStartTime(date) {
      let _this = this;
      _this.forms.created = date;
      console.log(date);
    },
    getEndTime(date) {
      let _this = this;
      _this.forms.updated = date;
      console.log(date);
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      let _this = this;
      if (res.status == 200) {
        _this.forms.url = res.bean;
      }
    },
    // 添加确认
    submitForm(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          $.ajax({
            url: baseUrl + "/theme/add",
            type: "POST",
            dataType: "json",
            data: {
              token: _this.token,
              //   id: _this.forms.id,
              title: _this.forms.title,
              sortOrder: _this.forms.sortOrder,
              url: _this.forms.url,
              sortOrder: _this.forms.sortOrder,
              //   created: _this.forms.created,
              //   updated: _this.forms.updated,
              link: _this.forms.link
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                _this.$message({
                  type: "success",
                  message: "添加成功"
                });
                _this.addModel = false;
                _this.getBannerAll();
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
          console.log(_this.forms.id);
          $.ajax({
            url: baseUrl + "/theme/modify",
            type: "POST",
            dataType: "json",
            data: {
              token: _this.token,
              id: _this.forms.id,
              title: _this.forms.title,
              sortOrder: _this.forms.sortOrder,
              url: _this.forms.url,
              sortOrder: _this.forms.sortOrder,
              //   created: _this.forms.created,
              //   updated: _this.forms.updated,
              link: _this.forms.link
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                _this.$message({
                  type: "success",
                  message: "修改成功"
                });
                _this.getBannerAll();
                _this.addModel = false;
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
    // 重置
    resetForm(formName) {
      let _this = this;
      _this.$refs[formName].resetFields();
    },
    // 确定删除
    deleteBanner() {
      let _this = this;
      $.ajax({
        url: baseUrl + "/theme/delete",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          id: _this.ids
        }
      })
        .done(data => {
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功！"
            });
            _this.getBannerAll();
            _this.deleteVisible = false;
          } else if (data.status == 501) {
            this.$message({
              message: data.msg,
              type: "warning"
            });
          } else {
            this.$message.error(data.msg);
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
.thumnial {
  width: 100px;
  height: 100px;
}
.addBtn {
  margin-bottom: 20px;
}
</style>
