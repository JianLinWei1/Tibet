<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="部门名称"
                           :labelCol="{ span: 5 }"
                           :wrapperCol="{ span: 18, offset: 1 }">
                <a-input v-model="form.name"
                         placeholder="部门名称" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="组织"
                           :labelCol="{ span: 5 }"
                           :wrapperCol="{ span: 18, offset: 1 }">
                <a-tree-select style="width: 100%"
                               v-model="treeSel"
                               v-if="treeData.length >0"
                               tree-node-filter-prop="value"
                               :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                               :tree-data="treeData"
                               placeholder="请选择"
                               @change="selTreeChange"
                               tree-default-expand-all>
                </a-tree-select>
              </a-form-item>
            </a-col>

          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary"
                    @click=" search">查询</a-button>
          <a-button style="margin-left: 8px"
                    @click="form={}">重置</a-button>
          <a @click="toggleAdvanced"
             style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button v-auth:permission="`add`"
                  type="primary"
                  @click="visible= true ; title ='添加部门'">添加部门</a-button>
        <a-button @click="delList"
                  v-auth:permission="`del`"
                  ghost
                  type="danger">批量删除</a-button>

      </div>
      <standard-table :bordered="true"
                      :pagination="pagination"
                      :dataSource="dataSource"
                      :selectedRows.sync="selectedRows"
                      @change="onChange"
                      @selectedRowChange="onSelectChange">
        <div slot="action"
             slot-scope="{record}">
          <a style="margin-right: 8px"
             @click="editRecord(record)"
             v-auth:permission="`edit`">
            <a-icon type="edit" />编辑
          </a>
          <a @click="deleteRecord(record.id)"
             v-auth:permission="`del`">
            <a-icon type="delete" />删除
          </a>
        </div>

      </standard-table>
    </div>
    <!---->
    <a-modal width="50%"
             :footer="null"
             v-model="visible"
             :title="title">
      <a-form-model ref="ruleForm"
                    :model="saveForm"
                    :rules="rules">
        <a-form-model-item label="部门名称"
                           prop="name">
          <a-input v-model="saveForm.name"
                   autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary"
                    @click="submitForm('ruleForm')">
            提交
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import StandardTable from "./table/StandardTable";
import { insert, getList, del } from "@/services/department";
import { getAccountTree2 } from "@/services/user"
import { mapGetters } from "vuex";

export default {
  name: "QueryList",
  components: { StandardTable },
  data () {
    return {
      advanced: true,
      dataSource: [],
      selectedRows: [],
      form: {
      },
      editFrom: {},
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        showTotal: total => `共 ${total} 条`,
        showSizeChange: (current, pageSize) => this.pageSize = pageSize,
      },
      visible: false,
      action: 0,
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }]
      },
      title: "添加部门",
      saveForm: {},
      treeData: [],
      treeSel: null
    };
  },
 computed: { ...mapGetters("account", ["user"])},
  created () {
    this.getList();
    getAccountTree2().then(res => {
       if (res.code === 0) {
        this.treeSel = this.user
        this.treeData = res.data
      }
    })
  },
  authorize: {
    editRecord: {
      check: "edit",
      type: "permission",
    },
    deleteRecord: {
      check: "del",
      type: "permission",
    },
    delList: {
      check: "del",
      type: "permission",
    }
  },
  methods: {
    getList () {

      this.form.page = this.pagination.current
      this.form.limit = this.pagination.pageSize
      getList(this.form).then((res) => {
        //console.log(res);
        if (res.code === 0) {
          this.dataSource = res.data;
          this.pagination.total = res.count
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    search(){
       this.pagination.current = 1
       this.getList()
    },

    toggleAdvanced () {
      this.advanced = !this.advanced;
    },

    onClear () {

    },
    deleteRecord (key) {

      let data = []
      data.push(key)

      del(data).then(res => {
        if (res.code === 0) {
          this.$message.success("删除成功")
          this.dataSource = this.dataSource.filter((item) => item.id !== key)
          // this.selectedRows = this.selectedRows.filter((item) => item.id !== key);
        } else if (res.code === -2) {
          this.$message.info(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      })

    },
    editRecord (key) {
      console.log(key)
      this.visible = true
      this.saveForm = key
      this.title = "编辑"
    },

    onChange (page) {
      this.pagination = page
      this.getList()
    },
    onSelectChange () {
      console.log(this.selectedRows)

    },
    delList () {
      let data = []
      this.selectedRows.forEach(item => {
        data.push(item.id)
      })

      del(data).then(res => {
        if (res.code === 0) {
          this.$message.success("删除成功")
          this.getList()
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    handleMenuClick (e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
    submitForm () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {

          this.$message.info("正在提交数据请稍后..")
          insert(this.saveForm).then((res) => {
            if (res.code === 0) {
              this.$message.success("添加成功");
              this.visible = false
              this.getList();

            } else {
              this.$message.error(res.msg);
            }
          })
        } else {
          this.$message.error("请按要求输入");
          return false;
        }
      });
    },
    selTreeChange (value, label, ex) {
      if (ex.triggerNode !== undefined)
        this.form.userId = ex.triggerNode.eventKey
    }
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
