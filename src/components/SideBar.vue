<template>
    <el-col :span="3">
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo" router>
      <!-- <el-menu-item index="home">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item> -->
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-goods"></i>
          <span>商品管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="goodsList">商品列表</el-menu-item> 
          <el-menu-item index="addGoods">添加商品</el-menu-item>    
          <!-- <el-menu-item index="LabelManager">标签管理</el-menu-item> -->
          <el-menu-item index="categoryList">分类列表</el-menu-item>          
          <el-menu-item index="addCategory">添加分类</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-star-off"></i>
          <span slot="title">专题管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="themeList">专题列表</el-menu-item>
          <el-menu-item index="createTheme">创建专题</el-menu-item>
          <el-menu-item index="AddLabel">添加专题标签</el-menu-item>
          <!-- <el-menu-item index="LabelList">专题标签列表</el-menu-item> -->
          <el-menu-item index="banner">首页封面</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-sold-out"></i>
          <span slot="title">订单管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="orderList">商城订单列表</el-menu-item>
          <el-menu-item index="OrderListAnalyse">送礼数据分析</el-menu-item>
          <el-menu-item index="OrderListqiaoqiao">悄悄送礼订单列表</el-menu-item>
          <el-menu-item index="OrdersListOpenBox">开箱送礼订单列表</el-menu-item>
          <el-menu-item index="OrdersListPuzzle">拼图送礼订单列表</el-menu-item>
          <el-menu-item index="OrdersListInterlocution">问答送礼订单列表</el-menu-item>
          <el-menu-item index="OrdersListGroupGifts">群收礼订单列表</el-menu-item>
          <el-menu-item index="OrdersListDice">摇骰子订单列表</el-menu-item>
          <el-menu-item index="OrdersListDirect">直接送订单列表</el-menu-item>
          <el-menu-item index="OrdersListFreeActivity">免费活动订单列表</el-menu-item>
          <!-- <el-menu-item index="OrdersListPintuActivity">拼图活动订单列表</el-menu-item>
          <el-menu-item index="OrdersListAnswerActivity">问答活动订单列表</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-view"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="paixiUserList">用户列表</el-menu-item> 
          <el-menu-item index="feedbacks">意见反馈</el-menu-item> 
          <el-menu-item index="GiftCardList">礼品卡管理</el-menu-item>
          <el-menu-item index="RechargeCardList">充值卡管理</el-menu-item>
          <el-menu-item index="VIPaccounts">充值卡会员账户</el-menu-item>
          <el-menu-item index="VIPtranFlow">充值卡交易流水</el-menu-item>       
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span>文章管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="articleList">文章列表</el-menu-item> 
          <el-menu-item index="addArticle">新增文章</el-menu-item> 
          <el-menu-item index="AddRecruit">新增招聘</el-menu-item> 
          <el-menu-item index="RecruitList">招聘列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="7">
        <template slot="title">
          <i class="el-icon-picture-outline"></i>
          <span>图库管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="dis" index="JigsawPuzzleList">拼图列表</el-menu-item>
          <el-menu-item class="dis" index="AddJigsawPuzzle">添加拼图</el-menu-item>
          <el-menu-item class="dis" index="AddPuzzleClassify">添加拼图分类</el-menu-item>
          <el-menu-item index="ClassificationPuzzleList">拼图分类列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="8">
        <template slot="title">
          <i class="el-icon-tickets"></i>
          <span>题库管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="dis" index="InterlocutionList">题库列表</el-menu-item>
          <el-menu-item index="AddInterlocution">添加题目</el-menu-item>
          <el-menu-item index="InterlocutionClassifyList">题目分类列表</el-menu-item>
          <el-menu-item index="AddInterlocutionClassify">添加题目分类</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="9">
        <template slot="title">
          <i class="el-icon-bell"></i>
          <span>运营管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="AddCoupon">添加优惠券</el-menu-item>
          <el-menu-item index="CouponList">优惠券列表</el-menu-item>
          <el-menu-item index="personalCoupon">发放优惠券</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="10">
        <template slot="title">
          <i class="el-icon-bell"></i>
          <span>免费活动</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="shoppingCarhttps:%2F%2Ftestimage.prise.shop%2Fimages%2F2018%2F06%2F21%2F1529551478377238.jpg">购物车</el-menu-item>          
          <el-menu-item index="AddActivityTime">下期活动时间</el-menu-item>
          <el-menu-item index="ActivitySharePic">分享小图</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu  index="12">
        <template slot="title">
          <i class="el-icon-star-off"></i>
          <span>愿望管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="GiftsList">礼物列表</el-menu-item>
          <el-menu-item index="AddGifts">新增礼物</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu  index="13">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>游戏设置</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="BigLevelList">游戏大关卡管理</el-menu-item>
          <!-- <el-menu-item index="AddBigLevel">添加游戏大关卡</el-menu-item> -->
          <!-- <el-menu-item index="AddSmallLevel">添加拼图</el-menu-item> -->
          <el-menu-item index="SmallLevelList">拼图管理</el-menu-item>
          <!-- <el-menu-item index="AddStrategy">添加奖励说明</el-menu-item> -->
          <el-menu-item index="StrategyList">奖励说明管理</el-menu-item>          
          <el-menu-item index="GiftsSharePic">分享炫耀图片</el-menu-item>
          <!-- <el-menu-item index="AddRankRewards">添加排行榜奖励</el-menu-item> -->
          <el-menu-item index="RankRewardList">排行榜奖励管理</el-menu-item>
          <!-- <el-menu-item index="AddTask">添加任务</el-menu-item> -->
          <el-menu-item index="TaskList">任务管理</el-menu-item>
          <el-menu-item index="SurpriseManager">红包管理</el-menu-item>
          <el-menu-item index="SendOutSurprise">已派送红包列表</el-menu-item>
          <el-menu-item index="CashCard">提现卡列表</el-menu-item>
          <el-menu-item index="TreeAnswersetting">答题游戏设置</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="14">
        <template slot="title">
          <i class="el-icon-star-off"></i>
          <span>获奖名单</span>
        </template>
        <el-menu-item index="WinnerList">愿望名单</el-menu-item>
        <el-menu-item index="RankList">排行榜名单</el-menu-item>
      </el-submenu>
      <el-submenu index="11">
        <template slot="title">
          <i class="el-icon-bell"></i>
          <span>公共配置</span>
        </template>
        <el-menu-item-group>        
          <el-menu-item index="common">限购下期活动时间</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="15">
        <template slot="title">
          <i class="el-icon-tickets"></i>
          <span>标签管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="HomeTabs">标签</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="16">
        <template slot="title">
          <i class="el-icon-s-cooperation"></i>
          <span>首页管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="IndexBanner">图片</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="17">
        <template slot="title">
          <i class="el-icon-data-analysis"></i>
          <span>活动管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="BargainInfo">活动详情</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="18">
        <template slot="title">
          <i class="el-icon-receiving"></i>
          <span>活动规则</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="BargainRole">规则信息</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-col>
</template>
<style>
.el-menu {
  border: none;
}
/* .dis{
  display: block;
} */
</style>

<script>
export default {
  name: "SideBar",
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>