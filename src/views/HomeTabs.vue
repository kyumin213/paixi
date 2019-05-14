<template>
    <section class="el-container wrapper is-vertical">
      
        <div class="btn">
            <el-row>
           <el-button type="primary"  @click="addTabs()">添加属性</el-button>
        </el-row>
        </div>
        <div id="body">
  
       </div>
        <!-- 添加一级标签 -->
        <el-dialog title="添加标签" :visible.sync="addModel" width="30%" :close-on-click-modal="false" :before-close="closeChild">
            <el-form :model="tabsForm" ref="tabsForm" :rules="rules" label-width="80px">
                <el-form-item label="名称" prop='tabName'>
                    <el-input v-model="tabsForm.tabName"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="tabIconUrl">
                     <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  name="uploadFile"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="upLoadData">
                  <img v-if="tabsForm.tabIconUrl" :src="tabsForm.tabIconUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
                </el-form-item>
                <el-form-item label="编号" prop="tabNo">
                    <el-input v-model="tabsForm.tabNo"></el-input>
                </el-form-item>
                <el-form-item>
                   <el-button type="primary" @click="onSubmit()">确定</el-button>
                  <el-button @click="closeChild">取消</el-button>
               </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 添加子级 -->
        <el-dialog title="添加子级" :visible.sync="childModel" width="30%" :close-on-click-modal="false" :before-close="canceladdChild">
            <el-form :model="childList" ref="childList" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="childList.title"></el-input>
                </el-form-item>
                <el-form-item label="题目编号">
                    <el-input v-model="childList.titleNumber" type="number"></el-input>
                </el-form-item>
                <div v-for="(item,index) in arrtibuteArray" :key="item.key">
                    <el-form-item label="答案">
                        <el-col :span="2"> <span>{{index+1}}</span></el-col>
                        <el-col :span="14"><el-input type="text" v-model="item.text"></el-input></el-col>
                         <el-button type="danger" size="small" style="margin-left: 5px" :disabled="disabled" @click="removeRowGoods(index, item)">删除</el-button>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button type="primary" size="small" @click="addAttribute()">新增答案</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addChildList()">添加</el-button>
                    <el-button @click="canceladdChild()">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 一键添加添加子级 -->
        <el-dialog title="添加子级" :visible.sync="allAddModel" width="30%" :close-on-click-modal="false" :before-close="canceladdAllChild">
            <el-form :model="childList" ref="childList" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="childList.title"></el-input>
                </el-form-item>
                <el-form-item label="题目编号">
                    <el-input v-model="childList.titleNumber" type="number"></el-input>
                </el-form-item>
                <div v-for="(item,index) in arrtibuteArray" :key="item.key">
                    <el-form-item label="答案">
                        <el-col :span="2"> <span>{{index+1}}</span></el-col>
                        <el-col :span="14"><el-input type="text" v-model="item.text"></el-input></el-col>
                         <el-button type="danger" size="small" style="margin-left: 5px" :disabled="disabled" @click="removeRowGoods(index, item)">删除</el-button>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button type="primary" size="small" @click="addAttribute()">新增答案</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addAllChildList()">添加</el-button>
                    <el-button @click="canceladdAllChild()">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 修改题目内容 -->
        <el-dialog title="修改题目内容" :visible.sync="editTitleModel" width="30%" center :close-on-click-modal="false" :before-close="cancelEditTitle">
            <el-form :model="editTitleData" label-width="80px">
                <el-form-item label="编号">
                    <el-input v-model="editTitleData.titleId"></el-input>
                </el-form-item>
                <el-form-item label="题目">
                    <el-input v-model="editTitleData.title"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="editTitleSub()">确定</el-button>
                    <el-button @click="cancelEditTitle()">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 修改属性内容 -->
        <el-dialog title="修改属性内容" :visible.sync="editAttriModel" width="30%" center :close-on-click-modal="false">
            <el-form :model="attribuEditData" label-width="80px">
              <el-form-item label="属性">
                  <el-input v-model="attribuEditData.attributeNameEdit"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="editAttributeName()">确定</el-button>
                  <el-button @click="editAttriModel=false">取消</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>
<script>
import { baseUrl } from "@/config/env";
import { baseImgPath } from "@/config/env";
import { getStore } from "@/config/mUtils";
export default {
  name: "HomeTabls",
  data() {
    return {
      // uploadUrl: baseImgPath + "picture/oss/upload/multi",
      uploadUrl: baseImgPath + "file/upload/file",
      upLoadData: {
        token: getStore("token")
      },
      id: "",
      idList: [],
      tabArray: [],
      arriList: [],
      tabsData: [],
      attributeChildData: [],
      viewTitle: "",
      titleNo: "",
      childList: {
        title: "",
        titleNumber: "",
        arrtibuteArray: []
      },
      editTitleData: {
        titleId: "",
        title: ""
      },
      attribuEditData: {
        id: "",
        attributeNameEdit: ""
      },
      disabled: true, //属性删除按钮禁用
      addModel: false,
      childModel: false, //添加子级
      editTitleModel: false, //修改题目
      editAttriModel: false, //修改属性
      allAddModel: false, //一键添加子级
      arrtibuteArray: [
        {
          text: ""
        }
      ],
      tabsForm: {
        tabName: "",
        tabIconUrl: "",
        tabNo: ""
      },
      defaultProps: {
        children: "children",
        label: "attributeName"
      },
      rules: {
        tabName: [
          { required: true, message: "请输入标签名称", trigger: "change" }
        ],
        tabIconUrl: [
          { required: true, message: "请添加标签图标", trigger: "change" }
        ],
        tabNo: [
          { required: true, message: "请输入标签编号", trigger: "change" }
        ],
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        titleName: [
          { required: true, message: "请输入标签名称", trigger: "change" }
        ]
      }
    };
  },
  created() {
    let _this = this;
    _this.getALLTabs();
  },
  mounted: function() {
    var _this = this;
    var root = {
      attributeName: "标签",
      deal: "1",
      id: 0,
      children: []
    };
    var m = [20, 120, 20, 40], //20、120、top、left 位置
      w = 1780 - m[1] - m[3],
      h = 800 - m[0] - m[2],
      i = 0,
      root;

    var tree = d3.layout.tree().size([h, w]);

    var diagonal = d3.svg.diagonal().projection(function(d) {
      return [d.y, d.x];
    });

    var vis = d3
      .select("#body")
      .append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    // 数据赋值
    // root = json_data;
    root.x0 = h / 2;
    root.y0 = 0;

    function toggleAll(d) {
      console.log(d);
      if (d.children) {
        d.children.forEach(toggleAll);
        toggle(d);
      }
    }

    // Initialize the display to show a few nodes.
    // root.children.forEach(toggleAll);
    // toggle(root.children[1]);
    // toggle(root.children[1].children[2]);
    // toggle(root.children[9]);
    // toggle(root.children[9].children[0]);
    //执行渲染
    update(root);

    function update(source) {
      var duration = d3.event && d3.event.altKey ? 5000 : 500;

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse();

      // Normalize for fixed-depth.
      nodes.forEach(function(d) {
        d.y = d.depth * 215;
      });

      // Update the nodes…
      var node = vis.selectAll("g.node").data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node
        .enter()
        .append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
        });
      // .on("click", function(d) {
      //   click(d);
      //   update(d);
      // });

      nodeEnter
        .append("svg:circle")
        .attr("r", 1e-6)
        .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
        })
        .on("click", function(d) {
          console.log(d);
          click(d);
          update(d);
        });

      nodeEnter
        .append("a")
        .attr("xlink:href", function(d) {
          return d.url;
        })
        .append("svg:text")
        .attr("x", function(d) {
          return d.children || d._children ? -10 : 10;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
          return d.attributeName;
        })
        .style("fill", function(d) {
          return d.free ? "black" : "#999";
        })
        .style("fill-opacity", 1e-6);
      nodeEnter
        .append("svg:text")
        .attr("dy", ".35em")
        .attr("x", "6em")
        .attr("class", "pointer")
        .text("添加")
        .style("fill", function(d) {
          return d.free ? "#f00" : "#f00";
        })
        .on("click", function(d) {
          addChild(d);
          // update(d);
        });
      nodeEnter
        .append("svg:text")
        .attr("dy", ".35em")
        .attr("x", "8.3em")
        .attr("class", "pointer")
        .text("题目")
        .style("fill", function(d) {
          return d.free ? "#f00" : "#f00";
        })
        .on("click", function(d) {
          childrenUpda(d);
        });
      nodeEnter
        .append("svg:text")
        .attr("dy", ".35em")
        .attr("x", "10.5em")
        .attr("class", "pointer")
        .text("属性")
        .style("fill", function(d) {
          return d.free ? "#f00" : "#f00";
        })
        .on("click", function(d) {
          attributeUpdate(d);
        });
      nodeEnter
        .append("svg:text")
        .attr("dy", ".35em")
        .attr("x", "13em")
        .attr("class", "pointer")
        .text("一键添加")
        .style("fill", function(d) {
          return d.free ? "#f00" : "#f00";
        })
        .on("click", function(d) {
          attributeAddAll(d);
        });

      nodeEnter.append("svg:title").text(function(d) {
        return d.description;
      });

      // Transition nodes to their new position.
      var nodeUpdate = node
        .transition()
        .duration(duration)
        .attr("transform", function(d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      nodeUpdate
        .select("circle")
        .attr("r", 8)
        .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
        });

      nodeUpdate.select("text").style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

      nodeExit.select("circle").attr("r", 1e-6);

      nodeExit.select("text").style("fill-opacity", 1e-6);

      // Update the links…
      var link = vis
        .selectAll("path.link")
        .data(tree.links(nodes), function(d) {
          return d.target.id;
        });

      // Enter any new links at the parent's previous position.
      link
        .enter()
        .insert("svg:path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          var o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        })
        .transition()
        .duration(duration)
        .attr("d", diagonal);

      // Transition links to their new position.
      link
        .transition()
        .duration(duration)
        .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }
    function getNode(parentId) {
      $.ajax({
        url: baseUrl + "hierarchys/get/id",
        data: {
          parentId: parentId == 1 ? 0 : parentId,
          token: _this.upLoadData.token
        },
        success: function(result) {
          if (result.status == 200) {
            //成功
            let data = result.bean.hierarchyList;

            let tit = result.bean.problem;
            if (tit != null) {
              var title = tit.title;
              var titNumber = tit.id;
            } else {
              var title = "";
              var titNumber = "";
            }
            // 迭代跟改数据结构
            data.forEach(item => {
              item.free = true;
              item.description = title;
              item.titleNumber = titNumber;
              item.children = [];
            });

            clickDomData.children = data;
            update(clickDomData);
          } else {
            console.log(result.msg);
          }
        }
      });
    }
    //点击菜单的数据信息
    var clickDomData = "";
    // Toggle children on click.
    function click(d) {
      //   debugger
      // #重点关注这个函数的不同之处。尤其是else部分
      // debugger
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else if (d._children) {
        d.children = d._children;
        d._children = null;
      } else {
        clickDomData = d;
        getNode(d.id);
        // d.children = mnodes;
      }
    }
    // 新增子级
    function addChild(d) {
      _this.id = d.id;
      _this.childModel = true;
    }
    // 修改标题
    function childrenUpda(d) {
      _this.editTitleModel = true;
      _this.id = d.id;
      _this.editTitleData = {
        titleId: d.titleNumber,
        title: d.description
      };
    }
    // 修改属性
    function attributeUpdate(d) {
      _this.editAttriModel = true;
      _this.attribuEditData = {
        id: d.id,
        attributeNameEdit: d.attributeName
      };
    }
    // 一键添加
    function attributeAddAll(d) {
      let parentId = d.parentId;
      let token = { token: _this.upLoadData.token };
      $.get(
        baseUrl + "hierarchys/get/id",
        { token: _this.upLoadData.token, parentId: parentId },
        data => {
          if (data.status == 200) {
            let lists = data.bean.hierarchyList;
            for (let i = 0; i < lists.length; i++) {
              _this.idList.push(lists[i].id);
            }
            console.log(_this.idList);
          } else {
            this.$message.error(data.msg);
          }
        }
      );
      //   _this.id = _this.idList;

      _this.allAddModel = true;
    }
  },

  methods: {
    isTrue() {
      let _this = this;
      _this.childModel = true;
    },
    // 获取一级标签
    getALLTabs() {
      let _this = this;
      let token = { token: _this.upLoadData.token };
      $.get(
        baseUrl + "hierarchys/get/id",
        { token: _this.upLoadData.token, parentId: 0 },
        data => {
          if (data.status == 200) {
            _this.tabArray = data.bean.hierarchyList;

            // let arr = data.bean.hierarchyList;
            // sessionStorage.setItem("tabArray", JSON.stringify(arr));
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    },

    // 添加子级列表弹窗
    addChildShow(id, index) {
      let _this = this;
      console.log(index);
      var arr = _this.tabArray;
      var arrIndex = arr[index];
      let parm = {
        token: _this.upLoadData.token,
        parentId: id
      };
      $.get(baseUrl + "hierarchys/get/id", parm, data => {
        if (data.status == 200) {
          if (data.bean.problem != null) {
            _this.viewTitle = data.bean.problem.title;
          }
          _this.attributeChildData = data.bean;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 列表添加子级
    listAddchild(id, index) {
      console.log(id);
      let _this = this;
      _this.childModel = true;
      _this.id = id;
    },
    // 添加标签弹窗
    addTabs() {
      let _this = this;
      _this.addModel = true;
    },
    // 添加子级属性（为空时）
    addChildAttribute() {
      let _this = this;
      _this.childModel = true;
      console.log(_this.id);
    },

    // 修改属性弹窗
    arrtibuteEdit(index, row) {
      let _this = this;
      _this.editAttriModel = true;
    },
    // 修改题目内容弹窗
    titleEdit(index, row) {
      let _this = this;
      _this.editTitleModel = true;
      let item = _this.tabArray[index];
      console.log(item);
      let parentId = item.id;
      $.get(
        baseUrl + "hierarchys/get/title/id",
        { token: _this.upLoadData.token, parentId },
        data => {
          if (data.status == 200) {
            if (data.bean != null) {
              _this.editTitleData = {
                titleId: data.bean.titleNumber,
                title: data.bean.title
              };
            }
          } else {
            _this.$message.error(data.msg);
          }
        }
      );
    },
    // 查看题目
    titleView(index, row) {
      let _this = this;
      _this.titleViewModel = true;
      let item = _this.tabArray[index];
      let token = { token: _this.upLoadData.token };
      let parentId = 1;
      $.get(
        baseUrl + "hierarchys/get/title/id",
        { token: _this.upLoadData.token, parentId },
        data => {
          if (data.status == 200) {
            console.log(data);
            _this.viewTitle = data.bean.title;
            _this.titleNo = data.bean.titleNumber;
          } else {
            _this.$message.error(data.msg);
          }
        }
      );
    },
    // 修改题目内容确定
    editTitleSub() {
      let _this = this;
      $.ajax({
        url: baseUrl + "hierarchys/update/proble/id",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.upLoadData.token,
          id: _this.editTitleData.titleId,
          title: _this.editTitleData.title
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "修改成功"
            });
            _this.editTitleModel = false;
            _this.editTitleData.title = "";
            _this.editTitleData.titleId = "";
            _this.getALLTabs();
          } else {
            _this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    // 修改标题弹窗取消事件
    cancelEditTitle() {
      let _this = this;
      _this.editTitleModel = false;
      _this.editTitleData.title = "";
      _this.editTitleData.titleId = "";
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      if (res.status == 200) {
        this.tabsForm.tabIconUrl = res.bean;
      }
      // this.ruleForm.imageUrlCover = URL.createObjectURL(file.raw);
    },

    //  一级标签添加确定
    onSubmit() {
      let _this = this;
      $.ajax({
        url: baseUrl + "hierarchys/add",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.upLoadData.token,
          attributeName: _this.tabsForm.tabName,
          parentId: 0,
          reorder: parseInt(_this.tabsForm.tabNo),
          url: _this.tabsForm.tabIconUrl
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "添加成功"
            });
            _this.addModel = false;
            _this.tabsForm.tabName = "";
            _this.tabsForm.tabIconUrl = "";
            _this.tabsForm.tabNo = "";
            _this.getALLTabs();
          } else {
            _this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },

    // 关闭一级弹窗
    closeChild() {
      let _this = this;
      _this.addModel = false;
      _this.tabsForm.tabName = "";
      _this.tabsForm.tabIconUrl = "";
      _this.tabsForm.tabNo = "";
    },
    // 子级列表为空时添加弹窗
    addListChid() {
      let _this = this;
      let id = _this.id;
      _this.childModel = true;
    },
    // 添加子级弹窗
    // append(data) {
    //   let _this = this;
    //   _this.id = data.id;
    //   _this.childModel = true;
    // },

    // 添加子级属性集合
    addAttribute() {
      let _this = this;
      console.log(_this.arrtibuteArray);
      _this.arrtibuteArray.push({ text: this.childList.length });
      if (_this.arrtibuteArray.length == 1) {
        _this.disabled = true;
      } else {
        _this.disabled = false;
      }
    },
    // 删除子级属性集合
    removeRowGoods(index, item) {
      console.log(index);
      let _this = this;
      _this.index = _this.arrtibuteArray.indexOf(item);

      if (index !== -1) {
        _this.arrtibuteArray.splice(index, 1);
      }
      if (_this.arrtibuteArray.length == 1) {
        _this.disabled = true;
      } else {
        _this.disabled = false;
      }
    },
    // 一键添加子级
    addAllChildList() {
      let _this = this;
      let arrt = _this.arrtibuteArray;
      let ids = _this.idList;
      console.log(_this.idList);
      let tabData = _this.tabsData;
      for (let i = 0; i < arrt.length; i++) {
        _this.arriList.push(arrt[i].text);
      }
      let arriLists = _this.arriList;
      let arrtibu = arriLists.join(",");
      let idList = ids.join(",");
      console.log(idList);
      $.ajax({
        url: baseUrl + "hierarchys/yiadds",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.upLoadData.token,
          id: idList,
          title: _this.childList.title,
          titleNumber: parseInt(_this.childList.titleNumber),
          attributeName: arrtibu
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "添加成功"
            });
            _this.allAddModel = false;
            _this.childList.title = "";
            _this.childList.titleNumber = "";
            _this.arriList = [];
            _this.idList = [];
            _this.arrtibuteArray = [
              {
                text: ""
              }
            ];
            //   _this.addChildList()
          } else {
            _this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    // 添加子级
    addChildList() {
      let _this = this;
      let arrt = _this.arrtibuteArray;
      let tabData = _this.tabsData;
      for (let i = 0; i < arrt.length; i++) {
        _this.arriList.push(arrt[i].text);
      }
      let arriLists = _this.arriList;
      let arrtibu = arriLists.join(",");
      $.ajax({
        url: baseUrl + "hierarchys/adds",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.upLoadData.token,
          id: _this.id,
          title: _this.childList.title,
          titleNumber: parseInt(_this.childList.titleNumber),
          attributeName: arrtibu
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "添加成功"
            });
            _this.childModel = false;
            _this.childList.title = "";
            _this.childList.titleNumber = "";
            _this.arriList = [];
            _this.arrtibuteArray = [
              {
                text: ""
              }
            ];
            //   _this.addChildList()
          } else {
            _this.$message.error(data.msg);
          }
        })
        .fail(function(data) {
          console.log(data);
        });
    },
    // 添加子级弹窗取消事件
    canceladdChild() {
      let _this = this;
      _this.childModel = false;
      _this.childList.title = "";
      _this.childList.titleNumber = "";
      _this.arrtibuteArray = [
        {
          text: ""
        }
      ];
    },
    // 一键添加取消
    canceladdAllChild() {
      let _this = this;
      _this.allAddModel = false;
      _this.childList.title = "";
      _this.childList.titleNumber = "";
      _this.idList = [];
      _this.arrtibuteArray = [
        {
          text: ""
        }
      ];
    },
    // 修改属性内容
    editAttributeName() {
      let _this = this;
      $.ajax({
        url: baseUrl + "hierarchys/update/hierarchy/id",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.upLoadData.token,
          id: _this.attribuEditData.id,
          attributeName: _this.attribuEditData.attributeNameEdit
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message({
              type: "success",
              message: "修改成功"
            });
            _this.editAttriModel = false;
            _this.attribuEditData.id = "";
            _this.attribuEditData.attributeNameEdit = "";
            //   _this.addChildList()
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
.pointer {
  cursor: pointer;
}
.btn {
  margin-bottom: 20px;
}
.centers {
  text-align: center;
  height: 100px;
  line-height: 100px;
}
.titleCenter {
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.mb10 {
  margin-bottom: 20px;
}
.parentLabel {
  display: inline-block;
  width: 80px;
  text-align: right;
}
#body {
  /* width: 1200px; */
  margin: 0;
  position: relative;
}

rect {
  fill: none;
  pointer-events: all;
}

pre {
  font-size: 18px;
}

line {
  stroke: #0e0;
  stroke-width: 1.5px;
}

.string,
.regexp {
  color: #f39;
}

.keyword {
  color: #00c;
}

.comment {
  color: #777;
  font-style: oblique;
}

.number {
  color: #369;
}

.class,
.special {
  color: #1181b8;
}

a:link,
a:visited {
  color: steelblue;
  text-decoration: none;
}

a:hover {
  color: #666;
}

.node circle {
  cursor: pointer;
  fill: #fff;
  stroke: steelblue;
  stroke-width: 1.5px;
}

.node text {
  font-size: 12px;
}

path.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}
.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 1.5px;
}
.node {
  font: 12px sans-serif;
}
.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 1.5px;
}
</style>
