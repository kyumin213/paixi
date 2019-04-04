<template>
  <section class="el-container wrapper is-vertical">
  
      <!-- 弹出层 保存参数 -->

      <!-- 添加商品布局 -->
      <div class="add-contanier">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">

            <el-form-item label="模板名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <!-- Todo 商品属性 动态添加 -->
            <el-form-item :label="'商品属性'" prop="param" class="goodsProps" >
              <div v-for="(item, index) in ruleForm.param" :prop="'item.' + index + '.value'" :key="item.key" class="prop-box">
                  <el-input v-model="item.value" placeholder="请输入属性名"></el-input>
                  <el-button @click.prevent="removeProps(item)">删除</el-button>
              </div>
              <i class="el-icon-plus addBtn"  @click="addProps"></i>
              <!-- <el-button @click="saveProps" class="saveBtn">确认保存</el-button> -->
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="submitForm('ruleForm')">确认修改</el-button>
              <!-- <el-button type="success" @click="saveForm('ruleForm')">保存模板</el-button> -->
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
.addBtn{
  cursor: pointer;
  color: #409eff;
  font-size: 24px;
  font-weight: bold;
}
.addgoods{
  margin-top: 20px;
}
.el-dialog{
  width: 30%;
}
.add-contanier {
  margin-top: 20px;
}
.goodsProps .el-input {
  width: 80%;
}
.prop-box {
  /* display: inline-block; */
  width: 30%;
  margin-bottom: 10px;
}
.goodsInfo .el-input {
  width: 40%;
}
.info-box{
  /* display: inline-block; */
  width: 40%;
  margin-bottom: 10px;
}

</style>

<script>
import { baseUrl } from '@/config/env'
import { getStore } from '@/config/mUtils'
export default {
  name: 'EditTemplate',
  data() {
    return {
      token: getStore('token'),
      id: this.$route.params.id,
      showPrice: false,
      tableData: [],
      templateData: '',
      ruleForm: {
        param: [],
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    getTemplateInfo () {
      $.get(baseUrl + 'product/template/get', {token: this.token, id: this.id}, (data) => {
        if (data.status == 200) {
          this.ruleForm.name = data.bean.name
          var paramArr = JSON.parse(data.bean.templateData).children
          for (var i in paramArr) {
            this.ruleForm.param.push({
              value: paramArr[i].major
            })
          }
          console.log(this.ruleForm.param)
        }
      })
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
        obj.sku = 1 + '' + (parseInt(i)+1)
        param.children.push(obj)
      }
      this.showPrice = true
      this.tableData = param.children
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
          var skuList = JSON.stringify(this.tableData)
          // console.log(skuList)

          $.ajax({
            url: baseUrl + 'product/template/modify',
            type: 'POST',
            dataType: 'json',
            data: {
              id: this.id,
              token: this.token,
              templateData: param,
              name: this.ruleForm.name
            }
          })
          .done((data) => {
            console.log(data)
            if (data.status == 200) {
              this.$message({
                type: "success",
                message: "修改模板信息成功！"
              })
              this.$router.go(0)
              this.$router.push({ path: '/templateList' })
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
    }    
  },
  created () {
    this.getTemplateInfo()
  }
}
</script>