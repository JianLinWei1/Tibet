<template>
  <a-card>
    <a-spin :spinning="spinning" tip="请稍候....">
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="姓名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.name" placeholder="请输入" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="车牌" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input v-model="form.carId[0]" placeholder="请输入" />
                </a-form-item>
              </a-col>
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
        </div>
        <standard-table :bordered="true" :pagination="pagination" :dataSource="dataSource" :selectedRows.sync="selectedRows" @change="onChange" @selectedRowChange="onSelectChange">
          
          <div slot="action" slot-scope="{ record }">
            <a style="margin-right: 8px" v-auth:permission="`del`" @click="editRecord(record)">
              <a-icon type="edit" />编辑
            </a>
            <a @click="deleteRecord(record.id)" v-auth:permission="`del`">
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
          <a-form-model-item ref="serialno" label="人员ID" prop="ipaddr">
            <a-input disabled v-model="recordFrom.personId" placeholder="ipaddr" />
          </a-form-model-item>
           <a-form-model-item ref="serialno" label="姓名" prop="ipaddr">
            <a-input disabled v-model="recordFrom.name" placeholder="ipaddr" />
          </a-form-model-item>
          <a-form-model-item ref="carId" label="人员车牌号" prop="carId">
            <a-tag v-for="(r ,index) in recordFrom.carId" :key="index" color="green">
          {{r}}
        </a-tag>
          </a-form-model-item>
          <a-form-model-item label="状态" prop="userId">
            <a-select show-search mode="default" v-model="recordFrom.status"  style="width: 100%" >
              <a-select-option  :value="false">
                未被设备获取
              </a-select-option>
               <a-select-option  :value="true">
                已被设备获取
              </a-select-option>
            </a-select>
          </a-form-model-item>
           <a-form-model-item label="生效日期">
            <a-date-picker v-model="recordFrom.enable_time" valueFormat="YYYY-MM-DD HH:mm:ss" show-time placeholder="选择生效日期" />
          </a-form-model-item>
          <a-form-model-item label="失效日期">
            <a-date-picker v-model="recordFrom.overdue_time" valueFormat="YYYY-MM-DD HH:mm:ss" show-time placeholder="选择失效日期" />
          </a-form-model-item>
          <a-form-model-item style="margin-top: 24px" :wrapperCol="{ span: 10, offset: 7 }">
            <a-button type="primary" @click="submit">提交</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </a-spin>
  </a-card>
</template>

<script>
import StandardTable from "./table/StandardTable";
import { listParkingPerson, delParkingPerson ,updateParkPersonInfo} from "@/services/parking";
import { getList } from "@/services/department";
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
      form: {
        carId:[]
      },
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
      rules: {},
      fetching: false,
      data: [],
      issuedvisible: false,
      issuedFrom: {},
      issuedData: [],
      treeData: [],
      treeSel: null,
      departments:[],
     
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
  computed: { ...mapGetters("account", ["user"]) },
  created() {
    this.listParkingPerson();
    getList({ page:1, limit: 100 }).then(res => {
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
    listParkingPerson() {
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
    search() {
      this.form.id = null;
      this.pagination.current = 1
      this.listParkingPerson();
    },

    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    onClear() { },
    deleteRecord(key) {
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
      this.listParkingPerson();
    },
    onSelectChange() {
      console.log(this.selectedRows);
    },
    delList() {
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
    submit(){
       this.spinning = true;
          this.recordFrom.enable = 1
          this.recordFrom.need_alarm = 0
          updateParkPersonInfo(this.recordFrom).then((res) => {
            this.spinning = false;
            if (res.code == 0) {
              this.$message.success("提交成功");
              this.tempCarId = null
              this.issuedvisible = false
              
            } else {
              this.$message.error(JSON.stringify(res.data) + res.msg);
            }
          });
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
