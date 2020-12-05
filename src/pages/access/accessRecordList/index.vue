<template>
  <a-card>
    <a-spin :spinning="spinning" tip="正在删除....">
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="门禁卡号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.icCard" placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="姓名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.name" placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="设备名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.dvName" placeholder="请输入" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="部门" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-model="form.department ">
                    <a-select-option v-for="(i,index) in departments" :value="i.name" :key="index">
                      {{i.name}}
                    </a-select-option>

                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width:100%" :ranges="{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }" show-time format="YYYY-MM-DD HH:mm:ss" @change="onDateChange" />
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
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form>
      </div>
      <div>
        <div class="operator">
          <a-button @click="delList" v-auth:permission="`del`" ghost type="danger">批量删除</a-button>
          <a-button @click="exportRecords" v-auth:permission="`export`" style="margin-left: 10px" type="primary">导出</a-button>
        </div>

        <standard-table :bordered="true" :pagination="pagination" :dataSource="dataSource" :selectedRows.sync="selectedRows" @change="onChange" @selectedRowChange="onSelectChange" :loading="listloading">
          <div slot="action" slot-scope="{ record }">
            <!-- <a style="margin-right: 8px"  @click="editRecord(record)"> <a-icon type="edit"  />编辑 </a> -->
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
import { listRecords, delRecords, exportRecords } from "@/services/access";
import { getList } from "@/services/department";
import { getAccountTree2 } from "@/services/user"
import { mapGetters } from "vuex";
import moment from 'moment';
export default {
  name: "QueryList",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      dataSource: [],
      selectedRows: [],
      form: {},
      issueFrom: {},
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "500", "1000"],
        showTotal: (total) => `共 ${total} 条`,
        showSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },
      visible: false,
      spinning: false,
      departments: [],
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
    },
    exportRecords: {
      check: "export",
      type: "permission",
    },
  },
  computed: { ...mapGetters("account", ["user"]) },
  created() {
    this.listRecords();
    getList({ page: 1, limit: 100 }).then(res => {
      if (res.code === 0)
        this.departments = res.data
    })
    getAccountTree2().then(res => {
      if (res.code === 0) {
        this.treeSel = this.user
        this.treeData = res.data
      }
    })
  },
  methods: {
    moment,
    listRecords() {
      this.listloading = true;
      this.form.page = this.pagination.current;
      this.form.limit = this.pagination.pageSize;
      listRecords(this.form).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data;
          this.pagination.total = res.count;
        } else {
          this.$message.error(res.msg);
        }
        this.listloading = false
      });
    },
    search() {
      this.form.id = null;
      this.listRecords();
    },

    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    onClear() { },
    deleteRecord(key) {
      let data = [];
      data.push(key);
      this.spinning = true;
      delRecords(data).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败：" + res.data);
        }
        this.listRecords();
        this.spinning = false;
      });
    },

    editRecord(key) {
      console.log(key);
      this.visible = true;
      this.issueFrom = key;
    },

    onChange(page) {
      this.pagination = page;
      this.listRecords();
    },
    onSelectChange() {
      console.log(this.selectedRows);
    },
    delList() {
      let data = [];
      this.selectedRows.forEach((item) => {
        data.push(item.id);
      });
      delRecords(data).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败：" + res.data);
        }
        this.listRecords();
        this.spinning = false;
      });
    },
    exportRecords() {

      if (this.selectedRows.length <= 0) {
        this.$message.info("请勾选数据");
        return
      }
      this.$message.info("正在导出")
      exportRecords(this.selectedRows).then((res) => {

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
      if (ex.triggerNode !== undefined) {
        this.form.userId = ex.triggerNode.eventKey
        getList({ userId: ex.triggerNode.eventKey, page: 1, limit: 100 }).then(res => {
          if (res.code === 0)
            this.departments = res.data
        })
      }

    },
    onDateChange(dates ,dateStrings){
      
      this.form.dates = dateStrings
      
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
