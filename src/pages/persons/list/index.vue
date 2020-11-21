<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="ID"
                           :labelCol="{ span: 5 }"
                           :wrapperCol="{ span: 18, offset: 1 }">
                <a-input v-model="form.id"
                         placeholder="请输入(精确查询)" />
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
              <a-form-item label="身份证号"
                           :labelCol="{ span: 5 }"
                           :wrapperCol="{ span: 18, offset: 1 }">
                <a-input v-model="form.idCard"
                         placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="门禁卡号"
                           :labelCol="{ span: 5 }"
                           :wrapperCol="{ span: 18, offset: 1 }">
                <a-input v-model="form.accessId"
                         placeholder="请输入" />
              </a-form-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-item
                label="角色"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select v-model="form.role" placeholder="请选择">
                  <a-select-option value="1"> 普通人员</a-select-option>
                  <a-select-option value="2"> 白名单人员</a-select-option>
                  <a-select-option value="3"> 黑名单人员</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary"
                    @click="queryPersonsList">查询</a-button>
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
             title="编辑">
      <edit :action="action"
            :form="editFrom"></edit>
    </a-modal>
  </a-card>
</template>

<script>
import StandardTable from "./table/StandardTable";
import { queryPersonsList, delPerson } from "@/services/person";
import edit from "../add/index2"

export default {
  name: "QueryList",
  components: { StandardTable, edit },
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
      action: 0
    };
  },

  created () {
    this.queryPersonsList();
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
    queryPersonsList () {

      this.form.page = this.pagination.current
      this.form.limit = this.pagination.pageSize
      queryPersonsList(this.form).then((res) => {
        //console.log(res);
        if (res.code === 0) {
          this.dataSource = res.data;
          this.pagination.total = res.count
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    toggleAdvanced () {
      this.advanced = !this.advanced;
    },

    onClear () {

    },
    deleteRecord (key) {

      let data = []
      data.push(key)

      delPerson(data).then(res => {
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
      this.editFrom = key
      this.action = 2
      this.editFrom.oid = key.id
    },

    onChange (page) {
      this.pagination = page
      this.queryPersonsList()
    },
    onSelectChange () {
      console.log(this.selectedRows)

    },
    delList () {
      let data = []
      this.selectedRows.forEach(item => {
        data.push(item.id)
      })

      delPerson(data).then(res => {
        if (res.code === 0) {
          this.$message.success("删除成功")
          this.queryPersonsList()
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
