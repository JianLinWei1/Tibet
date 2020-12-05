<template>
  <a-card>
    <a-row>
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
          <!--   <span style="float: right; margin-top: 3px">
            <a-button type="primary" @click="getPersonTree">查询</a-button>
            <a-button style="margin-left: 8px" @click="form={} ,treeSel=null">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span> -->
        </a-form>
      </div>
    </a-row>
    <a-row>
      <a-col :md="12" :sm="24">
        <a-divider>人员选择</a-divider>
        <!--  <a-form layout="horizontal">
          <a-form-item label="部门" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
            <a-select v-model="form.department ">
              <a-select-option v-for="(i,index) in departments" :value="i.name" :key="index">
                {{i.name}}
              </a-select-option>

            </a-select>
          </a-form-item>
        </a-form>
 -->
        <a-tree style="height: 246px;overflow: auto;" v-model="checkedPersons" v-if="treeDataPerson.length>0" checkable :auto-expand-parent="autoExpandParent" :tree-data="treeDataPerson" />
      </a-col>
      <a-col :md="12" :sm="24">
        <a-divider>设备选择</a-divider>
        <a-tree style="height: 246px;overflow: auto;" v-model="checkedDevice" checkable v-if="treeDataDevice.length>0" :auto-expand-parent="autoExpandParent" :tree-data="treeDataDevice" />
      </a-col>
    </a-row>
    <a-row style="margin-top:20px">
      <a-button @click="startIssued" :loading="issueing" type="primary">
        开始下发
      </a-button>
    </a-row>

    <a-table :columns="columns" :data-source="data">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="customTitle">
        <a-icon type="smile-o" /> Name
      </span>
      <span slot="tags" slot-scope="tags">
        <a-tag v-for="tag in tags" :key="tag" :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a>Invite 一 {{ record.name }}</a>
        <a-divider type="vertical" />
        <a>Delete</a>
        <a-divider type="vertical" />
        <a class="ant-dropdown-link"> More actions
          <a-icon type="down" />
        </a>
      </span>
    </a-table>

  </a-card>
</template>
<script>
import { getPersonTree, getDeviceTreeDoor } from "@/services/batch"
import { getAccountTree2 } from "@/services/user"
import { getList } from "@/services/department";

const columns = [

  /*  {
     title: '人员编号',
     dataIndex: 'age',
     key: 'age',
   }, */
  {
    title: '姓名',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '下发设备',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' },
  },
  /*  {
     title: '控制器名称',
     key: 'dvname',
 
   },
    {
     title: '门名称',
     key: 'door',
 
   }, */
  {
    title: '下发状态',
    key: 'status',

  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
export default {
  data() {
    return {
      mockData: [],
      targetKeys: [],
      data: [],
      columns,
      autoExpandParent: true,
      treeDataPerson: [],
      checkedPersons: [],
      treeDataDevice: [],
      checkedDevice: [],
      advanced: true,
      treeData: [],
      form: {},
      departments: [],
      issueing: false
    }
  },
  created() {
    this.getPersonTree(null)
    this.getDeviceTreeDoor(null)
    getAccountTree2().then(res => {
      if (res.code === 0) {
        this.treeSel = this.user
        this.treeData = res.data
      }

    })

    getList({ page: 1, limit: 100 }).then(res => {
      if (res.code === 0)
        this.departments = res.data
    })
  },
  methods: {
    getPersonTree(id) {
      getPersonTree({ pid: id }).then(res => {

        if (res.code === 0) {
          this.treeDataPerson = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getDeviceTreeDoor(id) {
      getDeviceTreeDoor({ pid: id }).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.treeDataDevice = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    startIssued() {
      this.issueing = true
      console.log(this.checkedPersons, this.checkedDevice)
     


    },
    selTreeChange(value, label, ex) {
      if (ex.triggerNode !== undefined) {
        this.form.userId = ex.triggerNode.eventKey
        this.getPersonTree(ex.triggerNode.eventKey)
        this.getDeviceTreeDoor(ex.triggerNode.eventKey)
      }
    },
  }
}
</script>
<style scoped>
.tree-transfer .ant-transfer-list:first-child {
  width: 50%;
  flex: none;
}
</style>