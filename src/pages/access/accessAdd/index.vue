<template>
  <a-spin :spinning="spinning" tip="正在搜索门禁控制器请稍后.....">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <!--      <a-input-search style="padding: 20px"
                      placeholder="请输入门禁控制器服务地址ip"
                      enter-button="搜索门禁控制器"
                      v-model="searchIP"
                      size="large"
                      @search="onSearch" /> -->
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null : 'fold'">
            <a-row>
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
            <a-button style="margin-left: 8px" @click="form={} ,treeSel=null">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form>
      </div>

      <a-button type="primary" size="large" icon="search" v-auth:permission="`search`" @click="onSearch">
        搜索门禁控制器
      </a-button>
      <a-button type="primary" size="large" icon="plus" style="margin-left: 10px" v-auth:permission="`search`" @click="manual = true">
        手动添加控制器
      </a-button>
      <a-table bordered :row-key="(row) => row.id" :data-source="dataSource" :pagination="pagination" :columns="columns" :loading="tableLoad" @change="onChange">
        <div slot="action" slot-scope="record">
          <a style="margin-right: 8px" v-auth:permission="`add`" @click="addRecord(record)">
            <a-icon type="plus" />添加
          </a>
          <a style="margin-right: 8px" v-auth:permission="`add`" @click="editDevice(record)">
            <a-icon type="plus" />编辑
          </a>

          <a style="margin-right: 8px" v-auth:permission="`issued`" @click="issue(record)">
            <a-icon type="vertical-align-bottom" />发卡
          </a>
          <a style="margin-right: 8px" @click="delRecord(record.id)">
            <a-icon type="delete" />删除
          </a>
        </div>

        <template slot="name" slot-scope="text, record">
          <div class="editable-cell">
            <div class="editable-cell-input-wrapper">
              <a-input v-model="record.name" />
            </div>
          </div>
        </template>
        <template slot="doors" slot-scope="text, record">

          <div class="editable-cell" v-for="(d,index) in record.doors" :key="index">
            <div class="editable-cell-input-wrapper">
              {{d.id}}号门 备注：
              <a-input style="width:60%" v-model="record.doors[index].name" />
              <a style="margin-right: 8px" v-auth:permission="`add`" @click="openDoor(record.ip ,d.id)">
                <a-icon type="wallet" />远程开门
              </a>
            </div>

          </div>

        </template>
        <template slot="status" slot-scope="text">

          <a-tag v-if="text" color="#87d068">
            在线
          </a-tag>
          <a-tag v-else color="#7b7575">
            离线
          </a-tag>
        </template>
      </a-table>
    </a-card>

    <!---->
    <a-modal width="50%" :footer="null" v-model="visible" title="下发卡号">
      <issued :issueFrom="issueFrom" @closed="visible = false"></issued>
    </a-modal>
    <!-- -->
    <a-modal width="50%" :footer="null" v-model="manual" title="手动添加控制器">
      <a-form-model ref="ruleForm" :model="manualFrom" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
        <!--   <a-form-model-item ref="sn"
                           label="设备序列号"
                           prop="sn">
          <a-input v-model="manualFrom.sn" />
        </a-form-model-item> -->
        <a-form-model-item ref="ip" label="IP" prop="ip">
          <a-input v-model="manualFrom.ip" />
        </a-form-model-item>
        <!--  <a-form-model-item ref="gateipaddress"
                           label="网关"
                           prop="gateipaddress">
          <a-input v-model="manualFrom.gateipaddress" />
        </a-form-model-item>
        <a-form-model-item ref="netMask"
                           label="子网掩码"
                           prop="netMask">
          <a-input v-model="manualFrom.netMask" />
        </a-form-model-item>
        <a-form-model-item ref="mac"
                           label="MAC地址"
                           prop="mac">
          <a-input v-model="manualFrom.mac" />
        </a-form-model-item>
        <a-form-model-item ref="deviceType"
                           label="设备类型"
                           prop="deviceType">
          <a-input v-model="manualFrom.deviceType" />
        </a-form-model-item>
        <a-form-model-item ref="ver"
                           label="版本"
                           prop="ver">
          <a-input v-model="manualFrom.ver" />
        </a-form-model-item> -->
        <a-form-model-item ref="name" label="名称" prop="name">
          <a-input v-model="manualFrom.name" />
        </a-form-model-item>

        <a-form-model-item style="margin-top: 24px" :wrapperCol="{ span: 10, offset: 7 }">
          <a-button type="primary" @click="manualAdd" :loading="suLoad">提交</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-spin>
</template>

<script>
import Cookie from "js-cookie";
import { searchDevice, addDevice, listDevice, delDevice, editDevice,openDoor } from "@/services/access.js";
import issued from "../issued";
import { getAccountTree2 } from "@/services/user"
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      advanced: true,
      form: {},
      visible: false,
      token: null,
      spinning: false,
      searchIP: "",
      dataSource: null,
      issueFrom: {},
      manualFrom: {},
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        showTotal: total => `共 ${total} 条`,
        showSizeChange: (current, pageSize) => this.pageSize = pageSize,
      },
      columns: [
        /* {
          title: "ID",
          dataIndex: "id",
          width: "10%",
          key: "id",
        }, */
        /*  {
           title: "设备序列号",
           dataIndex: "sn",
           width: "10%",
           key: "sn",
         }, */
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "IP地址",
          dataIndex: "ip",
        },
        /* {
          title: "网关",
          dataIndex: "gateipaddress",
        },
        {
          title: "子网掩码",
          dataIndex: "netMask",
        },
        {
          title: "MAC地址",
          dataIndex: "mac",
        }, */
        {
          title: "设备类型",
          dataIndex: "deviceType",
        },

        {
          title: "版本",
          dataIndex: "ver",
        },
        {
          title: "自定义名称",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "门设置",
          dataIndex: "doors",
          scopedSlots: { customRender: "doors" },
        },
        {
          title: "操作",

          scopedSlots: { customRender: "action" },
        },
      ],
      fileList: [],
      manual: false,
      suLoad: false,
      treeData: [],
      treeSel: null,
      tableLoad:false
    };
  },

  components: {
    issued,
  },
  authorize: {
    onSearch: {
      check: "search",
      type: "permission",
    },
    addRecord: {
      check: "add",
      type: "permission",
    },
    issue: {
      check: "issued",
      type: "permission",
    },
  },
  created() {
    this.token = Cookie.get("token");
    this.listDevice();
    getAccountTree2().then(res => {
      if (res.code === 0) {
        this.treeSel = this.user
        this.treeData = res.data
      }

    })
  },
  computed: { ...mapGetters("account", ["user"]) },
  methods: {
    onSearch() {
      this.spinning = true;
      let params = {
        ip: this.searchIP,
      };
      searchDevice(params)
        .then((res) => {
          console.log(res);
          this.spinning = false;
          if (res.code === 0) {
            this.dataSource = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          this.spinning = false;
        });
    },
    delRecord(id) {
      var ids = []
      ids.push(id)
      delDevice(ids).then(res => {
        if (res.code === 0) {
          this.listDevice()
          this.$message.success("删除成功")
        }

      })
    },
    addRecord(record) {

      addDevice(record).then((res) => {

        if (res.code === 0) {
          this.$message.success("添加成功");
          this.listDevice();
        } else {
          this.$message.error(res.msg);
        }

      });
    },
    editDevice(record) {
      editDevice(record).then((res) => {

        if (res.code === 0) {
          this.$message.success("编辑成功");
          this.listDevice();
        } else {
          this.$message.error(res.msg);
        }

      });
    },
   onChange(page) {
      this.pagination = page;
      this.listDevice();
    },
    manualAdd() {
      this.suLoad = true
      addDevice(this.manualFrom).then((res) => {
        if (res.code === 0) {
          this.$message.success("添加成功");
          this.manual = false
          this.listDevice();
        } else {
          this.$message.error(res.msg);
        }
        this.suLoad = false
      });
    },
    issue(record) {
      this.issueFrom = record;

      this.visible = true;
    },
    handleTableChange(pagination) {
      console.log(pagination);
    },
    listDevice() {
      this.form.page = this.pagination.current
      this.form.limit = this.pagination.pageSize
      this.tableLoad = true
      listDevice(this.form).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data;
          this.pagination.total = res.count
        }
        this.tableLoad = false
      });
    },
    openDoor(ip , id) {
      console.log(ip ,id)
      openDoor({ip:ip, id:id}).then(res =>{
        console.log(res)
        if(res.code === 0){
          this.$message.success("请求成功")
        }else{
          this.$message.error(res.msg)
        }
      })
      

    },
    search() {
      this.pagination.current = 1
      this.form.page = this.pagination.current
      this.form.limit = this.pagination.pageSize
      this.tableLoad = true
      listDevice(this.form).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data;
          this.pagination.total = res.count
        }
        this.tableLoad = false
      });
    },

    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },
    selTreeChange(value, label, ex) {
      if (ex.triggerNode !== undefined)
        this.form.userId = ex.triggerNode.eventKey
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
  },
  filters: {
    object2String: function (obj) {
      return JSON.stringify(obj)
    }
  }
};
</script>

<style scoped>
</style>
