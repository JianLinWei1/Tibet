<template>
  <a-card>
    <a-spin :spinning="spinning"
            tip="请稍候....">
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null : 'fold'">
            <a-row>
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
                <a-form-item label="车牌"
                             :labelCol="{ span: 5 }"
                             :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.carId"
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
                      @click="search">查询</a-button>
            <a-button style="margin-left: 8px"
                      @click="form = {}">重置</a-button>
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
                        @selectedRowChange="onSelectChange">
          <div slot="action"
               slot-scope="{ record }">
            <a @click="deleteRecord(record.id)"
               v-auth:permission="`del`">
              <a-icon type="delete" />删除
            </a>
          </div>
        </standard-table>
      </div>
    </a-spin>
  </a-card>
</template>

<script>
import StandardTable from "./table/StandardTable";
import { listParkingPerson, delParkingPerson } from "@/services/parking";

import { getAccountTree2 } from "@/services/user"

export default {
  name: "QueryList",
  components: { StandardTable },
  data () {
    return {
      advanced: true,
      dataSource: [],
      selectedRows: [],
      form: {},
      recordFrom: {},
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
      rules: {},
      fetching: false,
      data: [],
      issuedvisible: false,
      issuedFrom: {},
      issuedData: [],
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
    this.listParkingPerson();
    getAccountTree2().then(res => {
      if (res.code === 0)
        this.treeData = res.data
    })
  },
  methods: {
    listParkingPerson () {
      this.form.page = this.pagination.current;
      this.form.limit = this.pagination.pageSize;
      listParkingPerson(this.form).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data;
          this.pagination.total = res.count;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    search () {
      this.form.id = null;
      this.listParkingPerson();
    },

    toggleAdvanced () {
      this.advanced = !this.advanced;
    },

    onClear () { },
    deleteRecord (key) {
      let data = [];
      data.push(key);
      this.spinning = true;
      delParkingPerson(data).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败：" + res.data);
        }
        this.listParkingPerson();
        this.spinning = false;
      });
    },
    editRecord (key) {
      this.visible = true;
      this.recordFrom = key;
    },
    issuedRecord (key) {
      this.issuedvisible = true;
      this.issuedFrom = key;
    },

    onChange (page) {
      this.pagination = page;
      this.listParkingPerson();
    },
    onSelectChange () {
      console.log(this.selectedRows);
    },
    delList () {
      let data = [];
      this.selectedRows.forEach((item) => {
        data.push(item.id);
      });
      delParkingPerson(data).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败：" + res.data);
        }
        this.listParkingPerson();
        this.spinning = false;
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
