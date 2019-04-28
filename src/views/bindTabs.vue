<template>
<section>
     <div id="body">
  
       </div>
       <div style="text-align:right">
         <span>{{str}}</span>
         <el-button type="primary" @click="subBindTab()">确认绑定</el-button>
       </div>
        <el-table :data="tabList" border>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="名称" prop="attributeName"></el-table-column>
        <el-table-column label="parentId" prop="parentId"></el-table-column>
      </el-table>
</section>

</template>
<script>
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { getStore } from "@/config/mUtils";
export default {
  inject: ["reload"],
  name: "bindTabs",
  data() {
    return {
      token: getStore("token"),
      tabArray: [],
      tabList: [],
      bindTxt: "",
      str: "",
      id: this.$route.params.id
    };
  },
  watch: {
    $route(to, from) {
      this.getShopIdByTab();
    }
  },
  created() {},

  mounted: function() {
    var _this = this;
    var root = {
      attributeName: "标签",
      deal: "1",
      id: 0,
      children: []
    };
    var m = [20, 120, 20, 40], //20、120、top、left 位置
      w = 1280 - m[1] - m[3],
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
        d.y = d.depth * 180;
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
          // d.checked = trur;
          console.log(d);
          let txt = _this.bindTxt;
          let newTxt = d.id;
          let newNam = d.attributeName;
          let pid = d.parentId;
          let txts = txt + newTxt + "-" + newNam + "-" + pid + ",";
          _this.bindTxt = txts;
          let strs = txts.slice(0, txts.length - 1);
          let nes = strs.substring(strs.indexOf(","), strs.length);
          _this.str = nes.substr(1);
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
        url: "https://testcms.prise.shop/hierarchys/get/id",
        data: {
          parentId: parentId == 1 ? 0 : parentId,
          token: _this.token
        },
        success: function(result) {
          if (result.status == 200) {
            //成功
            let data = result.bean.hierarchyList;
            let tit = result.bean.problem;
            if (tit != null) {
              var title = tit.title;
              var titNumber = tit.titleNumber;
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
              item.checked = false;
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
        // d.checked = true;
        getNode(d.id);
        // d.children = mnodes;
      } if (d.checked == true) {
        d.checked = false;
      } else {
        d.checked == true
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
      _this.id = d.parentId;
      _this.editTitleData = {
        titleId: d.titleNumber,
        title: d.description
      };
      // 修改属性
      function setAttribute(d) {
        _this.editAttriModel = true;
      }
    }
  },

  methods: {
    // 获取全部标签
    getALLTabs() {
      let _this = this;
      $.get(
        baseUrl + "hierarchys/get/id",
        { token: _this.token, parentId: 0 },
        data => {
          if (data.status == 200) {
            _this.tabList = data.bean.hierarchyList;
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    },
    // 根据商品id获取标签
    getShopIdByTab() {
      let _this = this;
      var ids = this.$route.params.id;

      $.get(
        baseUrl + "productaidata/get/id",
        { token: _this.token, productId: this.$route.params.id },
        data => {
          if (data.status == 200) {
            _this.tabList = data.bean;
          } else {
            console.log(data.msg);
          }
        }
      );
    },
    // 确认绑定
    subBindTab() {
      let _this = this;
      let newStr = _this.str;
      $.ajax({
        url: baseUrl + "productaidata/add/or/update",
        type: "POST",
        dataType: "json",
        data: {
          token: _this.token,
          productId: this.$route.params.id,
          aidata: newStr
        }
      })
        .done(data => {
          if (data.status == 200) {
            _this.$message.success("绑定成功");
            _this.str = "";
            this.reload();
            _this.$router.go(-1);
          } else {
            _this.$message.error("绑定失败");
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
  width: 1200px;
  margin: 0 auto;
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
  font-size: 14px;
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
