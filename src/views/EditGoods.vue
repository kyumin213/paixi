<template>
  <section class="el-container wrapper is-vertical">
     <!-- 弹出框 选择分类 -->
     <el-dialog title="选择商品分类" :visible.sync="dialogFormVisible" class="select-category">
        <el-form :model="form">
          <el-form-item label="商品分类" :label-width="formLabelWidth">
            <!-- filterable remote :remote-method="remoteMethod" -->
            <el-select v-model="form.categoryId" placeholder="请选择商品类目" @change="selectSecondCategory">
              <el-option
                v-for="item in form.options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>

            <el-select v-model="form.categoryIdSecond" v-if="isShowSecond">
              <el-option
                v-for="item in form.secondOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectCategory">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出层 保存参数 -->

      <!-- 添加商品布局 -->
      <div class="add-contanier">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="已选分类">
              <!-- <el-input v-model="form.categoryId"></el-input> -->
              <span>{{ ruleForm.cateGoryName }}</span>
              <el-button type="primary" plain  @click="popBox" style="margin-left:20px;">修改分类</el-button>
            </el-form-item>

            <el-form-item label="是否为海淘商品" prop="isSeaAmoy">
                <el-radio-group v-model="ruleForm.isSeaAmoy">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            
            <el-form-item label="是否为首页热销推荐" prop="iSpage">
               <el-radio-group v-model="ruleForm.iSpage">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="商品标题" prop="title">
              <el-input v-model="ruleForm.title" placeholder="请输入商品标题"></el-input>
            </el-form-item>

            <el-form-item label="商品介绍" prop="sellingPoint">
              <el-input v-model="ruleForm.sellingPoint" placeholder="请输入商品介绍"></el-input>
            </el-form-item>
             
            <el-form-item label="商品原价" prop="beforePrice">
              <el-input v-model="ruleForm.beforePrice" placeholder="请输入商品原价"></el-input>
            </el-form-item>

            <el-form-item label="商品默认价格" prop="basePrice">
              <el-input v-model="ruleForm.basePrice" placeholder="请输入商品价格"></el-input>
            </el-form-item>

            <el-form-item label="已售数量" prop="stockBase">
              <el-input v-model="ruleForm.stockBase" placeholder="请输入商品已售数量"></el-input>
            </el-form-item>
            
            <!-- Todo 商品属性 动态添加 -->
            <el-form-item :label="'商品属性'" prop="param" class="goodsProps" >
              <div v-for="(item, index) in ruleForm.param" :prop="'item.' + index + '.value'" :key="item.key" class="prop-box">
                  <el-input v-model="item.value" placeholder="请输入属性名"></el-input>
                  <!-- sku图片 -->
                  <!-- <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    name="uploadFile"
                    :show-file-list="false"
                    :objectBind="index"
                    :on-success="handleskuImgSuccess"
                    :data="upLoadData">
                    <img v-if="item.skuImg" :src="item.skuImg" class="avatar">
                    <div v-else>
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                    </div>
                    
                  </el-upload> -->
                  <el-button @click.prevent="removeProps(item)">删除</el-button>
              </div>
              <i class="el-icon-plus addBtn"  @click="addProps"></i>
              <el-button @click="saveProps" class="saveBtn">确认保存</el-button>
            </el-form-item>
          <!-- 商品价格 -->
          <el-form-item label="商品价格" prop="skuprice" class="goods-skulist">  

            <el-table
              :data="tableData"
              border
              style="width: 70%">

              <el-table-column
                label="商品属性名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.major }}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="价格">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.price" placeholder="请输入商品价格"></el-input>
                </template>
              </el-table-column>  

              <el-table-column
                label="库存">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.stock" placeholder="请输入商品库存"></el-input>
                </template>
              </el-table-column>  

              <!-- sku图片 -->
              <el-table-column
                label="sku图片">
                <template slot-scope="scope">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    name="uploadFile"
                    :show-file-list="false"
                    :objectBind="scope.$index"
                    :on-success="handleskuImgSuccess"
                    :data="upLoadData">
                    <img v-if="scope.row.skuImg" :src="scope.row.skuImg" class="avatar">
                    <div v-else>
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                    </div>
                  </el-upload>
                </template>
              </el-table-column>          
            </el-table>

          </el-form-item>
            <!-- Todo 商品信息 动态添加 -->
            <el-form-item :label="'商品信息'" prop="information" class="goodsInfo" >
              <div v-for="(item, index) in ruleForm.information" :prop="'item.' + index + '.value'" :key="item.key" class="info-box">
                  <el-input v-model="item.infoName" placeholder="请输入商品信息参数名"></el-input>
                  <el-input v-model="item.value" placeholder="请输入商品信息参数值"></el-input>
                  <el-button @click.prevent="removeInfo(item)">删除</el-button>
              </div>
              <i class="el-icon-plus addBtn"  @click="addInfo"></i>
            </el-form-item>

            <!-- Todo 商品服务承诺 动态添加 -->
            <el-form-item :label="'服务承诺'" prop="serves" class="goodsInfo" >
              <div v-for="(item, index) in ruleForm.serves" :prop="'item.' + index + '.value'" :key="item.key" class="info-box">
                  <el-input v-model="item.servesName" placeholder="七天无理由退货"></el-input>
                  <el-button @click.prevent="removeServes(item)">删除</el-button>
              </div>
            <!-- <el-button @click="addInfo">新增属性</el-button> -->
            <i class="el-icon-plus addBtn"  @click="addServes"></i>
          </el-form-item>

          <el-form-item label="商品备注">
            <el-input v-model="ruleForm.remarkContent" placeholder="请输入商品备注"></el-input>
          </el-form-item>
          <el-form-item label="商品备注链接地址">
            <el-input v-model="ruleForm.remarkUrl" placeholder="请输入商品链接地址"></el-input>
          </el-form-item>
            <el-form-item label="商品封面图" prop="pictureCover" class="cover">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="upLoadData" accept="image/png,image/gif,image/jpeg,image/jpg">
                  <img v-if="ruleForm.pictureCover" :src="ruleForm.pictureCover" class="avatar">
                  <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                  <el-button v-else size="small" type="primary">上传图片</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>

            <el-form-item label="商品banner图">
                <el-upload
                  multiple
                  class="upload-demo"                  
                  name="uploadFiles"
                  :action="uploadUrlMul"
                  ref="upload"
                  :auto-upload = "false"
                  :show-file-list = "true"
                  :on-remove="handleRemoveBanner"
                  :on-success="handleAvatarSuccessBanner" 
                  :http-request="uploadFileRequest"  
                  :file-list = "ruleForm.pictureBanner"            
                  list-type="picture-card" accept="image/png,image/gif,image/jpeg,image/jpg"
                  >
                  <i class="el-icon-plus avatar-uploader-icon" style="width:148px;height:148px;line-height:148px;"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb。最多上传5张</div>
                </el-upload>
                <el-button size="small" type="primary" @click="subPicForm">上传到服务器</el-button>
            </el-form-item>
             
            <el-form-item label="商品详情图片">
                <el-upload
                  multiple
                  class="upload-demo"
                  name="uploadFiles"
                  :action="uploadUrlMul"
                  ref="uploadDetail"
                  :auto-upload = "false"
                  :show-file-list = "true"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"       
                  :file-list="ruleForm.details"        
                  :http-request="uploadFileRequestDetails"
                  list-type="picture-card"
                  accept="image/png,image/gif,image/jpeg,image/jpg"
                  >
                  <i class="el-icon-plus avatar-uploader-icon" style="width:148px;height:148px;line-height:148px;"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb。最多上传15张</div>
                </el-upload>
                <el-button size="small" type="primary" @click="subDetailPicForm">上传到服务器</el-button>                
            </el-form-item>

            <!-- <el-form-item label="商品banner图" prop="pictureBanner">
                <el-upload
                  multiple
                  class="upload-demo"
                  :action="uploadUrl"
                  name="uploadFile"
                  :on-preview="handlePreview"
                  :on-remove="handleRemoveBanner"
                  :on-success="handleAvatarSuccessBanner"
                  :file-list="ruleForm.pictureBanner"
                  list-type="picture-card"
                  :data="upLoadData">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>

            <el-form-item label="商品详情图片" prop="details">
                <el-upload
                  multiple
                  class="upload-demo"
                  :action="uploadUrl"
                  name="uploadFile"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="handleAvatarSuccessDetails"
                  :file-list="ruleForm.details"
                  list-type="picture-card"
                  :data="upLoadData">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item> -->

            <el-form-item>
              <el-button type="success" @click="submitForm('ruleForm')">确认修改</el-button>
              <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
      </div>
      
  </section>
</template>
<style>
.saveBtn {
  margin-left: 10px;
}
.addBtn {
  cursor: pointer;
  color: #409eff;
  font-size: 24px;
  font-weight: bold;
}
.addgoods {
  margin-top: 20px;
}
.el-dialog {
  width: 30%;
}
.add-contanier {
  margin-top: 20px;
}
.prop-box {
  display: flex;
  align-items: center;
}
.goodsProps .el-input {
  /* width: 80%; */
  display: inline-block;
}
.goods-skulist .avatar-uploader {
  display: inline-block;
  margin: 0 20px;
  width: 100px;
  height: 100px;
}
.goods-skulist .avatar-uploader-icon {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.goods-skulist .avatar {
  width: 100px;
  height: 100px;
}
.cover .avatar {
  width: 178px;
  height: 178px;
}
.prop-box {
  /* display: inline-block; */
  width: 60%;
  margin-bottom: 10px;
}
.goodsInfo .el-input {
  width: 40%;
}
.info-box {
  /* display: inline-block; */
  width: 40%;
  margin-bottom: 10px;
}
</style>

<script>
import { baseUrl } from "@/config/env";
import { baseImgPath } from "@/config/env";
import { getStore } from "@/config/mUtils";
export default {
  name: "EditGoods",
  data() {
    return {
      token: getStore("token"),
      isShowSecond: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      uploadUrl: baseImgPath + "picture/oss/upload/multi",
      uploadUrlMul: baseImgPath + "picture/oss/upload/multi/list",
      id: this.$route.params.id,
      showPrice: false,
      tableData: [],
      templateData: "",
      upLoadData: {
        token: getStore("token")
        // fileName: 'http://image.prise.shop/images/2018/04/03/1522736335352510.png'
      },
      ruleForm: {
        title: "",
        cateGoryName: "",
        sellingPoint: "",
        basePrice: "",
        isSeaAmoy: "",
        iSpage: "0",
        param: [],
        information: [
          {
            infoName: "",
            value: ""
          }
        ],
        serves: [],
        pictureCover: "",
        pictureBanner: [],
        details: [],
        arrBanner: [],
        arrDetails: [],
        remarkContent: "",
        remarkUrl: "",
        stockBase: 0
      },
      rules: {
        title: [{ required: true, message: "请输入商品标题", trigger: "blur" }],
        sellingPoint: [
          { required: true, message: "请输入商品介绍", trigger: "blur" }
        ],
        basePrice: [
          { required: true, message: "请输入商品现价", trigger: "blur" }
        ],
        beforePrice: [
          { required: true, message: "请输入商品原价", trigger: "blur" }
        ],
        pictureCover: [{ required: true, message: "请上传封面图" }],
        pictureBanner: [{ required: true, message: "请上传banner图" }],
        details: [{ required: true }],
        isSeaAmoy: [{ required: true }],
        param: [{ required: true, message: "请输入商品属性" }],
        information: [{ required: true, message: "请输入商品基本信息" }],
        serves: [{ required: true, message: "请输入商品服务承诺" }]
      },
      form: {
        name: "",
        options: [],
        secondOptions: [],
        categoryId: "",
        categoryIdSecond: ""
      },
      formLabelWidth: "120px",
      template: {
        name: ""
      }
    };
  },
  methods: {
    getGoodsInfo() {
      $.get(
        baseUrl + "product/get/id",
        { token: this.token, id: this.id },
        data => {
          if (data.status == 200) {
            console.log(data.bean);
            this.ruleForm.title = data.bean.title;
            this.ruleForm.basePrice = data.bean.basePrice;
            this.ruleForm.beforePrice = data.bean.beforePrice;
            this.ruleForm.sellingPoint = data.bean.sellingPoint;
            this.ruleForm.pictureCover = data.bean.pictureCover;
            this.ruleForm.remarkUrl = data.bean.remarkUrl;
            this.ruleForm.remarkContent = data.bean.remarkContent;
            this.ruleForm.stockBase = data.bean.stockBase;
            this.ruleForm.isSeaAmoy = data.bean.isSeaAmoy.toString();
            this.ruleForm.iSpage = data.bean.iSpage.toString() || "0";
            var pictureBanner = data.bean.pictureBanner.split(",");
            var details = data.bean.details.split(",");
            for (var i in pictureBanner) {
              this.ruleForm.pictureBanner.push({
                url: pictureBanner[i]
              });
            }
            for (var i in details) {
              this.ruleForm.details.push({
                url: details[i]
              });
            }
            var paramArr = JSON.parse(data.bean.param).children;
            for (var i in paramArr) {
              this.ruleForm.param.push({
                value: paramArr[i].major,
                skuImg: paramArr[i].skuImg
              });
            }
            this.ruleForm.information = JSON.parse(data.bean.information);
            this.tableData = JSON.parse(data.bean.skuList);
            this.ruleForm.categoryId = data.bean.categoryId;
            this.ruleForm.serves = JSON.parse(data.bean.serves);
            $.get(
              baseUrl + "product/category/get",
              { token: this.token, id: this.ruleForm.categoryId },
              data => {
                if (data.status == 200) {
                  this.ruleForm.cateGoryName = data.bean.name;
                  this.isShowAddGoods = true;
                } else {
                  this.$message.error(data.msg);
                }
              }
            );
          }
        }
      );
    },
    popBox() {
      this.dialogFormVisible = true;
      this.remoteMethod();
    },
    selectSecondCategory() {
      var id = this.form.categoryId;
      $.get(
        baseUrl + "product/category/get/children",
        { token: this.token, id: id },
        data => {
          if (data.status == 200) {
            if (data.bean.length < 1) {
              this.isShowSecond = false;
              this.form.secondOptions = data.bean;
            } else {
              this.isShowSecond = true;
              this.form.secondOptions = data.bean;
            }
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    },
    remoteMethod() {
      $.get(
        baseUrl + "product/category/get/children",
        { token: this.token, id: 0 },
        data => {
          console.log(data.bean);
          if (data.status == 200) {
            this.form.options = data.bean;
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    },
    selectCategory() {
      this.dialogFormVisible = false;
      console.log(this.form.categoryId);
      var categoryId =
        this.form.categoryIdSecond != ""
          ? this.form.categoryIdSecond
          : this.form.categoryId || this.ruleForm.categoryId;
      $.get(
        baseUrl + "product/category/get",
        { token: this.token, id: categoryId },
        data => {
          if (data.status == 200) {
            this.ruleForm.cateGoryName = data.bean.name;
            this.isShowAddGoods = true;
            this.form.categoryId = data.bean.id;
          } else {
            this.$message.error(data.msg);
          }
        }
      );
      // Todo 根据category的ID选择相应模板
    },
    addServes() {
      this.ruleForm.serves.push({
        servesName: ""
      });
    },
    removeServes(item) {
      var index = this.ruleForm.serves.indexOf(item);
      if (index !== -1) {
        this.ruleForm.serves.splice(index, 1);
      }
    },
    removeProps(item) {
      var index = this.ruleForm.param.indexOf(item);
      if (index !== -1) {
        this.ruleForm.param.splice(index, 1);
      }
    },
    addProps() {
      this.ruleForm.param.push({
        value: ""
      });
      console.log(this.ruleForm.param);
    },
    saveProps() {
      var param = {
        major: "通用",
        describe: "",
        isParent: 1,
        choose: null,
        children: []
      };
      for (var i in this.ruleForm.param) {
        var obj = {};
        obj.major = this.ruleForm.param[i].value;
        obj.skuImg = this.ruleForm.param[i].skuImg;
        obj.sku = 1 + "" + (parseInt(i) + 1);
        param.children.push(obj);
      }
      this.showPrice = true;
      this.tableData = param.children;
      // param = JSON.stringify(param)
      // console.log(param)
    },
    handleskuImgSuccess(res, file, list, index) {
      console.log(index);
      if (res.status == 200) {
        this.tableData[index].skuImg = res.bean;
      }
    },
    removeInfo(item) {
      var index = this.ruleForm.information.indexOf(item);
      if (index !== -1) {
        this.ruleForm.information.splice(index, 1);
      }
    },
    addInfo() {
      this.ruleForm.information.push({
        value: ""
      });
      console.log(this.ruleForm.information);
    },
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible2 = true;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var param = {
            major: "通用",
            describe: "",
            isParent: 1,
            choose: null,
            children: []
          };
          for (var i in this.ruleForm.param) {
            var obj = {};
            obj.major = this.ruleForm.param[i].value;
            obj.skuImg = this.ruleForm.param[i].skuImg;
            obj.sku = 1 + "" + (parseInt(i) + 1);
            param.children.push(obj);
            // param.children.push(this.ruleForm.param[i].value)
          }
          var pictureBanner = [];
          var details = [];
          for (var i in this.ruleForm.pictureBanner) {
            pictureBanner.push(this.ruleForm.pictureBanner[i].url);
          }
          for (var i in this.ruleForm.details) {
            details.push(this.ruleForm.details[i].url);
          }
          pictureBanner = pictureBanner.toString();
          details = details.toString();
          param = JSON.stringify(param);
          var information = JSON.stringify(this.ruleForm.information);
          var serves = JSON.stringify(this.ruleForm.serves);
          var skuList = JSON.stringify(this.tableData);
          console.log(skuList);
          var categoryId =
            this.form.categoryIdSecond != ""
              ? this.form.categoryIdSecond
              : this.form.categoryId || this.ruleForm.categoryId;
          console.log(categoryId);
          $.ajax({
            url: baseUrl + "product/modify",
            type: "POST",
            dataType: "json",
            data: {
              id: this.id,
              token: this.token,
              title: this.ruleForm.title,
              sellingPoint: this.ruleForm.sellingPoint,
              basePrice: this.ruleForm.basePrice,
              beforePrice: this.ruleForm.beforePrice,
              param: param,
              information: information,
              pictureCover: this.ruleForm.pictureCover,
              pictureBanner: pictureBanner,
              details: details,
              categoryId: categoryId,
              skuList: skuList,
              isSeaAmoy: parseInt(this.ruleForm.isSeaAmoy),
              serves: serves,
              remarkUrl: this.ruleForm.remarkUrl,
              remarkUrl: this.ruleForm.remarkUrl,
              iSpage: this.ruleForm.iSpage,
              stockBase: this.ruleForm.stockBase
            }
          })
            .done(data => {
              console.log(data);
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "修改商品信息成功！"
                });
                this.$router.back(-1);
                // this.$router.go(0)
                // this.$router.push({ path: '/goodsList' })
              } else {
                this.$message.error(data.msg);
              }
            })
            .fail(data => {
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
      console.log(res);
      if (res.status == 200) {
        this.ruleForm.pictureCover = res.bean;
      }
    },
    handleAvatarSuccessBanner(res, file) {
      if (res.status == 200) {
        console.log(res.bean);
        this.ruleForm.pictureBanner.push({
          url: res.bean
        });
        console.log(this.ruleForm.pictureBanner);
      }
    },
    // 自定义banner上传
    uploadFileRequest(file) {
      this.formData.append("uploadFiles", file.file);
    },
    // 自定义详情图片上传
    uploadFileRequestDetails(file) {
      this.formDataDetail.append("uploadFiles", file.file);
    },
    // banner图片上传至服务器
    subPicForm() {
      this.formData = new FormData();
      this.$refs.upload.submit();
      $.ajax({
        url: baseImgPath + "picture/oss/upload/multi/list",
        type: "POST",
        dataType: "json",
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
        data: this.formData
      }).done(data => {
        if (data.status == 200) {
          this.ruleForm.arrBanner = data.bean;
          for (var i in this.ruleForm.arrBanner) {
            this.ruleForm.pictureBanner.push({
              url: this.ruleForm.arrBanner[i].url
            });
          }
          console.log(this.ruleForm.pictureBanner);
        }
      });
    },
    // 详情图片上传至服务器
    subDetailPicForm() {
      this.formDataDetail = new FormData();
      this.$refs.uploadDetail.submit();
      $.ajax({
        url: baseImgPath + "picture/oss/upload/multi/list",
        type: "POST",
        dataType: "json",
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
        data: this.formDataDetail
      }).done(data => {
        if (data.status == 200) {
          this.ruleForm.arrDetails = data.bean;
          for (var i in this.ruleForm.arrDetails) {
            this.ruleForm.details.push({
              url: this.ruleForm.arrDetails[i].url
            });
          }
          console.log(this.ruleForm.details);
        }
      });
    },
    deleteImgUrl(url) {
      $.ajax({
        url: baseImgPath + "picture/oss/remove/file",
        type: "POST",
        dataType: "json",
        data: {
          fileName: url
        }
      })
        .done(data => {})
        .fail(data => {
          console.log(data);
        });
    },
    // 移除上传的banner图片
    handleRemoveBanner(file, fileList) {
      var imgurl = file.url.toString();
      if (imgurl.indexOf("blob") > -1) {
      } else {
        this.ruleForm.pictureBanner = this.ruleForm.pictureBanner.filter(
          t => t.url != file.url
        );
      }
      this.deleteImgUrl(file.url);
    },
    handleAvatarSuccessDetails(res, file) {
      if (res.status == 200) {
        console.log(res.bean);
        this.ruleForm.details.push({
          url: res.bean
        });
        console.log(this.ruleForm.details);
      }
    },
    handleRemove(file, fileList) {
      console.log(file.url);
      var imgurl = file.url.toString();
      if (imgurl.indexOf("blob") > -1) {
      } else {
        this.ruleForm.details = this.ruleForm.details.filter(
          t => t.url != file.url
        );
      }
      this.deleteImgUrl(file.url);
    },
    handlePreview(file) {
      console.log(file);
    }
  },
  watch: {
    $route(to, from) {
      if (from.path === "/goodsList" || from.name === "ThemeDetails") {
        this.$router.go(0);
        this.id = to.params.id;
        this.getGoodsInfo();
      }
    }
  },
  created() {
    this.getGoodsInfo();
  }
};
</script>