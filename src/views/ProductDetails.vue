<template>
  <section class="el-container wrapper is-vertical">
      <el-row :gutter="20">
        <el-col :span="8">
            <div class="slider">
                <el-carousel :interval="5000" arrow="always">
                    <el-carousel-item v-for="item in ruleForm.pictureBanner" :key="item.index">
                    <img v-bind:src="item.url">
                    </el-carousel-item>
                </el-carousel>
            </div>
        </el-col>
        <el-col :span="12">
            <h2>{{ruleForm.title}}</h2>
            <div style="margin-bottom:20px;">{{ruleForm.sellingPoint}}</div>
            <el-row :gutter="20" class="m20">
              <el-col :span="2">
                原价
              </el-col>   
              <el-col :span="10">
                  <span style="text-decoration:line-through">{{ruleForm.beforePrice}}</span>
              </el-col>             
            </el-row>
            <el-row :gutter="20" class="m20">
              <el-col :span="2">
                现价
              </el-col>   
              <el-col :span="10">
                  {{ruleForm.basePrice}}
              </el-col>             
            </el-row>
            <el-row :gutter="20" class="m20">
              <el-col :span="2">
                规格
              </el-col>   
              <el-col :span="10">
                  <!-- <div>{{tableData}}</div> -->
                  <div v-for="item in tableData" :key="item.index" class="props" v-on:click="changeSku(item)">
                    <span v-bind:class="[item.index == currentNav ? 'red' : '']">{{item.major}}</span>
                  </div>
              </el-col>             
            </el-row>
            <el-row :gutter="20" class="m20">
              <el-col :span="2">
                已选
              </el-col>   
              <el-col :span="10">
                  {{selectedSkuValue}}
              </el-col>             
            </el-row>
            <el-row :gutter="20" class="m20">
              <el-col :span="2">
                数量
              </el-col>   
              <el-col :span="10">
                  <el-input-number v-model="ruleForm.num" @change="handleChange" :min="1" ></el-input-number>
              </el-col>             
            </el-row>
            <el-row :gutter="20" class="m20">
              <el-col :span="2">
                .
              </el-col>   
              <el-col :span="10">
                 <el-button type="danger" v-on:click="submitCart">加入购物车</el-button>
              </el-col>             
            </el-row>
        </el-col>
     </el-row>
  </section>
</template>
<style>
.m20 {
    margin-bottom: 20px;
}
.props {
    display: inline-block;
    margin-right: 10px;
}
.props span {
    display: inline-block;
    padding: 10px 20px;
    background: #ececec;
    color: #666;
    cursor: pointer;
}
.props .red {
    background: #f00;
}
.slider {
    width: 400px;
    height: 400px;
    margin: 0 auto;
}
.slider img {
    width: 400px;
}
.el-carousel__item,.el-carousel__container {
    height: 400px;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>

<script>
import { baseUrl } from '@/config/env'
import { baseImgPath } from '@/config/env'
import { getStore } from '@/config/mUtils'
export default {
  name: 'ProductDetails',
  data() {
    return {
      token: getStore('token'),
      isShowSecond: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      uploadUrl: baseImgPath + 'picture/oss/upload/multi',
      id: this.$route.params.id,
      showPrice: false,
      tableData: [],
      templateData: '',
      upLoadData: {
        token: getStore('token'),
        // fileName: 'http://image.prise.shop/images/2018/04/03/1522736335352510.png'
      },
      selectedSku: '',
      selectedProp: {},
      selectedSkuValue: '',
      currentNav: 0,
      ruleForm: {
        num: 1,
        title: '',
        cateGoryName: '',
        sellingPoint: '',
        basePrice: '',
        isSeaAmoy: '',
        param: [],
        information: [{
          infoName: '',
          value: ''
        }],
        serves: [],
        pictureCover: '',
        pictureBanner: [],
        details: []
      },
      rules: {
        title: [
          { required: true, message: '请输入商品标题', trigger: 'blur' }
        ],
        sellingPoint: [
          { required: true, message: '请输入商品介绍', trigger: 'blur' }
        ],
        basePrice: [
          { required: true, message: '请输入商品现价', trigger: 'blur' }
        ],
        beforePrice: [
          { required: true, message: '请输入商品原价', trigger: 'blur' }
        ],
        pictureCover: [
          { required: true, message: '请上传封面图' }
        ],
        pictureBanner: [
          { required: true, message: '请上传banner图' }
        ],
        details: [
          { required: true }
        ],
        isSeaAmoy: [
          { required: true }
        ],
        param: [
          { required: true, message: '请输入商品属性'  }
        ],
        information: [
          { required: true, message: '请输入商品基本信息'  }
        ],
        serves: [
          { required: true, message: '请输入商品服务承诺'  }
        ]
      },
      form: {
        name: '',
        options: [],
        secondOptions: [],
        categoryId: '',
        categoryIdSecond: ''
      },
      formLabelWidth: '120px',
      template: {
        name: ''
      }
    }
  },
  methods: {
    // 选择sku
    changeSku(e) {
        console.log(e)
      this.selectedSku = e.sku
      this.selectedSkuValue = e.major
      console.log(this.selectedSku)    
      var selectedProp = {}
      selectedProp.propName = e.major
      selectedProp.price = e.price
      this.selectedProp = selectedProp
    
    },
    handleChange(value) {
      console.log(value);
      this.ruleForm.num = value
    },
    getGoodsInfo () {
      $.get(baseUrl + 'product/get/id', {token: this.token, id: this.id}, (data) => {
        if (data.status == 200) {
            console.log(data.bean)
          this.ruleForm.title = data.bean.title
          this.ruleForm.basePrice = data.bean.basePrice
          this.ruleForm.beforePrice = data.bean.beforePrice
          this.ruleForm.sellingPoint = data.bean.sellingPoint
          this.ruleForm.pictureCover = data.bean.pictureCover
          this.ruleForm.isSeaAmoy = data.bean.isSeaAmoy.toString()
          var pictureBanner = data.bean.pictureBanner.split(',')
          var details = data.bean.details.split(',')
          for(var i in pictureBanner) {
              this.ruleForm.pictureBanner.push({
                  url: pictureBanner[i]
              })
          }
          for(var i in details) {
              this.ruleForm.details.push({
                  url: details[i]
              })
          }
          var paramArr = JSON.parse(data.bean.param).children
          var selectedProp = {}
          selectedProp.propName = paramArr[0].major
          selectedProp.price = paramArr[0].price
          this.selectedProp = selectedProp
          for (var i in paramArr) {
            this.ruleForm.param.push({
              value: paramArr[i].major,
              skuImg: paramArr[i].skuImg
            })
          }
          this.ruleForm.information = JSON.parse(data.bean.information)
          this.tableData = JSON.parse(data.bean.skuList)
          this.selectedSku = this.tableData[0].sku
          this.selectedSkuValue = this.tableData[0].major
          this.ruleForm.categoryId = data.bean.categoryId
          this.ruleForm.serves = JSON.parse(data.bean.serves)
          $.get(baseUrl + 'product/category/get',{token: this.token, id: this.ruleForm.categoryId }, (data) => {
            if (data.status == 200) {
              this.ruleForm.cateGoryName = data.bean.name
              this.isShowAddGoods = true
            } else {
              this.$message.error(data.msg)
            }  
          })

        }
      })
    },
    // 提交购物车
    submitCart() {
          var param = {
            'major': '通用',
            'describe': '',
            'isParent': 1,
            'choose': null,
            'children': []
          }
          for (var i in this.ruleForm.param) {
            var obj = {}
            obj.major = this.ruleForm.param[i].value
            obj.skuImg = this.ruleForm.param[i].skuImg
            obj.sku = 1 + '' + (parseInt(i)+1)
            param.children.push(obj)
            // param.children.push(this.ruleForm.param[i].value)
          }
          var pictureBanner = []
          var details = []
          for (var i in this.ruleForm.pictureBanner) {
            pictureBanner.push(this.ruleForm.pictureBanner[i].url)
          }
          pictureBanner = pictureBanner.toString()
          param = JSON.stringify(param)
          var selectedProp = JSON.stringify(this.selectedProp)
          console.log(selectedProp)
        //   var information = JSON.stringify(this.ruleForm.information)

        //   var skuList = JSON.stringify(this.tableData)
        //   console.log(skuList)
    
          $.ajax({
            url: baseUrl + 'cart/free/add',
            type: 'POST',
            dataType: 'json',
            data: {
              productId: this.id,
              token: this.token,
              title: this.ruleForm.title,
              sellingPoint: this.ruleForm.sellingPoint,
              basePrice: this.ruleForm.basePrice,
              beforePrice: this.ruleForm.beforePrice,
              param: selectedProp,
              sku: this.selectedSku,
              pictureCover: this.ruleForm.pictureCover,
              num: parseInt(this.ruleForm.num),
              isSeaAmoy: parseInt(this.ruleForm.isSeaAmoy)
            }
          })
          .done((data) => {
            console.log(data)
            if (data.status == 200) {
              this.$message({
                type: "success",
                message: "添加成功"
              })
              this.$router.go(0)
              // https://testimage.prise.shop/images/2018/06/20/1529468254712138.jpg
              this.$router.push({ name: 'ShoppingCar', params: { picture:  'https://testimage.prise.shop/images/2018/06/20/1529468254712138.jpg' } })
            } else {
              this.$message.error(data.msg)
            }
          })
          .fail((data) => {
            console.log(data)
          })
      
    },
    addServes () {
      this.ruleForm.serves.push({
        servesName: ''
      })
    },
    removeServes(item) {
      var index = this.ruleForm.serves.indexOf(item)
      if (index !== -1) {
        this.ruleForm.serves.splice(index, 1)
      }
    },
    removeProps(item) {
      var index = this.ruleForm.param.indexOf(item)
      if (index !== -1) {
        this.ruleForm.param.splice(index, 1)
      }
    },
    addProps() {
      this.ruleForm.param.push({
        value: ''
      })
      console.log(this.ruleForm.param)
    },
    saveProps () {
      var param = {
        'major': '通用',
        'describe': '',
        'isParent': 1,
        'choose': null,
        'children': []
      }
      for (var i in this.ruleForm.param) {
        var obj = {}
        obj.major = this.ruleForm.param[i].value
        obj.skuImg = this.ruleForm.param[i].skuImg
        obj.sku = 1 + '' + (parseInt(i)+1)
        param.children.push(obj)
      }
      this.showPrice = true
      this.tableData = param.children
      // param = JSON.stringify(param)
      // console.log(param)
    },
    handleskuImgSuccess (res, file, list, index) {
      console.log(index)      
      if (res.status == 200) {
        this.tableData[index].skuImg = res.bean      
      }
    },
    removeInfo(item) {
      var index = this.ruleForm.information.indexOf(item)
      if (index !== -1) {
        this.ruleForm.information.splice(index, 1)
      }
    },
    addInfo() {
      this.ruleForm.information.push({
        value: ''
      })
      console.log(this.ruleForm.information)
    },
    saveForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible2 = true
        }   
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var param = {
            'major': '通用',
            'describe': '',
            'isParent': 1,
            'choose': null,
            'children': []
          }
          for (var i in this.ruleForm.param) {
            var obj = {}
            obj.major = this.ruleForm.param[i].value
            obj.skuImg = this.ruleForm.param[i].skuImg
            obj.sku = 1 + '' + (parseInt(i)+1)
            param.children.push(obj)
            // param.children.push(this.ruleForm.param[i].value)
          }
          var pictureBanner = []
          var details = []
          for (var i in this.ruleForm.pictureBanner) {
            pictureBanner.push(this.ruleForm.pictureBanner[i].url)
          }
          for (var i in this.ruleForm.details) {
            details.push(this.ruleForm.details[i].url)
          }
          pictureBanner = pictureBanner.toString()
          details = details.toString()
          param = JSON.stringify(param)
          var information = JSON.stringify(this.ruleForm.information)
          var serves = JSON.stringify(this.ruleForm.serves)
          var skuList = JSON.stringify(this.tableData)
          console.log(skuList)
          var categoryId = this.form.categoryIdSecond != ''?this.form.categoryIdSecond : this.form.categoryId||this.ruleForm.categoryId
          console.log(categoryId)
          $.ajax({
            url: baseUrl + 'product/modify',
            type: 'POST',
            dataType: 'json',
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
              serves: serves
            }
          })
          .done((data) => {
            console.log(data)
            if (data.status == 200) {
              this.$message({
                type: "success",
                message: "修改商品信息成功！"
              })
              this.$router.back(-1)
              // this.$router.go(0)
              // this.$router.push({ path: '/goodsList' })
            } else {
              this.$message.error(data.msg)
            }
          })
          .fail((data) => {
            console.log(data)
          })

          return false
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res, file) {
      if (res.status == 200) {
        this.ruleForm.pictureCover = res.bean
      }
    },
    handleAvatarSuccessBanner(res, file) {
      if (res.status == 200) {
        console.log(res.bean)
        this.ruleForm.pictureBanner.push({
          url: res.bean
        })
        console.log(this.ruleForm.pictureBanner)
      }
    },
    deleteImgUrl (url) {
      $.ajax({
        url: baseUrl + 'picture/remove/file',
        type: 'POST',
        dataType: 'json',
        data: {
          fileName: url
        }
      })
      .done((data) => {
        console.log(data)
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "删除成功"
          })
        } else {
          this.$message.error(data.msg)
        }
      })
      .fail((data) => {
        console.log(data)
      })
    },
    // 移除上传的banner图片
    handleRemoveBanner(file, fileList) {
      console.log(file.url)
      this.ruleForm.pictureBanner = this.ruleForm.pictureBanner.filter(t => t.url != file.url) 
      console.log(this.ruleForm.pictureBanner)
      this.deleteImgUrl(file.url)

      // this.ruleForm.pictureBanner.pop({
      //   url: file.url
      // })
      // console.log(file.url)
      // this.deleteImgUrl(file.url)
    },
    handleAvatarSuccessDetails(res, file) {
      if (res.status == 200) {
        console.log(res.bean)
        this.ruleForm.details.push({
          url: res.bean
        })
        console.log(this.ruleForm.details)
      }
    },
    handleRemove(file, fileList) {
      // this.ruleForm.details.pop({
      //   url: file.url
      // })
      // console.log(this.ruleForm.details)
      // this.deleteImgUrl(file.url)
      
      this.ruleForm.details = this.ruleForm.details.filter(t => t.url != file.url) 
      console.log(this.ruleForm.details)
      this.deleteImgUrl(file.url)
    },
    handlePreview(file) {
      console.log(file)
    }
  },
  created () {
    this.getGoodsInfo()
  }
}
</script>