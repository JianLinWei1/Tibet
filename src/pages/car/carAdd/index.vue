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
                <a-form-item label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.device_name" placeholder="请输入" />
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
          <a-button @click="delList" ghost type="danger">批量删除</a-button>
           <a-button @click="batchIssueVisi = true" style="margin-left: 10px" type="primary">批量下发</a-button>
        </div>
        <standard-table :bordered="true" :pagination="pagination" :dataSource="dataSource" :selectedRows.sync="selectedRows" @change="onChange" @selectedRowChange="onSelectChange">
          <div slot="action" slot-scope="{ record }">
            <a style="margin-right: 8px" v-auth:permission="`issued`" @click="issuedRecord(record)">
              <a-icon type="arrow-down" />下发白名单
            </a>
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

      <!--下发-->
      <a-modal v-model="issuedvisible" title="编辑" :footer="null">
        <a-form-model ref="ruleForm" :model="issuedCarFrom" :rules="rules" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
          <a-form-model-item ref="serialno" label="序列号" prop="serialno">
            <a-input disabled v-model="issuedCarFrom.serialno" placeholder="ip" />
          </a-form-model-item>
          <a-form-model-item ref="device_name" label="设备名称" prop="device_name">
            <a-input disabled v-model="issuedCarFrom.device_name" />
          </a-form-model-item>
          <a-form-model-item label="选择人员" prop="personIds">
            <a-select show-search mode="multiple" v-model="issuedCarFrom.personIds" placeholder="搜索" style="width: 100%" :filter-option="false" :not-found-content="fetching ? undefined : null" @search="fetchPerson" @select="personSelect" @deselect="deselect">
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in issuedData" :key="d.id" :value="d.id">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="carId" label="人员车牌号" prop="carId">
            <a-input v-model="showCarid" disabled type="textarea" />
          </a-form-model-item>
          <a-form-model-item ref="carId" label="临时车牌号" prop="carId">
            <a-input v-model="tempCarId" @change="tempCarIdChange" />
          </a-form-model-item>
          <!--  <a-form-model-item label="是否有效" prop="enable">
            <a-select style="width: 120px" v-model="issuedCarFrom.enable">
              <a-select-option value="0"> 无效 </a-select-option>
              <a-select-option value="1"> 有效 </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="是否未黑名单" prop="need_alarm">
            <a-select style="width: 120px" v-model="issuedCarFrom.need_alarm">
              <a-select-option value="0"> 否 </a-select-option>
              <a-select-option value="1"> 是 </a-select-option>
            </a-select>
          </a-form-model-item> -->
          <a-form-model-item label="生效日期">
            <a-date-picker v-model="issuedCarFrom.enable_time" valueFormat="YYYY-MM-DD HH:mm:ss" show-time placeholder="选择生效日期" />
          </a-form-model-item>
          <a-form-model-item label="失效日期">
            <a-date-picker v-model="issuedCarFrom.overdue_time" valueFormat="YYYY-MM-DD HH:mm:ss" show-time placeholder="选择失效日期" />
          </a-form-model-item>
          <a-form-model-item style="margin-top: 24px" :wrapperCol="{ span: 10, offset: 7 }">
            <a-button type="primary" @click="submit2">提交</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
       <a-modal v-model="batchIssueVisi" width="90%" title="批量下发"   :footer="null">
          <batchIssue> </batchIssue>
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
import batchIssue from "../batchissue";

export default {
  name: "QueryList",
  components: { StandardTable ,batchIssue },
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
      issuedvisible: false,
      issuedCarFrom: {
        enable: 1,
        need_alarm: 0,
        carId: []
      },
      issuedData: [],
      treeData: [],
      treeSel: null,
      showCarid: "",
      tempCarId: "",
      batchIssueVisi: false
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
         /*  console.log("fetching user", res.data); */
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
         /*  console.log("fetching user", res.data); */
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
          this.listParking()
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
          this.issuedCarFrom.enable = 1
          this.issuedCarFrom.need_alarm = 0
          saveParkPersonInfo(this.issuedCarFrom).then((res) => {
            this.spinning = false;
            if (res.code == 0) {
              this.$message.success("提交成功");
              this.issuedvisible = false
            } else {
              this.$message.error(JSON.stringify(res.data) + res.msgs);
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
  
      var that = this;
      opt.context.issuedData.forEach((item) => {
        if (value == item.id) {
          if (item.carId !== null) {
            for (var i in item.carId) {
              that.showCarid += item.carId[i] +" ;"
            }
          }
        }
      })

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
