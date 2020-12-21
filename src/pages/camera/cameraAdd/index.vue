<template>
  <a-card>
    <a-spin :spinning="spinning" tip="请稍候....">
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null : 'fold'">
          <!--   <a-row>
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

            </a-row> -->
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
         
        </div>
        <standard-table :bordered="true" :pagination="pagination" :dataSource="dataSource" :selectedRows.sync="selectedRows" @change="onChange" @selectedRowChange="onSelectChange">
          <div slot="action" slot-scope="{ record }">

            <a style="margin-right: 8px"  @click="editRecord(record)">
              <a-icon type="video-camera" />查看实况
            </a>
            <a @click="deleteRecord(record.serialno)" >
              <a-icon type="play-circle" />查看回放
            </a>
          </div>
        </standard-table>
      </div>
      <!---->
    
      <a-modal width="50%" :footer="null" v-model="bindCamModal" title="摄像机绑定">
       <bind > </bind>
      </a-modal>

    </a-spin>
  </a-card>
</template>

<script>
import StandardTable from "./table/StandardTable";
import bind from "../bind";
import { listCamera } from "@/services/camera";

import { getAccountTree2 } from "@/services/user"
import { mapGetters } from "vuex";

export default {
  name: "QueryList",
  components: { StandardTable ,bind},
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
    this.listCamera();
    getAccountTree2().then(res => {
      if (res.code === 0) {
        this.treeSel = this.user
        this.treeData = res.data
      }
    })
  },
  methods: {
    listCamera() {
      this.form.page = this.pagination.current;
      this.form.limit = this.pagination.pageSize;
      listCamera(this.form).then(res =>{
        if(res.code ===0){
          this.dataSource = res.data
        }else{
          this.$message.error(res.msg)
        }
      })

    },
    search() {
      this.form.id = null;
      this.pagination.current = 1
      this.listCamera();
    },

    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    onClear() { },
    deleteRecord(key) {
      let data = [];
      data.push(key);
      this.spinning = true;

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

    },

    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },

    selTreeChange(value, label, ex) {
      if (ex.triggerNode !== undefined) {
        this.form.userId = ex.triggerNode.eventKey
    
      }

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
