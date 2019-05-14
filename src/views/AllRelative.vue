<template>
      <div>
       <!-- <div class="block">
        <el-row>
          <el-button type="primary" class="addBtns"  @click="addInfoModel()">添加活动规则</el-button>
        </el-row>
      </div> -->
    <div>
        <el-table :data="relativeData" border style="width: 100%">
          <el-table-column prop="id" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="title" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="newestPrice" label="价格" align="center"></el-table-column>
          <el-table-column prop="stock" label="库存" align="center" width="100"></el-table-column>
          <el-table-column prop="sales" label="销量" align="center" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" align="center"  width="100" :formatter="statusTxt"></el-table-column>
          <el-table-column prop="updated" label="更新时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="340">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleAddGoods(scope.$index,scope.row)">添加商品</el-button>
              <!-- <el-button size="small" @click="handleEditInterval(scope.$index,scope.row)">编辑</el-button> -->
              <el-button size="small" type="danger" @click="handleDeleRelative(scope.$index,scope.row)">删除</el-button>
              <el-button size="small" type="primary" @click="handleEditPrice(scope.$index,scope.row)">修改价格</el-button>
              <el-button size="small" type="success" @click="handleAddInterval(scope.$index,scope.row)">添加区间</el-button>
              <el-button size="small" type="warning" class="mt" @click="handleViewInterval(scope.$index,scope.row)">查看区间</el-button>
              <el-button size="small" type="danger" @click="handleDelInterval(scope.$index,scope.row)">删除区间</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <!-- 修改价格弹窗 -->
        <el-dialog title="修改价格" :visible.sync="EditPriceModel" :close-on-click-modal="false" width="30%">
            <el-form :model="priceForm"  ref="priceForm" label-width="80px" class="demo-forms">
                <el-form-item label="商品名称">
                    <el-input v-model="productName" :disabled="true"></el-input>
                </el-form-item>
            <el-form-item label="价格">
                <el-input v-model="priceForm.newestPrice" placeholder="价格"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="priceFormSub">确定</el-button>
                <el-button @click="EditPriceModel=false">取消</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
      <!-- 添加砍价区间 -->
      <el-dialog title="添加区间" :visible.sync="addIntervalModel" :close-on-click-modal="false" width="35%">
          <el-form :model="intervalForm" label-width="80px" class="demo-forms">
            <el-form-item label="商品名称">
                <el-input v-model="productName" :disabled='true'></el-input>
            </el-form-item>
            <div v-for="(item,index) in intervalForm.intervalList" :key="index">
                <el-form-item label="区间">
                    <el-col :span="1"><span>{{index+1}}</span></el-col>
                    <el-col :span='7'><span>最大值</span><el-input v-model="item.maxValue" placeholder="最大值"></el-input></el-col>
                    <el-col :span='7'><span>最小值</span><el-input v-model="item.minValue" placeholder="最小值"></el-input></el-col>
                    <el-col :span='5'><span>占比(%)</span><el-input v-model="item.proportion" placeholder="占比"></el-input></el-col>
                    <el-col :span="4" style="text-align:right"><el-button type="danger" :disabled="disabled" style="margin-top:40px" @click="deleInterval(index,item)">删除</el-button></el-col>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button type="primary" size="small" @click="addInterval()">新增区间</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="intervalForms">确定</el-button>
                <el-button @click="addIntervalModel=false">取消</el-button>
            </el-form-item>
          </el-form>
      </el-dialog>
      <!-- 商品列表 -->
     <el-dialog title="商品列表" :visible.sync="addGoodsModel" :close-on-click-modal="false" width="85%">
        <el-row style="height:100%;">
      <!-- 按编号搜索 -->
           <el-col :span="4">
              <el-input v-model="goodsId" placeholder="商品编号" @blur="goodsFilter" style="width:80%;"></el-input>
           </el-col>
      <!-- 按名称搜索 -->
           <el-col :span="4">
        <!-- multiple -->
           <el-input v-model="goodsTitle" placeholder="商品名称" @blur="goodsFilter" style="width:80%;"></el-input>        
           </el-col>
      <!-- 按卖点搜索 -->
           <el-col :span="4">
        <!-- multiple -->
             <el-input v-model="goodsSellpoint" placeholder="商品卖点" @blur="goodsFilter" style="width:80%;"></el-input>        
           </el-col>
      <!-- 按状态搜索 -->
       <el-col :span="4">
        <el-select v-model="statusvalue" placeholder="全部状态" @change="goodsFilter">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
       </el-row>
        <div class="block">
        <el-row>
          <el-button type="primary" class="mt" style="margin-bottom:10px"  @click="addMoreGoods()">批量添加</el-button>
        </el-row>
      </div>
        <el-table :data="allGoodsData" border style="width: 100%" @selection-change="handleSelectionChange">
           <el-table-column
             type="selection"
              width="55">
          </el-table-column>
          <el-table-column prop="id" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="title" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="beforePrice" label="优惠价" align="center"></el-table-column>
          <el-table-column prop="basePrice" label="原价" align="center"></el-table-column>
          <el-table-column prop="stock" label="库存" align="center" width="100"></el-table-column>
          <el-table-column prop="sales" label="销量" align="center" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" align="center"  width="100" :formatter="statusTxt"></el-table-column>
          <el-table-column prop="updated" label="更新时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="primary" @click="handleAdd(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin:50px auto;">
         <el-pagination
        @current-change="handleCurrentChangeQuery"  
        :current-page="currentPage"
        :page-size="10"  
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
   </el-dialog>
    <!-- 删除弹窗 -->
      <el-dialog title="温馨提示" :visible.sync="deleteVisible" center width="30%">
        <div class="del-dialog-cnt" style="text-align:center">是否确定删除</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible=false">取消</el-button>
          <el-button type="primary" @click="deleteRelativeGoods" v-if="goodsShow">确定</el-button>
          <el-button type="primary" @click="deleteRelativeList" v-else>确定2</el-button>
        </span>
      </el-dialog>
      <!-- 区间列表 -->
      <el-dialog title="区间列表" :visible.sync="intervalListVisible" center width="60%" :close-on-click-modal="false">
          <el-table :data="intervalListData" border style="width:100%">
            <el-table-column label="商品ID" prop="productId"></el-table-column>
            <el-table-column label="最大值(元)" prop="maxValue"></el-table-column>
            <el-table-column label="最小值(元)" prop="minValue"></el-table-column>
            <el-table-column label="占比%" prop="proportion"></el-table-column>
            <el-table-column label="创建时间" prop="created"></el-table-column>
          </el-table>
      </el-dialog>
    </div>
</template>
<script>
import { baseUrl } from "@/config/env";
import { baseImgPath } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { getStore } from "@/config/mUtils";
export default {
  name: "AllRelative",
  data() {
    return {
      relativeData: [],
      allGoodsData: [],
      intervalListData: [], //区间列表
      token: getStore("token"),
      bargaininfoId: this.$route.params.id,
      ids: "",
      productId: "",
      productName: "",
      total: 0,
      currentPage: 1,
      goodsTitle: "",
      goodsSellpoint: "",
      goodsId: "",
      statusvalue: "",
      disabled: true,
      deleteVisible: false,
      goodsShow: false,
      multipleSelection: [],
      moreAdds: [],
      intervalListVisible: false, //区间列表
      addGoodsModel: false, //添加活动商品
      addIntervalModel: false, //添加区间
      EditPriceModel: false, //修改价格弹窗
      priceForm: {
        newestPrice: ""
      },
      options: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: "0",
          label: "下架"
        },
        {
          value: "1",
          label: "上架"
        }
      ],
      arrayList: [],
      intervalForm: {
        intervalList: [
          {
            maxValue: "",
            minValue: "",
            proportion: ""
          }
        ]
      }
    };
  },
  created() {
    let _this = this;
    _this.getAllRelative();
  },
  watch: {
    $route(to, from) {
      if (from.path === "/BargainInfo") {
        this.id = to.params.id;
        this.getAllRelative();
      }
    }
  },
  methods: {
    //   删除区间弹窗
    handleDelInterval(index, row) {
      let _this = this;
      _this.productId = row.id;
      _this.goodsShow = false;
      _this.deleteVisible = true;
    },
    // 删除区间
    deleteRelativeList() {
      let _this = this;
      $.ajax({
        url: baseUrl + "/bargain/info/product/interval/delete",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.token,
          productId: _this.productId
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "删除成功"
            });
            _this.getAllRelative();
            _this.deleteVisible = false;
          } else {
            _this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    //   查看区间
    handleViewInterval(index, row) {
      let _this = this;
      _this.intervalListVisible = true;
      $.get(
        baseUrl + "/bargain/info/get/interval",
        { token: _this.token, productId: row.id },
        data => {
          if (data.status == 200) {
            _this.intervalListData = data.bean;
          } else {
            console.log(data.msg);
          }
        }
      );
    },
    // 商品列表编辑
    handleEdit(index, row) {
      let _this = this;
      _this.addGoodsModel = false;
      _this.$router.push({ path: `/EditGoods${row.id}` });
    },
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      console.log(val);
      this.goodsFilterFun(
        val,
        this.statusvalue,
        this.goodsId,
        this.goodsTitle,
        this.goodsSellpoint
      );
    },
    // 删除一个活动商品弹窗
    handleDeleRelative(index, row) {
      let _this = this;
      _this.deleteVisible = true;
      _this.goodsShow = true;
      _this.ids = row.id;
    },
    // 删除活动商品
    deleteRelativeGoods() {
      let _this = this;
      $.ajax({
        url: baseUrl + "/bargain/info/delete",
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
            _this.getAllRelative();
            _this.deleteVisible = false;
          } else {
            _this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    // 添加单个商品
    handleAdd(index, row) {
      let _this = this;
      let productId = row.id;
      let basePrice = row.beforePrice;
      let bargaininfoId = _this.bargaininfoId;
      $.ajax({
        url: baseUrl + "/bargain/info/product/add",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.token,
          bargaininfoId: bargaininfoId,
          productId: productId,
          basePrice: basePrice.toString()
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "添加成功"
            });
            _this.addGoodsModel = false;
            _this.getAllRelative();
          } else {
            _this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    // 批量添加
    addMoreGoods() {
      let _this = this;
      let lists = _this.multipleSelection;
      for (let i = 0; i < lists.length; i++) {
        _this.moreAdds.push(lists[i].id);
      }
      let productId = _this.moreAdds;
      console.log(productId);
      let basePrice = "1.00";
      let bargaininfoId = _this.bargaininfoId;
      console.log(bargaininfoId);
      $.ajax({
        url: baseUrl + "/bargain/info/product/adds",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.token,
          bargaininfoId: bargaininfoId,
          productId: productId.toString(),
          basePrice: basePrice.toString()
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "添加成功"
            });
            _this.addGoodsModel = false;
            _this.getAllRelative();
          } else {
            _this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    //
    //  获取砍价商品列表
    getAllRelative() {
      let _this = this;
      let bargaininfoId = this.$route.params.id;
      console.log(bargaininfoId);
      $.get(
        baseUrl + "/bargain/info/get/relative/all",
        { token: _this.token, bargaininfoId: bargaininfoId },
        data => {
          if (data.status == 200) {
            _this.relativeData = data.bean;
          } else {
            console.log(data.msg);
          }
        }
      );
    },
    // 状态转文字
    statusTxt(val) {
      if (val.status === 1) {
        return "上架";
      }
      if (val.status === 0) {
        return "下架";
      }
    },
    // 活动商品列表
    handleAddGoods(index, row) {
      let _this = this;
      _this.ids = row.id;
      _this.addGoodsModel = true;
      this.goodsFilterFun(
        1,
        this.statusvalue,
        this.goodsId,
        this.goodsTitle,
        this.goodsSellpoint
      );
    },
    goodsFilter() {
      // console.log(this.valueDate)
      this.goodsFilterFun(
        1,
        this.statusvalue,
        this.goodsId,
        this.goodsTitle,
        this.goodsSellpoint
      );
    },
    goodsFilterFun(pageBegin, status, id, title, sellPoint) {
      let _this = this;
      $.get(
        baseUrl + "product/get/filter/all",
        {
          token: _this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          status: status,
          id: id,
          title: title,
          sellingPoint: sellPoint
        },
        data => {
          console.log(data);
          if (data.status == 200) {
            _this.allGoodsData = data.bean;
            if (_this.allGoodsData) {
              _this.allGoodsData.sort(compareDown("updated"));
            }
            _this.total = data.total;
          }
        }
      );
    },
    handleSelectionChange(val) {
      let _this = this;
      _this.multipleSelection = val;
    },
    // 新增一条区间
    addInterval() {
      let _this = this;
      let lists = _this.intervalForm.intervalList;
      lists.push({
        maxValue: "",
        minValue: "",
        proportion: ""
      });
      if (lists == 1) {
        _this.disabled = true;
      } else {
        _this.disabled = false;
      }
      console.log(_this.intervalForm.intervalList);
    },
    // 删除一条区间
    deleInterval(index, item) {
      let _this = this;
      console.log(index);
      let lists = _this.intervalForm.intervalList;
      _this.index = lists.indexOf(item);

      if (index !== -1) {
        lists.splice(index, 1);
      }
      if (lists.length == 1) {
        _this.disabled = true;
      } else {
        _this.disabled = false;
      }
    },
    // 添加区间弹窗
    handleAddInterval(index, row) {
      let _this = this;
      _this.productId = row.id;
      console.log(row.id);
      _this.productName = row.title;
      _this.addIntervalModel = true;
    },
    // 添加区间确定
    intervalForms() {
      let _this = this;
      let productId = _this.productId;
      let array = _this.intervalForm.intervalList;
      var a = JSON.stringify(array);
      console.log(a);
      var b = "";
      for (let x in array) {
        var v1 = array[x].maxValue;
        var v2 = array[x].minValue;
        var v3 = array[x].proportion;
        b += ";" + v1 + "," + v2 + "," + v3;
      }
      b = b.substring(1);
      console.log(b);
      //   for (let i = 0; i < array.length; i++) {
      //     _this.arrayList.push(
      //       array[i].maxValue,
      //       array[i].minValue,
      //       array[i].proportion
      //     );
      //   }
      let lists = _this.arrayList;
      $.ajax({
        url: baseUrl + "/bargain/info/product/interval/adds",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.token,
          productId: productId,
          arrayList: b
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "添加成功"
            });
            _this.addIntervalModel = false;
          } else {
            _this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    // 修改价格弹窗
    handleEditPrice(index, row) {
      let _this = this;
      _this.EditPriceModel = true;
      _this.productId = row.id;
      _this.productName = row.title;
      _this.priceForm.newestPrice = row.newestPrice;
    },
    // 修改价格确定
    priceFormSub() {
      let _this = this;
      let bargaininfoId = _this.bargaininfoId;
      let productId = _this.productId;
      let newestPrice = _this.priceForm.newestPrice;
      $.ajax({
        url: baseUrl + "/bargain/info/update/newest/price",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.token,
          bargaininfoId: bargaininfoId,
          productId: productId,
          newestPrice: newestPrice
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "修改成功"
            });
            _this.EditPriceModel = false;
            _this.getAllRelative();
          } else {
            _this.$message.error(data.msg);
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
.mt {
  margin-top: 10px;
}
</style>
