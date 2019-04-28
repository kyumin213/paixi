import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import GoodsList from '@/views/GoodsList'
import AddGoods from '@/views/AddGoods'
import CreateTheme from '@/views/CreateTheme'
import ThemeList from '@/views/ThemeList'
import OrderList from '@/views/OrderList'
import AddCategory from '@/views/AddCategory'
import CategoryList from '@/views/CategoryList'
import EditTheme from '@/views/EditTheme'
import EditCategory from '@/views/EditCategory'
import EditGoods from '@/views/EditGoods'
import ProductDetails from '@/views/ProductDetails'
import ThemeDetails from '@/views/ThemeDetails'
import TemplateList from '@/views/TemplateList'
import EditTemplate from '@/views/EditTemplate'
import OrdersProducts from '@/views/OrdersProducts'
import PaixiUserList from '@/views/PaixiUserList'
import Feedbacks from '@/views/Feedbacks'
import banner from '@/views/banner'
import AddArticle from '@/views/AddArticle'
import ArticleList from '@/views/ArticleList'
import EditArticle from '@/views/EditArticle'
import AddLabel from '@/views/AddLabel'
import LabelList from '@/views/LabelList'
import EditLabel from '@/views/EditLabel'
import OrderListAnalyse from '@/views/OrderListAnalyse'
import OrderListqiaoqiao from '@/views/OrderListqiaoqiao'
import AddPuzzleClassify from '@/views/AddPuzzleClassify'
import AddJigsawPuzzle from '@/views/AddJigsawPuzzle'
import JigsawPuzzleList from '@/views/JigsawPuzzleList'
import ClassificationPuzzleList from '@/views/ClassificationPuzzleList'
import EditClassifyPuzzle from '@/views/EditClassifyPuzzle'
import InterlocutionList from '@/views/InterlocutionList'
import AddInterlocution from '@/views/AddInterlocution'
import EditInterlocution from '@/views/EditInterlocution'
import OrdersListOpenBox from '@/views/OrdersListOpenBox'
import OrdersListPuzzle from '@/views/OrdersListPuzzle'
import OrdersListInterlocution from '@/views/OrdersListInterlocution'
import AddRecruit from '@/views/AddRecruit'
import RecruitList from '@/views/RecruitList'
import EditRecruit from '@/views/EditRecruit'
import AddInterlocutionClassify from '@/views/AddInterlocutionClassify'
import InterlocutionClassifyList from '@/views/InterlocutionClassifyList'
import EditInterClassify from '@/views/EditInterClassify'
import EditJigsawPuzzle from '@/views/EditJigsawPuzzle'
import CouponList from '@/views/CouponList'
import AddCoupon from '@/views/AddCoupon'
import EditCoupon from '@/views/EditCoupon'
import ShoppingCar from '@/views/ShoppingCar'
import OrdersListFreeActivity from '@/views/OrdersListFreeActivity'
import OrdersListPintuActivity from '@/views/OrdersListPintuActivity'
import OrdersListAnswerActivity from '@/views/OrdersListAnswerActivity'
import ConsigneesList from '@/views/ConsigneesList'
import OrdersListGroupGifts from '@/views/OrdersListGroupGifts'
import AddActivityTime from '@/views/AddActivityTime'
import OrdersListDice from '@/views/OrdersListDice'
import ActivitySharePic from '@/views/ActivitySharePic'
import JoinerList from '@/views/JoinerList'
import Common from '@/views/Common'
import OrdersListDirect from '@/views/OrdersListDirect'
import PersonalCoupon from '@/views/PersonalCoupon'
import GiftsList from '@/views/GiftsList'
import EditGifts from '@/views/EditGifts'
import AddGifts from '@/views/AddGifts'
import AddStrategy from '@/views/AddStrategy'
import StrategyList from '@/views/StrategyList'
import AddBigLevel from '@/views/AddBigLevel'
import AddSmallLevel from '@/views/AddSmallLevel'
import BigLevelList from '@/views/BigLevelList'
import EditBigLevel from '@/views/EditBigLevel'
import SmallLevelList from '@/views/SmallLevelList'
import EditSmallLevel from '@/views/EditSmallLevel'
import EditStrategy  from '@/views/EditStrategy'
import GiftsSharePic from '@/views/GiftsSharePic'
import WinnerList from '@/views/WinnerList'
import RankList from '@/views/RankList'
import AddRankRewards from '@/views/AddRankRewards'
import RankRewardList from '@/views/RankRewardList'
import EditRewardList from '@/views/EditRewardList'
import AddTask from '@/views/AddTask'
import EditTask from '@/views/EditTask'
import TaskList from '@/views/TaskList'
import GiftCardList from '@/views/GiftCardList'
import AddGiftCard from '@/views/AddGiftCard'
import EditGiftCard from '@/views/EditGiftCard'
import GiftCardDetails from '@/views/GiftCardDetails'
import VIPaccounts from '@/views/VIPaccounts'
import VIPdetails from '@/views/VIPdetails'
import VIPtranFlow from '@/views/VIPtranFlow'
import RechargeCardList from '@/views/RechargeCardList'
import SurpriseManager from '@/views/SurpriseManager'
import AddSurpriseTerm from '@/views/AddSurpriseTerm'
import AddSurprise from '@/views/AddSurprise'
import SurpriseList from '@/views/SurpriseList'
import EditSurprise from '@/views/EditSurprise'
import SendOutSurprise from '@/views/SendOutSurprise'
import CashCard from '@/views/CashCard'
import CashCardDetails from '@/views/CashCardDetails'
import TreeAnswersetting from '@/views/TreeAnswersetting'
import LabelManager from '@/views/LabelManager'
import AddMainLabel from '@/views/AddMainLabel'
import EditMainLabel from '@/views/EditMainLabel'
import ChildLabelManager from '@/views/ChildLabelManager'
import AddSmallLabel from '@/views/AddSmallLabel'
import EditSmallLabel from '@/views/EditSmallLabel'
import SelectLabels from '@/views/SelectLabels'
import EditSelectedLabels from '@/views/EditSelectedLabels'
import bindTbas from '@/views/bindTabs'
import auth from './auth'
import { resolve } from 'path';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      beforeEnter: requireAuth,
      children: [{
        path: '/goodsList',
        name: 'GoodsList',
        component: GoodsList,
        meta: ['商品管理', '商品列表']
      },
      {
        path: '/HomeTabs',
        name: 'HomeTabs',
        component: resolve => require(['../views/HomeTabs.vue'], resolve),
        meta: ['标签管理','标签管理']
      },
      {
        path: '/bindTabs',
        name: 'bindTabs',
        component: bindTbas,
        meta: ['标签绑定','标签绑定']
      },
      {
        path:'/LabelManager',
        name: 'LabelManager',
        component: LabelManager,
        meta: ['标签管理', '标签列表']
      },
      {
        path: '/SelectLabels:id',
        name: 'SelectLabels',
        component: SelectLabels,
        meta: ['商品管理', '添加筛选标签']
      },
      {
        path: '/EditSelectedLabels:id',
        name: 'EditSelectedLabels',
        component: EditSelectedLabels,
        meta: ['商品管理', '修改筛选标签']
      },
      {
        path: '/EditSmallLabel:id',
        name: 'EditSmallLabel',
        component: EditSmallLabel,
        meta: ['标签管理', '编辑子标签']
      },
      {
        path: '/EditMainLabel:id',
        name: 'EditMainLabel',
        component: EditMainLabel,
        meta: ['标签管理', '编辑标签']
      },
      {
        path: '/AddMainLabel',
        name: 'AddMainLabel',
        component: AddMainLabel,
        meta: ['标签管理', '新增主标签']
      },
      {
        path: '/AddSmallLabel',
        name: 'AddSmallLabel',
        component: AddSmallLabel,
        meta: ['标签管理', '添加子标签']
      },
      {
        path: '/ChildLabelManager:id',
        name: 'ChildLabelManager',
        component: ChildLabelManager,
        meta: ['标签管理', '子标签列表']
      },
      {
        path: '/CashCardDetails:id',
        name: 'CashCardDetails',
        component: CashCardDetails,
        meta: ['提现卡管理', '提现卡详情']
      },
      {
        path: '/TreeAnswersetting',
        name: 'TreeAnswersetting',
        component: TreeAnswersetting,
        meta: ['游戏管理', '答题游戏设置']
      },
      {
        path: '/CashCard',
        name: 'CashCard',
        component: CashCard,
        meta: ["提现卡管理", "提现卡列表"]
      },
      {
        path: '/SurpriseList:id',
        name: 'SurpriseList',
        component: SurpriseList,
        meta: ["游戏管理", "惊喜红包列表"]
      },
      {
        path: '/SendOutSurprise',
        name: 'SendOutSurprise',
        component: SendOutSurprise,
        meta: ["游戏管理", "已派送惊喜红包"]
      },
      {
        path: '/EditSurprise:id',
        name: 'EditSurprise',
        component: EditSurprise,
        meta: ["游戏管理", "编辑惊喜红包"]
      },
      {
        path: '/EditGiftCard:id',
        name: 'EditGiftCard',
        component: EditGiftCard,
        meta: ["礼品卡管理", "编辑礼品卡"]
      },
      {
        path: '/SurpriseManager',
        name: 'SurpriseManager',
        component: SurpriseManager,
        meta: ["游戏管理", "惊喜红包"]
      },
      {
        path: '/AddSurpriseTerm',
        name: 'AddSurpriseTerm',
        component: AddSurpriseTerm,
        meta: ["游戏管理", "添加惊喜红包期限"]
      },
      {
        path: '/AddSurprise:id',
        name: 'AddSurprise',
        component: AddSurprise,
        meta: ["游戏管理","游戏惊喜红包"]
      },
      {
        path: '/RechargeCardList',
        name: 'RechargeCardList',
        component: RechargeCardList,
        meta: ["充值卡管理", "充值卡列表"]
      },
      {
        path: '/VIPtranFlow',
        name: 'VIPtranFlow',
        component: VIPtranFlow,
        meta: ["充值卡管理", "充值卡交易流水"]
      },
      {
        path: '/VIPdetails:id',
        name: 'VIPdetails',
        component: VIPdetails,
        meta: ["充值卡管理", "会员账户详情"]
      },
      {
        path: '/VIPaccounts',
        name: 'VIPaccounts',
        component: VIPaccounts,
        meta: ["充值卡管理","充值卡会员账户"]
      },
      {
        path: '/GiftCardDetails:id',
        name: 'GiftCardDetails',
        component: GiftCardDetails,
        meta: ["礼品卡管理", "礼品卡详情"]
      },
      {
        path: '/GiftCardList',
        name: 'GiftCardList',
        component: GiftCardList,
        meta: ['用户管理', '礼品卡管理']
      },
      {
        path: '/AddGiftCard',
        name: 'AddGiftCard',
        component: AddGiftCard,
        meta: ['用户管理', '新增礼品卡']
      },
      {
        path: '/EditBigLevel:id',
        name: 'EditBigLevel',
        component: EditBigLevel,
        meta: ["游戏管理","编辑关卡"]        
      },
      {
        path: '/RankRewardList',
        name: 'RankRewardList',
        component: RankRewardList,
        meta: ["游戏管理","排行榜奖励列表"]
      },
      {
        path: '/AddTask',
        name: 'AddTask',
        component: AddTask,
        meta: ["游戏管理","添加任务"]
      },
      {
        path: '/TaskList',
        name: 'TaskList',
        component: TaskList,
        meta: ["游戏管理","任务列表"]
      },
      {
        path: '/EditTask:id',
        name: 'EditTask',
        component: EditTask,
        meta: ["游戏管理","编辑任务"]        
      },
      {
        path: '/EditRewardList:id',
        name: 'EditRewardList',
        component: EditRewardList,
        meta: ["游戏管理","编辑排行榜奖励"]
      },
      {
        path: '/AddRankRewards',
        name: 'AddRankRewards',
        component: AddRankRewards,
        meta: ["游戏管理","添加排行榜奖励"]  
      },
      {
        path: '/WinnerList',
        name: 'WinnerList',
        component: WinnerList,
        meta: ["兑奖列表","兑奖列表"]
      },
      {
        path: '/RankList',
        name: 'RankList',
        component: RankList,
        meta: ["排行榜名单","排行榜名单"]
      },
      {
        path: '/GiftsSharePic',
        name: 'GiftsSharePic',
        component: GiftsSharePic,
        meta: ['游戏管理','分享图片']
      },
      {
        path: '/EditStrategy:id',
        name: 'EditStrategy',
        component: EditStrategy,
        meta: ["游戏管理","编辑攻略"]
      },
      {
        path: '/EditSmallLevel:id',
        name: 'EditSmallLevel',
        component: EditSmallLevel,
        meta: ["游戏管理","编辑拼图"]
      },
      {
        path: '/SmallLevelList',
        name: 'SmallLevelList',
        component: SmallLevelList,
        meta: ["游戏管理","拼图列表"]                
      },
      {
        path: '/AddBigLevel',
        name: 'AddBigLevel',
        component: AddBigLevel,
        meta: ["游戏管理","添加大关卡"]
      },
      {
        path: '/BigLevelList',
        name: 'BigLevelList',
        component: BigLevelList,
        meta: ['游戏设置','关卡列表']
      },
      {
        path: '/AddSmallLevel',
        name: 'AddSmallLevel',
        component: AddSmallLevel,
        meta: ["游戏管理","添加拼图"]
      },
      {
        path: '/StrategyList',
        name: 'StrategyList',
        component: StrategyList,
        meta: ["游戏管理","攻略列表"]
      },
      {
        path: '/AddStrategy',
        name: 'AddStrategy',
        component: AddStrategy,
        meta: ['游戏管理', '添加游戏攻略']        
      },
      {
        path: '/AddGifts',
        name: 'AddGifts',
        component: AddGifts,
        meta: ['愿望管理', '新增礼物']
      },
      {
        path: '/GiftsList',
        name: 'GiftsList',
        component: GiftsList,
        meta: ['愿望管理', '礼物列表']
      },
      {
        path: '/addGoods',
        name: 'AddGoods',
        component: AddGoods,
        meta: ['商品管理', '添加商品']
      },
      {
        path: '/personalCoupon',
        name: 'PersonalCoupon',
        component: PersonalCoupon,
        meta: ['优惠券管理', '发放私人优惠券']
      },
      {
        path: '/productDetails:id',
        name: 'ProductDetails',
        component: ProductDetails,
        meta: ['商品管理', '商品详情']
      },
      {
        path: '/editGifts:id',
        name: 'EditGifts',
        component: EditGifts,
        meta: ['愿望管理', '编辑愿望']
      },
      {
        path: '/JoinerList:id',
        name: 'JoinerList',
        component: JoinerList,
      },
      {
        path: '/shoppingCar:picture',
        name: 'ShoppingCar',
        component: ShoppingCar,
        meta: ['商品管理', '购物车']
      },
      {
        path: '/editGoods:id',
        name: 'EditGoods',
        component: EditGoods,
        meta: ['商品管理', '编辑商品属性']
      },
      {
        path: '/createTheme',
        name: 'CreateTheme',
        component: CreateTheme,
        meta: ['专题管理', '创建专题']
      },
      {
        path: '/themeList',
        name: 'ThemeList',
        component: ThemeList,
        meta: ['专题管理', '专题列表']
      },
      {
        path: '/banner',
        name: 'banner',
        component: banner,
        meta: ['专题管理', '首页封面']
      },
      {
        path: '/editTheme:id',
        name: 'EditTheme',
        component: EditTheme,
        meta: ['专题管理', '修改专题']
      },
      {
        path: '/themeDetails:id',
        name: 'ThemeDetails',
        component: ThemeDetails,
        meta: ['专题管理', '查看专题详情']
      },
      {
        path: '/EditLabel:id',
        name: 'EditLabel',
        component: EditLabel,
        meta: ['专题管理', '修改标签信息']
      },
      {
        path: '/addLabel',
        name: 'AddLabel',
        component: AddLabel,
        meta: ['专题管理', '添加专题标签']
      },
      {
        path: '/labelList:id',
        name: 'LabelList',
        component: LabelList,
        meta: ['专题管理', '专题标签列表']
      },
      {
        path: '/editCategory:id',
        name: 'EditCategory',
        component: EditCategory,
        meta: ['商品管理', '修改商品分类']
      },
      {
        path: '/orderList',
        name: 'OrderList',
        component: OrderList,
        meta: ['订单管理', '订单列表']
      },
      {
        path: '/orderListAnalyse',
        name: 'OrderListAnalyse',
        component: OrderListAnalyse,
        meta: ['订单管理', '送礼数据分析']
      },
      {
        path: '/orderListqiaoqiao',
        name: 'OrderListqiaoqiao',
        component: OrderListqiaoqiao,
        meta: ['订单管理', '悄悄送礼订单列表']
      },
      {
        path: '/OrdersListOpenBox',
        name: 'OrdersListOpenBox',
        component: OrdersListOpenBox,
        meta: ['订单管理', '开箱送礼订单列表']
      },
      {
        path: '/OrdersListPuzzle',
        name: 'OrdersListPuzzle',
        component: OrdersListPuzzle,
        meta: ['订单管理', '拼图送礼订单列表']
      },
      {
        path: '/OrdersListInterlocution',
        name: 'OrdersListInterlocution',
        component: OrdersListInterlocution,
        meta: ['订单管理', '问答送礼订单列表']
      },
      {
        path: '/OrdersListGroupGifts',
        name: 'OrdersListGroupGifts',
        component: OrdersListGroupGifts,
        meta: ['订单管理', '群收礼订单列表']
      },
      {
        path: '/OrdersListFreeActivity',
        name: 'OrdersListFreeActivity',
        component: OrdersListFreeActivity,
        meta: ['订单管理', '免费活动订单列表']
      },
      {
        path: '/OrdersListPintuActivity',
        name: 'OrdersListPintuActivity',
        component: OrdersListPintuActivity,
        meta: ['订单管理', '拼图活动订单列表']
      },
      {
        path: '/OrdersListAnswerActivity',
        name: 'OrdersListAnswerActivity',
        component: OrdersListAnswerActivity,
        meta: ['订单管理', '问答活动订单列表']
      },
      {
        path: '/ConsigneesList:id',
        name: 'ConsigneesList',
        component: ConsigneesList,
        meta: ['订单管理', '活动收货人地址']
      },
      {
        path: '/AddPuzzleClassify',
        name: 'AddPuzzleClassify',
        component: AddPuzzleClassify,
        meta: ['订单管理', '添加拼图分类']
      },
      {
        path: '/JigsawPuzzleList',
        name: 'JigsawPuzzleList',
        component: JigsawPuzzleList,
        meta: ['订单管理', '拼图图片列表']
      },
      {
        path: '/ordersListDice',
        name: 'OrdersListDice',
        component: OrdersListDice,
        meta: ['订单管理', '摇骰子订单列表']
      },
      {
        path: '/OrdersListDirect',
        name: 'OrdersListDirect',
        component: OrdersListDirect,
        meta: ['订单管理', '直接送订单列表']
      },
      {
        path: '/EditJigsawPuzzle:id',
        name: 'EditJigsawPuzzle',
        component: EditJigsawPuzzle,
        meta: ['订单管理', '编辑拼图']
      },
      {
        path: '/ClassificationPuzzleList',
        name: 'ClassificationPuzzleList',
        component: ClassificationPuzzleList,
        meta: ['订单管理', '拼图分类列表']
      },
      {
        path: '/AddJigsawPuzzle',
        name: 'AddJigsawPuzzle',
        component: AddJigsawPuzzle,
        meta: ['订单管理', '添加拼图']
      },
      {
        path: '/EditClassifyPuzzle:id',
        name: 'EditClassifyPuzzle',
        component: EditClassifyPuzzle,
        meta: ['订单管理', '修改拼图分类']
      },
      {
        path: '/addCategory',
        name: 'AddCategory',
        component: AddCategory,
        meta: ['商品管理', '添加商品分类']
      },
      {
        path: '/templateList',
        name: 'TemplateList',
        component: TemplateList,
        meta: ['模板管理', '模板列表']
      },
      {
        path: '/editTemplate:id',
        name: 'EditTemplate',
        component: EditTemplate,
        meta: ['模板管理', '修改模板']
      },
      {
        path: '/categoryList',
        name: 'CategoryList',
        component: CategoryList,
        meta: ['商品管理', '分类列表']
      },
      {
        path: '/OrdersProducts:id',
        name: 'OrdersProducts',
        component: OrdersProducts,
        meta: ['订单管理', '查看订单商品']
      },
      {
        path: '/PaixiUserList',
        name: 'PaixiUserList',
        component: PaixiUserList,
        meta: ['用户管理', '用户列表']
      },
      {
        path: '/Feedbacks',
        name: 'Feedbacks',
        component: Feedbacks,
        meta: ['用户管理', '用户反馈']
      },
      {
        path: '/addArticle',
        name: 'AddArticle',
        component: AddArticle,
        meta: ['文章管理', '添加文章']
      },
      {
        path: '/articleList',
        name: 'ArticleList',
        component: ArticleList,
        meta: ['文章管理', '文章列表']
      },
      {
        path: '/editArticle:id',
        name: 'EditArticle',
        component: EditArticle,
        meta: ['文章管理', '编辑文章']
      },
      {
        path: '/AddRecruit',
        name: 'AddRecruit',
        component: AddRecruit,
        meta: ['文章管理', '添加招聘']
      },
      {
        path: '/RecruitList',
        name: 'RecruitList',
        component: RecruitList,
        meta: ['文章管理', '招聘列表']
      },
      {
        path: '/EditRecruit:id',
        name: 'EditRecruit',
        component: EditRecruit,
        meta: ['文章管理', '编辑招聘信息']
      },
      {
        path: '/InterlocutionList',
        name: 'InterlocutionList',
        component: InterlocutionList,
        meta: ['题库管理', '题库列表']
      },
      {
        path: '/AddInterlocution',
        name: 'AddInterlocution',
        component: AddInterlocution,
        meta: ['题库管理', '添加题库']
      },
      {
        path: '/EditInterlocution:id',
        name: 'EditInterlocution',
        component: EditInterlocution,
        meta: ['题库管理', '编辑题库']
      },
      {
        path: '/AddInterlocutionClassify',
        name: 'AddInterlocutionClassify',
        component: AddInterlocutionClassify,
        meta: ['题库管理', '添加题目分类']
      },
      {
        path: '/InterlocutionClassifyList',
        name: 'InterlocutionClassifyList',
        component: InterlocutionClassifyList,
        meta: ['题库管理', '题目分类列表']
      },
      {
        path: '/EditInterClassify:id',
        name: 'EditInterClassify',
        component: EditInterClassify,
        meta: ['题库管理', '编辑题目分类']
      },
      {
        path: '/AddCoupon',
        name: 'AddCoupon',
        component: AddCoupon,
        meta: ['运营管理', '添加优惠券']
      },
      {
        path: '/CouponList',
        name: 'CouponList',
        component: CouponList,
        meta: ['运营管理', '优惠券列表']
      },
      {
        path: '/EditCoupon:id',
        name: 'EditCoupon',
        component: EditCoupon,
        meta: ['运营管理', '编辑优惠券']
      },
      {
        path: '/addActivityTime',
        name: 'AddActivityTime',
        component: AddActivityTime,
        meta: ['免费活动', '活动时间']        
      },
      {
        path: '/activitySharePic',
        name: 'ActivitySharePic',
        component: ActivitySharePic,
        meta: ['免费活动', '分享小图']   
      },
      {
        path: '/common',
        name: 'Common',
        component: Common,
        meta: ['公共配置', '限购下期时间']   
      }
      ]
    }
  ]
})
function requireAuth(to, from, next) {
  if (auth.loggedIn() === 'null' || auth.loggedIn() === null) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}
