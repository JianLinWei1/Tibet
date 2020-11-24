<template>
  <a-card>
    <a-spin :spinning="spinning"
            tip="正在从设备删除....">
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="8"
                     :sm="24">
                <a-form-item label="IP"
                             :labelCol="{ span: 5 }"
                             :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.ip"
                           placeholder="请输入(精确查询)" />
                </a-form-item>
              </a-col>
              <a-col :md="8"
                     :sm="24">
                <a-form-item label="名称"
                             :labelCol="{ span: 5 }"
                             :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.advName"
                           placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="8"
                     :sm="24">
                <a-form-item label="部门"
                             :labelCol="{ span: 5 }"
                             :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-model="form.department "
                            style="width: 120px">
                    <a-select-option v-for="(i,index) in departments"
                                     :value="i.name"
                                     :key="index">
                      {{i.name}}
                    </a-select-option>

                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="advanced">
              <a-col :md="8"
                     :sm="24">
                <a-form-item label="人员ID"
                             :labelCol="{ span: 5 }"
                             :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.pid"
                           placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="8"
                     :sm="24">
                <a-form-item label="姓名"
                             :labelCol="{ span: 5 }"
                             :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.name"
                           placeholder="请输入" />
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
                      @click="search"
                      :loading="searchLoad">查询</a-button>
            <a-button style="margin-left: 8px"
                      @click="form = {}">重置</a-button>
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
                        @selectedRowChange="onSelectChange"
                        :loading="listloading">
          <div slot="action"
               slot-scope="{ record }">
            <!-- <a style="margin-right: 8px"  @click="editRecord(record)"> <a-icon type="edit"  />编辑 </a> -->
            <a @click="deleteRecord(record.id)"
               v-auth:permission="`del`">
              <a-icon type="delete" />删除
            </a>
          </div>
        </standard-table>
      </div>

      <a-modal v-model="visible"
               title="编辑下发"
               footer="null">
        <issued :issueFrom="issueFrom"></issued>
      </a-modal>
    </a-spin>
  </a-card>
</template>

<script>
import StandardTable from "./table/StandardTable";
import { listAccessPersons, DelAccessPerson } from "@/services/access";
import issued from "../issued";
import { getList } from "@/services/department";
import { getAccountTree2 } from "@/services/user"

export default {
  name: "QueryList",
  components: { StandardTable, issued },
  data () {
    return {
      advanced: true,
      dataSource: [],
      selectedRows: [],
      form: {},
      issueFrom: {},
      pagination: {
        current: 0,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
        showTotal: (total) => `共 ${total} 条`,
        showSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },
      visible: false,
      spinning: false,
      departments: [],
      searchLoad: false,
      listloading: false,
      treeData: [],
      treeSel: null
    };
  },
  authorize: {
    deleteRecord: {
      check: "del",
      type: "permission",
    },
    delList: {
      check: "del",
      type: "permission",
    }
  },
  created () {
    this.listAccessPersons();
    getList({ page: 0, limit: 100 }).then(res => {
      if (res.code === 0)
        this.departments = res.data
    })
    getAccountTree2().then(res => {
      if (res.code === 0)
        this.treeData = res.data
    })
  },
  methods: {
    listAccessPersons () {
      this.listloading = true;
      this.form.page = this.pagination.current;
      this.form.limit = this.pagination.pageSize;
      listAccessPersons(this.form).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data;
          this.pagination.total = res.count;
        } else {
          this.$message.error(res.msg);
        }
        this.listloading = false;
        this.searchLoad = false
      });
    },
    search () {
      this.form.id = null;
      this.searchLoad = true;
      this.listAccessPersons();
    },

    toggleAdvanced () {
      this.advanced = !this.advanced;
    },

    onClear () { },
    deleteRecord (key) {
      let data = [];
      data.push(key);
      this.spinning = true
      DelAccessPerson(data).then((res) => {
        console.log(res)
        if (res.code === 0) {
          this.$message.success("删除成功")
        } else {
          this.$message.error("删除失败：" + res.data)
        }
        this.listAccessPersons()
        this.spinning = false
      });
    },
    editRecord (key) {
      console.log(key);
      this.visible = true;
      this.issueFrom = key;
    },

    onChange (page) {
      this.pagination = page;
      this.listAccessPersons();
    },
    onSelectChange () {
      console.log(this.selectedRows);
    },
    delList () {
      let data = [];
      this.selectedRows.forEach((item) => {
        data.push(item.id);
      });
      DelAccessPerson(data).then((res) => {
        console.log(res)
        if (res.code === 0) {
          this.$message.success("删除成功")
        } else {
          this.$message.error("删除失败：" + res.data)
        }
        this.listAccessPersons()
        this.spinning = false
      });
    },

    handleMenuClick (e) {
      if (e.key === "delete") {
        this.remove();
      }
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
