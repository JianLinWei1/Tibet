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
                <a-form-item label="摄像机名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.device_name" placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="分类名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.device_name" placeholder="请输入" />
                </a-form-item>
              </a-col>

            </a-row>
            <a-row>
            <!--   <a-col :md="8" :sm="24">
                <a-form-item label="绑定门禁" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.device_name" placeholder="请输入" />
                </a-form-item>
              </a-col> -->

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
          <a-button type="primary" size="large" @click="bindCamModal = true">
            绑定摄像机
          </a-button>
          <a-button type="primary" style="margin-left:10px" size="large" @click="onSearch">
            获取摄像机
          </a-button>
        </div>
        <standard-table :bordered="true" :pagination="pagination" :dataSource="dataSource" :selectedRows.sync="selectedRows" @change="onChange" @selectedRowChange="onSelectChange">
          <div slot="action" slot-scope="{ record }">

            <a style="margin-right: 8px" v-auth:permission="`edit`" @click="editRecord(record)">
              <a-icon type="edit" />编辑
            </a>
            <a @click="deleteRecord(record.serialno)" v-auth:permission="`del`">
              <a-icon type="delete" />删除
            </a>
          </div>
        </standard-table>
      </div>
      <!--编辑-->
      <a-modal v-model="visible" title="编辑" :footer="null">
        <a-form-model ref="ruleForm" :model="recordFrom" :rules="rules" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-form-model-item ref="serialno" label="序列号" prop="serialno">
            <a-input disabled v-model="recordFrom.serialno" placeholder="ip" />
          </a-form-model-item>
          <a-form-model-item ref="device_name" label="设备名称" prop="device_name">
            <a-input v-model="recordFrom.device_name" />
          </a-form-model-item>
          <a-form-model-item ref="serialno" label="IP" prop="ipaddr">
            <a-input disabled v-model="recordFrom.ipaddr" placeholder="ipaddr" />
          </a-form-model-item>

          <a-form-model-item label="绑定账号" prop="userId">
            <a-select show-search mode="default" v-model="recordFrom.userId" placeholder="搜索" style="width: 100%" :filter-option="false" :not-found-content="fetching ? undefined : null" @search="fetchUser">
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in data" :key="d.id" :value="d.id">
                {{ d.userName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item style="margin-top: 24px" :wrapperCol="{ span: 10, offset: 7 }">
            <a-button type="primary" @click="submit">提交</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal width="50%" :footer="null" v-model="bindCamModal" title="摄像机绑定">
        <a-form-model ref="ruleForm" :model="bindCamModalFrom" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">

          <a-form-model-item ref="ip" label="分类名称" prop="ip">
            <a-select mode="tags" style="width: 100%" placeholder="选择分类" @change="handleChange">
              <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                {{ (i + 9).toString(36) + i }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        
           <a-form-model-item ref="name" label="组织" prop="name">
              <a-tree-select style="width: 100%" v-model="treeSel" v-if="treeData.length >0" tree-node-filter-prop="value" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="treeData" placeholder="请选择" @change="selTreeChange" tree-default-expand-all>
                  </a-tree-select>
          </a-form-model-item>
          <a-form-model-item style="margin-top: 24px" :wrapperCol="{ span: 10, offset: 7 }">
            <a-button type="primary" @click="manualAdd" :loading="suLoad">提交</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-modal>

    </a-spin>
  </a-card>
</template>

<script>
import StandardTable from "./table/StandardTable";
import {
  listParking,
  delParkInfo,
  getUserIdByName,
  saveParkInfo,
  getPersonByName,
  saveParkPersonInfo,
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
      rules: {
        enable: [{ required: true, message: "必填！", trigger: "blur" }],
        need_alarm: [{ required: true, message: "必填！", trigger: "blur" }],
        // carId: [{ required: true, message: "必填！", trigger: "blur" }],
      },
      fetching: false,
      data: [],
      bindCamModal: false,
      bindCamModalFrom: {
        enable: 1,
        need_alarm: 0,
        carId: []
      },
      issuedData: [],
      treeData: [],
      treeSel: null,
      showCarid: "",
      tempCarId: ""
    };
  },
  authorize: {
    issuedRecord: {
      check: "issued",
      type: "permission",
    },
    editRecord: {
      check: "edit",
      type: "permission",
    },
    deleteRecord: {
      check: "del",
      type: "permission",
    },
  },
  computed: { ...mapGetters("account", ["user"]) },
  created() {
    this.listParking();
    getAccountTree2().then(res => {
      if (res.code === 0) {
        this.treeSel = this.user
        this.treeData = res.data
      }
    })
  },
  methods: {
    listParking() {
      this.form.page = this.pagination.current;
      this.form.limit = this.pagination.pageSize;
      listParking(this.form).then((res) => {
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
      this.pagination.current = 1
      this.listParking();
    },

    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    onClear() { },
    deleteRecord(key) {
      let data = [];
      data.push(key);
      this.spinning = true;
      delParkInfo(data).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败：" + res.data);
        }
        this.listParking();
        this.spinning = false;
      });
    },
    editRecord(key) {
      this.visible = true;
      this.recordFrom = key;
    },
    issuedRecord(key) {
      this.issuedvisible = true;
      key.carId = []
      this.issuedCarFrom = key;
    },

    onChange(page) {
      this.pagination = page;
      this.listParking();
    },
    onSelectChange() {
      console.log(this.selectedRows);
    },
    delList() {
      let data = [];
      this.selectedRows.forEach((item) => {
        data.push(item.serialno);
      });
      delParkInfo(data).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败：" + res.data);
        }
        this.listParking();
        this.spinning = false;
      });
    },

    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
    fetchUser(value) {
      this.data = [];
      this.fetching = true;

      getUserIdByName({ userName: value }).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.data = res.data;
          console.log("fetching user", res.data);
        } else {
          this.$message.error("搜索异常");
        }
        this.fetching = false;
      });
    },
    fetchPerson(value) {
      this.issuedData = [];
      this.fetching = true;

      getPersonByName({ name: value }).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.issuedData = res.data;
          console.log("fetching user", res.data);
        } else {
          this.$message.error("搜索异常");
        }
        this.fetching = false;
      });
    },
    submit() {
      this.spinning = true;
      saveParkInfo(this.recordFrom).then((res) => {
        this.spinning = false;
        if (res.code == 0) {
          this.$message.success("提交成功");
          this.visible = false
        } else {
          this.$message.error(JSON.stringify(res.data));
        }
      });
    },
    submit2() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.spinning = true;
          saveParkPersonInfo(this.issuedCarFrom).then((res) => {
            this.spinning = false;
            if (res.code == 0) {
              this.$message.success("提交成功");
              this.issuedvisible = false
            } else {
              this.$message.error(JSON.stringify(res.data));
            }
          });
        } else {
          this.$message.error("请按要求输入");
          return false;
        }
      });
    },
    selTreeChange(value, label, ex) {
      if (ex.triggerNode !== undefined)
        this.form.userId = ex.triggerNode.eventKey
    },
    personSelect(value, opt) {


      if (opt.context.issuedData[0].carId !== null)
        this.showCarid += opt.context.issuedData[0].carId + " ;"

    },
    deselect() {
      this.showCarid = "";
    }
    , tempCarIdChange() {
      this.issuedCarFrom.carId = []
      this.issuedCarFrom.carId.push(this.tempCarId)
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
