<template>
  <section class="el-container wrapper is-vertical">
    <el-row style="height:100%;">
      <!-- 按编号搜索 -->
      <el-col :span="4">
        <el-input v-model="id" placeholder="题库编号" @blur="queryByInterlocution" style="width:80%;"></el-input>
      </el-col>
     
      <el-col :span="4">
        <el-input v-model="problems" placeholder="题目名称" @blur="queryByInterlocution" style="width:80%;"></el-input>
      </el-col>
      <!-- 所属分类 -->
      <el-col :span="4">
        <el-select v-model="classify" placeholder="所属分类" @change="queryByInterlocution">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <!-- 导入 -->
      <!-- <el-col :span="4">
        <el-upload
            class="avatar-uploader dis-inline"
            :action="uploadUrl"
            name="uploadFile"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :data="upLoadData">
            <el-button size="mini" type="primary">导入</el-button>
        </el-upload>
      </el-col> -->
    </el-row>
    <el-row class="interlocutionlist">
      <el-col :span="24">
          <el-table
            border
            :data="tableData"
            style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column
            label="题库ID"
            width="">
                <template  slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="题目"
            width="250">
                <template slot-scope="scope">
                    <span>{{ scope.row.problems}}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="选项"
            width="250"> 
                <template slot-scope="scope" >
                  <li v-for="item in JSON.parse(scope.row.chooseAnswers)" v-bind:key="item.index">{{item.choose}}:{{item.chooseValue}}</li>
                </template>
            </el-table-column>

            <el-table-column
            label="答案"
            width="250">
                <template slot-scope="scope">
                    <span>{{ scope.row.answer}}</span>
                </template>
            </el-table-column>

            <el-table-column label="所属分类">
               <template slot-scope="scope">
                    <span>{{ scope.row.typeName}}</span>
                </template>
            </el-table-column>

            <el-table-column
            label="创建日期"
            width="">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span>{{ scope.row.created}}</span>
            </template>
            </el-table-column>

            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row> 
     <div class="block" style="margin:50px auto;">
      <el-pagination
        @current-change="handleCurrentChangeQuery"  
        :current-page="currentPage"
        :page-size="10"  
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </section>
</template>

<style>
.thumnial32 {
  width: 32px;
}

.interlocutionlist{
  margin-top: 60px;
}
.dis-inline {
  display: inline-block;
}
</style>

<script>
import { baseUrl } from "@/config/env";
import { compareDown } from "@/config/mUtils";
import { getStore } from "@/config/mUtils";
import { baseImgPath } from '@/config/env'
export default {
  name: "InterlocutionList",
  data() {
    return {
      token: getStore("token"),
      tableData: [],
      total: 0,
      currentPage: 1,
      id: "",
      problems: "",
      options: [],
      classify: '',
      downloadUrl: '',
      fileUrl: '',
      upLoadData: {
       
      },
      uploadUrl: baseImgPath + 'file/upload/file',
    };
  },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.promiseStatus == false) {
        return "off-row";
      }
      return "";
    },
    uploadXls () {
      
    },
    handleAvatarSuccess(res, file) {
      console.log(file)
      if (res.status == 200) {
        this.downloadUrl = res.bean
        // /interlocution/add/getReadExcel
        $.ajax({
            url: baseUrl + "major/interlocution/add/getReadExcel",
            type: "POST",
            dataType: "json",
            data: {
                token: this.token,
                pathUrl: this.downloadUrl
            }
        })
        .done(data => {
          if (data.status == 200) {
              this.$message({
                  type: "success",
                  message: "导入成功"
              });
          } else {
              this.$message.error(data.msg);
          }
        })
      } else {
        this.$message.error(res.msg)
      }
    }, 
    getCategory () {
      $.get(baseUrl + "major/interlocution/select/all/classify",
      {
        token: this.token
      },
      data => {
        this.options = data.bean;
      })
    },
    handleCurrentChangeQuery(val) {
      this.currentPage = val;
      console.log(val);
      this.queryByEvery(val,this.id,this.problems);
    },

    queryByInterlocution () {
      this.queryByEvery(1,this.id,this.problems)
    },

    queryByEvery(pageBegin,id,problems) {
      jQuery.get(
        baseUrl + "major/interlocution/select/all",
        {
          token: this.token,
          pageBegin: pageBegin,
          pageSize: 10,
          id:id,
          problems:problems,
          classify: this.classify
        },
        data => {
          console.log(data);
          this.tableData = data.bean;
          this.total = data.total;
        }
      );
    },

    handleEdit(index, row) {
      this.$router.push({ path: `/EditInterlocution${row.id}` })
    },

    handleDelete(index, row) {
      var id = row.id;
      $.ajax({
        url: baseUrl + "major/interlocution/delete",
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
          this.pageBegin(this.currentPage);
        } else {
          this.$message.error(data.msg);
        }
      })
      .fail(function(data) {
        console.log(data);
      });
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'EditInterlocution' || from.name == 'AddInterlocution') {
        this.queryByEvery(1,this.id,this.problems);
      }
    }
  },
  created() {
    this.queryByEvery(1,this.id,this.problems);
    this.getCategory()
  }
};
</script>
