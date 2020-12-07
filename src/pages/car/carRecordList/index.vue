<template>
  <a-card>
    <a-spin :spinning="spinning" tip="请稍候....">
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="IP" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.ipaddr" placeholder="请输入(精确查询)" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="车牌" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.plateid" placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="组织" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-tree-select style="width: 100%" v-model="treeSel" v-if="treeData.length >0" tree-node-filter-prop="value" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="treeData" placeholder="请选择" @change="selTreeChange" tree-default-expand-all>
                  </a-tree-select>
                </a-form-item>

              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="form = {}">重置</a-button>
          </span>
        </a-form>
      </div>
      <div>
        <div class="operator">
          <a-button @click="delList" v-auth:permission="`del`" ghost type="danger">批量删除</a-button>
          <a-button @click="exportRecords" v-auth:permission="`export`" style="margin-left: 10px" type="primary">导出</a-button>
          <a-button @click="exportSearchRecords" v-auth:permission="`export`" style="margin-left: 10px" type="primary">批量导出</a-button>
        </div>
        <standard-table :bordered="true" :pagination="pagination" :dataSource="dataSource" :selectedRows.sync="selectedRows" @change="onChange" @selectedRowChange="onSelectChange">
          <div slot="action" slot-scope="{ record }">

            <a @click="deleteRecord(record.id)" v-auth:permission="`del`">
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
import {
  listParkingResult,
  delParkingResult,
  exportRecords,
  exportSearchRecords

} from "@/services/parking";

import { getAccountTree2 } from "@/services/user"
import { mapGetters } from "vuex";

export default {
  name: "QueryList",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      dataSource: [],
      selectedRows: [],
      form: {},
      recordFrom: {},
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "40"],
        showTotal: (total) => `共 ${total} 条`,
        showSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },
      visible: false,
      spinning: false,
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
    },
    exportRecords: {
      check: "export",
      type: "permission",
    },
  },
  computed: { ...mapGetters("account", ["user"]) },
  created() {
    this.listParkingResult();
    getAccountTree2().then(res => {
      if (res.code === 0) {
        this.treeSel = this.user
        this.treeData = res.data
      }
    })

  },
  methods: {
    listParkingResult() {
      this.form.page = this.pagination.current;
      this.form.limit = this.pagination.pageSize;
      listParkingResult(this.form).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data;
          this.pagination.total = res.count;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    search() {
      this.form.id = null;
      this.listParkingResult();
    },

    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    onClear() { },
    deleteRecord(key) {
      let data = [];
      data.push(key);
      this.spinning = true;
      delParkingResult(data).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败：" + res.data);
        }
        this.listParkingResult();
        this.spinning = false;
      });
    },
    editRecord(key) {
      this.visible = true;
      this.recordFrom = key;
    },
    issuedRecord(key) {
      this.issuedvisible = true;
      this.issuedFrom = key;
    },

    onChange(page) {
      this.pagination = page;
      this.listParkingResult();
    },
    onSelectChange() {
      console.log(this.selectedRows);
    },
    delList() {
      let data = [];
      this.selectedRows.forEach((item) => {
        data.push(item.id);
      });
      delParkingResult(data).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败：" + res.data);
        }
        this.listParkingResult();
        this.spinning = false;
      });
    },
    exportRecords() {

      if (this.selectedRows.length <= 0) {
        this.$message.info("请勾选数据");
        return
      }
      exportRecords(this.selectedRows).then((res) => {

        if (res.code === 0) {
          this.$message.success("导出成功")
          window.location.href = "/api/main/download?filename=" + res.data
        } else {
          this.$message.error(res.msg)
        }
      });
    },
    exportSearchRecords() {
      this.$message.info("正在导出")
      exportSearchRecords(this.form).then((res) => {

        if (res.code === 0) {
          this.$message.success("导出成功")
          window.location.href = "/api/main/download?filename=" + res.data
        } else {
          this.$message.error(res.msg)
        }
      });
    },

    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
    selTreeChange(value, label, ex) {
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
