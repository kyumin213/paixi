<template>
	<section class="el-container wrapper is-vertical">
		<el-row :gutter="20">
			<el-col :span="24">
				<el-table ref="multipleTable" :data="itemList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column label="产品图片" width="120">
						<template slot-scope="scope">
							<!-- {{ scope.row.date }} -->
							<img v-bind:src="scope.row.productPicture" class="product-pic">
						</template>
					</el-table-column>
					<el-table-column prop="name" label="规格" width="120">
						<!-- <template  slot-scope="scope">
                    <span>{{ scope.row.title }}</span>
                </template> -->
						<template slot-scope="scope">
							{{ scope.row.productParamText.propName }}
							<!-- {{ scope.row.productSelling }} -->
						</template>
					</el-table-column>
					<el-table-column prop="address" label="数量" show-overflow-tooltip>
						<template slot-scope="scope">
              <span>{{scope.row.num}}</span>
							<!-- <el-input-number v-model="scope.row.num" @change="handleChange(scope.row)" :min="1"></el-input-number> -->
						</template>
					</el-table-column>
					<el-table-column label="操作" width="600">
						<template slot-scope="scope">
							<el-button size="mini" @click="deleteGoods(scope.$index, scope.row)" type="danger">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="16">
				<h1 style="margin-top:100px">选择游戏方式</h1>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="吐槽送礼" name="first">
						<!-- <el-row :gutter="20">
							<el-col :span="2">
								活动时间
							</el-col>
							
							<el-col :span="10">
								<div class="span-block">
									<span v-for="(item, index) in fuckTimeArr" :key="index" v-bind:class="[index == currentTimeFuck ? 'onon' : '']" v-on:click="switchTimeFuck(index)">
                        {{item}}
                      </span>
								</div>
							</el-col>
						</el-row> -->
						<el-row style="margin-top:20px;">
							<el-col :span="3">
								活动主题名称
							</el-col>
							<el-col :span="10">
								<el-input v-model="fuckRemarks"></el-input>
							</el-col>
						</el-row>
						<el-row style="margin-top:20px;">
							<el-col :span="3">
								活动礼品名称
							</el-col>
							<el-col :span="10">
								<el-input v-model="fuckRemarkTitle"></el-input>
							</el-col>
						</el-row>
						<el-row style="margin-top:20px;">
							<el-col :span="3">
								活动礼品描述
							</el-col>
							<el-col :span="10">
								<el-input v-model="fuckRemarkBody"></el-input>
							</el-col>
						</el-row>
						<el-row style="margin-top:30px;">
							<el-col :span="3">
								活动开始时间
							</el-col>
							<el-col :span="10">
								<el-date-picker
									v-model="beginTime"
									type="datetime"
									@change="getTimeBeginTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择活动开始时间">
								</el-date-picker>
							</el-col>
						</el-row>
            <el-row style="margin-top:30px;">
							<el-col :span="3">
								活动结束时间
							</el-col>
							<el-col :span="10">
								<el-date-picker
									v-model="endTime"
									type="datetime"
									@change="getTimeEndTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择活动结束时间">
								</el-date-picker>
							</el-col>
						</el-row>
							
					</el-tab-pane>
					<el-tab-pane label="拼图送礼" name="second">
						<el-row :gutter="20" style="margin-bottom:20px;">
							<el-col :span="2">
								选择图片
							</el-col>
							<el-col :span="10">
								<img v-bind:src="productPicture" class="product-pic" v-if="productPicture" v-on:click="gotoGallery">
								<el-button size="mini" v-on:click="gotoGallery" v-else>去图库选图</el-button>
							</el-col>
						</el-row>
						<el-row :gutter="20" style="margin-bottom:20px;">
							<el-col :span="2">
								拼图数量
							</el-col>
							<el-col :span="10">
								<div class="span-block">
									<span v-for="(item, index) in pintuNumArr" :key="index" v-bind:class="[index == currentKeyPintu ? 'onon' : '']" v-on:click="switchKeyPintu(index)">
                        {{item}}
                      </span>
								</div>
							</el-col>
						</el-row>
						<el-row style="margin-top:30px;">
							<el-col :span="3">
								活动开始时间
							</el-col>
							<el-col :span="10">
								<el-date-picker
									v-model="beginTime"
									type="datetime"
									@change="getTimeBeginTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择活动开始时间">
								</el-date-picker>
							</el-col>
						</el-row>
            <el-row style="margin-top:30px;">
							<el-col :span="3">
								活动结束时间
							</el-col>
							<el-col :span="10">
								<el-date-picker
									v-model="endTime"
									type="datetime"
									@change="getTimeEndTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择活动结束时间">
								</el-date-picker>
							</el-col>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label="答题送礼" name="third">
						<el-row :gutter="20" style="margin-bottom:20px;">
							<el-col :span="2">
								问题数量
							</el-col>
							<el-col :span="10">
								<div class="span-block">
									<span v-for="(item, index) in answerNumArr" :key="index" v-bind:class="[index == currentKeyAnswer ? 'onon' : '']" v-on:click="switchKeyAnswer(index)">
                        {{item}}
                      </span>
								</div>
							</el-col>
						</el-row>

						<el-row style="margin-top:30px;">
							<el-col :span="3">
								活动开始时间
							</el-col>
							<el-col :span="10">
								<el-date-picker
									v-model="beginTime"
									type="datetime"
									@change="getTimeBeginTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择活动开始时间">
								</el-date-picker>
							</el-col>
						</el-row>
            <el-row style="margin-top:30px;">
							<el-col :span="3">
								活动结束时间
							</el-col>
							<el-col :span="10">
								<el-date-picker
									v-model="endTime"
									type="datetime"
									@change="getTimeEndTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择活动结束时间">
								</el-date-picker>
							</el-col>
						</el-row>
					</el-tab-pane>
          <el-tab-pane label="摇骰子送礼" name="four">
            <el-row style="margin-top:30px;">
							<el-col :span="3">
								活动开始时间
							</el-col>
							<el-col :span="10">
								<el-date-picker
									v-model="beginTime"
									type="datetime"
									@change="getTimeBeginTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择活动开始时间">
								</el-date-picker>
							</el-col>
						</el-row>
            <el-row style="margin-top:30px;">
							<el-col :span="3">
								活动结束时间
							</el-col>
							<el-col :span="10">
								<el-date-picker
									v-model="endTime"
									type="datetime"
									@change="getTimeEndTime"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择活动结束时间">
								</el-date-picker>
							</el-col>
						</el-row>
          </el-tab-pane>
				</el-tabs>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col :span="2">
				<el-button size="mini" @click="gotoGoodslist" type="primary">继续选购</el-button>
			</el-col>
			<el-col :span="2">
				<el-button size="mini" @click="submitOrder" type="danger">提交订单</el-button>
			</el-col>
		</el-row>

	</section>
</template>
<style>
.span-block span {
  padding: 5px 20px;
  background: #eee;
  color: #666;
  margin-right: 10px;
  cursor: pointer;
}

.span-block .onon {
  background: #f00;
  color: #fff;
}

.el-tabs__content {
  height: 400px;
}

.product-pic {
  width: 100px;
  height: 100px;
}

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

.el-carousel__item,
.el-carousel__container {
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

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<script>
import { baseUrl } from "@/config/env";
import { baseImgPath } from "@/config/env";
import { getStore } from "@/config/mUtils";
export default {
  name: "ShoppingCar",
  data() {
    return {
      beginTime: '',
      endTime: '',
      productPicture: this.$route.params.picture,
      answerNumArr: [10, 15, 20],
      answerTimeArr: [1, 2, 3, 4, 5, 6, 7],
      pintuTimeArr: [1, 2, 3, 4, 5, 6, 7],
      fuckTimeArr: [1, 2, 3, 4, 5, 6, 7],
      diceTimeArr: [1, 2, 3, 4, 5, 6, 7],
      pintuNumArr: ["4x4","5x5", "6x6", "7x7"],
      productPrice: "",
      activeName: "first",
      itemList: [],
      currentKeyAnswer: 0,
      currentKeyPintu: 0,
      currentTimeFuck: 6,
      currentTimePintu: 6,
      currentTimeAnswer: 6,
      currentTimeDice: 6,
      addressWay: 5,
      token: getStore("token"),
      isShowSecond: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      uploadUrl: baseImgPath + 'picture/oss/upload/multi',
      id: this.$route.params.id,
      showPrice: false,
      tableData: [],
      templateData: "",
      activityTime: "",
      fuckRemarks: "",
      fuckRemarkTitle: "",
      pintuRemarkTitle: "",
      answerRemarkTitle: "",
      fuckRemarkBody: "",
      pintuRemarkBody: "",
      answerRemarkBody: "",
      upLoadData: {
        token: getStore("token")
        // fileName: 'http://image.prise.shop/images/2018/04/03/1522736335352510.png'
      },
      selectedSku: "",
      selectedSkuValue: "",
      currentNav: 0,
      ruleForm: {
        num: 1,
        title: "",
        cateGoryName: "",
        sellingPoint: "",
        basePrice: "",
        isSeaAmoy: "",
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
        details: []
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入商品标题",
            trigger: "blur"
          }
        ],
        sellingPoint: [
          {
            required: true,
            message: "请输入商品介绍",
            trigger: "blur"
          }
        ],
        basePrice: [
          {
            required: true,
            message: "请输入商品现价",
            trigger: "blur"
          }
        ],
        beforePrice: [
          {
            required: true,
            message: "请输入商品原价",
            trigger: "blur"
          }
        ],
        pictureCover: [
          {
            required: true,
            message: "请上传封面图"
          }
        ],
        pictureBanner: [
          {
            required: true,
            message: "请上传banner图"
          }
        ],
        details: [
          {
            required: true
          }
        ],
        isSeaAmoy: [
          {
            required: true
          }
        ],
        param: [
          {
            required: true,
            message: "请输入商品属性"
          }
        ],
        information: [
          {
            required: true,
            message: "请输入商品基本信息"
          }
        ],
        serves: [
          {
            required: true,
            message: "请输入商品服务承诺"
          }
        ]
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
    switchTimeFuck(index) {
      this.currentTimeFuck = index;
    },
    switchTimePintu(index) {
      this.currentTimePintu = index;
    },
    switchTimeAnswer(index) {
      console.log(index);
      this.currentTimeAnswer = index;
    },
    switchTimeDice(index) {
      this.currentTimeDice = index
    },
    switchKeyAnswer(index) {
      this.currentKeyAnswer = index;
    },
    switchKeyPintu(index) {
      this.currentKeyPintu = index;
    },
    gotoGallery() {
      console.log("hh");
      this.$router.push({
        path: "/JigsawPuzzleList"
      });
    },
    // 送礼方式切换
    handleClick(tab, event) {
      console.log(tab, event, tab.index);
      if (tab.index == 3) {
        var addressWay = 9
      } else {
        var addressWay = parseInt(tab.index) + 5; 
      }
      this.addressWay = addressWay;
    },
    // 提交订单
    submitOrder() {
      console.log(this.activityTime);
      console.log(this.addressWay)
      var keys = null;
      var endDays = null;
      var remarkTitle = null;
      var remarkBody = null;
	    var remarks = null;
	    console.log("活动"+this.addressWay)
      if (this.addressWay == 5) {
        remarkTitle = this.fuckRemarkTitle;
		    remarkBody = this.fuckRemarkBody;
        endDays = this.currentTimeFuck + 1;
      } else if (this.addressWay == 6) {
        if (this.currentKeyPintu == 0) {
          keys = 4;
        } else if (this.currentKeyPintu == 1) {
          keys = 5;
        } else if (this.currentKeyPintu == 2) {
          keys = 6;
        } else if (this.currentKeyPintu == 3) {
          keys = 7;
        }
        remarkTitle = this.pintuRemarkTitle;
        remarkBody = this.pintuRemarkBody;
        endDays = this.currentTimePintu + 1;
      } else if (this.addressWay == 7) {
        remarkTitle = this.answerRemarkTitle;
        remarkBody = this.answerRemarkBody;
        keys = this.answerNumArr[this.currentKeyAnswer];
        endDays = this.currentTimeAnswer + 1;
      } else if (this.addressWay == 9) {
        endDays = this.currentTimeDice + 1;
      }
      var jigsawPicture = this.productPicture || "";
      console.log(keys, endDays);
      $.ajax({
        url: baseUrl + "orders/free/submit",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          priceTotal: this.productPrice,
          addressWay: this.addressWay,
          keys: keys,
          jigsawPicture: jigsawPicture,
          // endDays: endDays,
          remarkTitle: remarkTitle,
          remarkBody: remarkBody,
          beginTime: this.beginTime,
          endTime: this.endTime,
          // dateExpectStr: this.activityTime,
          remarks: this.fuckRemarks,
        }
      })
      .done(data => {
        console.log(data);
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "提交成功"
          });
          this.$router.go(0);
        } else {
          this.$message.error(data.msg);
        }
      })
      .fail(data => {
        console.log(data);
      });
    },
    // 继续选购
    gotoGoodslist() {
      this.$router.push({
        path: "/goodsList"
      });
    },
    // 删除商品
    deleteGoods(index, row) {
      var id = row.id;
      $.ajax({
        url: baseUrl + "cart/free/remove",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          id: id
        }
      })
        .done(data => {
          console.log(data);
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            // 更新列表
            this.getcarList();
          } else {
            this.$message.error(data.msg);
          }
        })
        .fail(data => {
          console.log(data);
        });
    },
    //获取活动时间
    getTime(date) {
      this.activityTime = date;
    },
    getTimeEndTime (date) {
      this.endTime = date;
    },
    getTimeBeginTime (date) {
      this.beginTime = date;
    },
    // 选择sku
    changeSku(e) {
      this.selectedSku = e.sku;
      this.selectedSkuValue = e.major;
      console.log(this.selectedSku);
    },
    handleChange(row) {
      console.log(row)
      console.log(row.num)
      var id = row.id;
      this.ruleForm.num = row.num;
      this.modifyNum(id, row.num);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 获取购物车列表
     */
    getcarList() {
      $.get(
        baseUrl + "cart/free/get",
        {
          token: this.token
        },
        data => {
          if (data.status == 200) {
            console.log(data.bean);
            this.itemList = data.bean.itemList;
            var itemList = data.bean.itemList;
            this.productPrice = data.bean.productPrice;
            var param = {};
            for (var i in itemList) {
              param.propName = JSON.parse(
                itemList[i].productParamText
              ).propName;
              this.itemList[i].productParamText = param;
            }
          }
        }
      );
    },
    /**
     * 删减数量
     */
    modifyNum(id, num) {
      $.ajax({
        url: baseUrl + "cart/free/modify/num",
        type: "POST",
        dataType: "json",
        data: {
          token: this.token,
          id: id,
          num: num
        }
      })
      .done(data => {
        console.log(data);
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "修改成功"
          });
        } else {
          this.$message.error(data.msg);
        }
      })
      .fail(data => {
        console.log(data);
      });
    },
    getGoodsInfo() {
      $.get(
        baseUrl + "product/get/id",
        {
          token: this.token,
          id: this.id
        },
        data => {
          if (data.status == 200) {
            console.log(data.bean);
            this.ruleForm.title = data.bean.title;
            this.ruleForm.basePrice = data.bean.basePrice;
            this.ruleForm.beforePrice = data.bean.beforePrice;
            this.ruleForm.sellingPoint = data.bean.sellingPoint;
            this.ruleForm.pictureCover = data.bean.pictureCover;
            this.ruleForm.isSeaAmoy = data.bean.isSeaAmoy.toString();
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
            this.selectedSku = this.tableData[0].sku;
            this.selectedSkuValue = this.tableData[0].major;
            this.ruleForm.categoryId = data.bean.categoryId;
            this.ruleForm.serves = JSON.parse(data.bean.serves);
            $.get(
              baseUrl + "product/category/get",
              {
                token: this.token,
                id: this.ruleForm.categoryId
              },
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
    // 提交购物车
    submitCart() {
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
      pictureBanner = pictureBanner.toString();
      param = JSON.stringify(param);
      $.ajax({
        url: baseUrl + "cart/free/add",
        type: "POST",
        dataType: "json",
        data: {
          productId: this.id,
          token: this.token,
          title: this.ruleForm.title,
          sellingPoint: this.ruleForm.sellingPoint,
          basePrice: this.ruleForm.basePrice,
          beforePrice: this.ruleForm.beforePrice,
          param: param,
          sku: this.selectedSku,
          pictureCover: this.ruleForm.pictureCover,
          num: parseInt(this.ruleForm.num),
          isSeaAmoy: parseInt(this.ruleForm.isSeaAmoy)
        }
      })
        .done(data => {
          console.log(data);
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "添加成功"
            });
            // this.$router.go(0)
            // this.$router.push({ path: '/goodsList' })
          } else {
            this.$message.error(data.msg);
          }
        })
        .fail(data => {
          console.log(data);
        });
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
              serves: serves
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
    deleteImgUrl(url) {
      $.ajax({
        url: baseUrl + "picture/remove/file",
        type: "POST",
        dataType: "json",
        data: {
          fileName: url
        }
      })
        .done(data => {
          console.log(data);
          if (data.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
          } else {
            this.$message.error(data.msg);
          }
        })
        .fail(data => {
          console.log(data);
        });
    },
    // 移除上传的banner图片
    handleRemoveBanner(file, fileList) {
      console.log(file.url);
      this.ruleForm.pictureBanner = this.ruleForm.pictureBanner.filter(
        t => t.url != file.url
      );
      console.log(this.ruleForm.pictureBanner);
      this.deleteImgUrl(file.url);

      // this.ruleForm.pictureBanner.pop({
      //   url: file.url
      // })
      // console.log(file.url)
      // this.deleteImgUrl(file.url)
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
      this.ruleForm.details = this.ruleForm.details.filter(
        t => t.url != file.url
      );
      console.log(this.ruleForm.details);
      this.deleteImgUrl(file.url);
    },
    handlePreview(file) {
      console.log(file);
    }
  },
  created() {
    // this.getGoodsInfo()
    this.getcarList();
    console.log(this.productPicture);
    console.log(this.$route.params.picture);
  },
  mounted() {
    console.log("mounted");
  },
  beforeUpdate() {
    console.log("beforeUpdate");
    console.log("beforeUpdate" + this.activityTime);
  }
};
</script>