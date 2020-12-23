<template>
  <a-card>

    <a-row>

      <a-col :md="24" :sm="24">
        <a-divider>设备选择</a-divider>
        <a-upload name="file" :multiple="true" action="/api/main/parkingBatch/batchIssue2" :data="{parkIds:checkedDevice}" :headers="{ token: token }" @change="handleChange">
          <a-button>
            <a-icon type="upload" /> 导入下发
          </a-button>
        </a-upload>
        <a-row>
          <a-form-item>
            <a-tree-select style="width: 100%" v-model="treeSel2" v-if="treeData.length >0" tree-node-filter-prop="value" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="treeData" placeholder="选择组织" @change="selTreeChangeDevice" tree-default-expand-all>
            </a-tree-select>
          </a-form-item>
        </a-row>
        <a-tree style="height: 246px;overflow: auto;" @check="checkedDeviceFunc" v-model="checkedDevice" checkable v-if="treeDataDevice.length>0" :auto-expand-parent="autoExpandParent" :tree-data="treeDataDevice" />
      </a-col>
    </a-row>
    <!-- <a-row style="margin-top:20px">
      <a-button @click="startIssued" :loading="issueing" type="primary">
        开始下发
      </a-button>
    </a-row> -->
    <!-- 
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
      <span slot="msg" slot-scope="text ,scope">
        <span style="color:green" v-if="scope.status">
          {{text}}
        </span>
        <span style="color:red" v-else>
          {{text}}
        </span>
      </span>
    </a-table> -->

  </a-card>
</template>
<script>
import { getPersonTree, getDeviceTreeDoor, batchIssue } from "@/services/carBatch"
import { getAccountTree2 } from "@/services/user"
import { getList } from "@/services/department";
import { mapGetters } from "vuex";

import Cookie from "js-cookie";
const columns = [

  {
    title: '设备IP',
    dataIndex: 'ip',
    key: "ip"

  },
  {
    title: '消息',
    dataIndex: 'msg',
    scopedSlots: { customRender: "msg" },
  }


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
      issueing: false,
      treeSel1: null,
      treeSel2: null,
       token: Cookie.get("token"),
     
    }
  },
  created() {
    this.getPersonTree(null)
    this.getDeviceTreeDoor(null)
    getAccountTree2().then(res => {
      if (res.code === 0) {
        this.treeSel1 = this.user
        this.treeSel2 = this.user
        this.treeData = res.data
      }

    })

    getList({ page: 1, limit: 100 }).then(res => {
      if (res.code === 0)
        this.departments = res.data
    })
  },
  computed: { ...mapGetters("account", ["user"]) },
  methods: {
    getPersonTree(id) {
      getPersonTree({ pid: id }).then(res => {
        console.log(res.data)
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
    async startIssued() {
      this.issueing = true
      //console.log(this.checkedPersons, this.checkedDevice)

      this.$message.info("正在处理..")

      await batchIssue({ pids: this.checkedPersons, dvIds: this.checkedDevice }).then(res => {
        //console.log(res)
        if (res.code === 0) {
          this.$message.success("处理完成")

        } else {
          this.$message.error(res.msg)
        }
        this.issueing = false

      })

    },
    selTreeChangePerson(value, label, ex) {
      if (ex.triggerNode !== undefined) {
        this.form.userId = ex.triggerNode.eventKey
        this.getPersonTree(ex.triggerNode.eventKey)
      }
    },
    selTreeChangeDevice(value, label, ex) {
      if (ex.triggerNode !== undefined) {
        this.form.userId = ex.triggerNode.eventKey
        this.getDeviceTreeDoor(ex.triggerNode.eventKey)
      }
    },
    checkedDeviceFunc() {
      //console.log(e)
      console.log('onCheck', this.checkedDevice);
     


    },
    handleChange(info){
      if(this.checkedDevice.length<=0 ){
        this.$message.info("请选择设备")
        return
      }

        if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 0)
          this.$message.success(`${info.file.name} 上传成功`);
        else
          this.$message.error(info.file.response.msg)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    }
  }
}



</script>
<style scoped>
.tree-transfer .ant-transfer-list:first-child {
  width: 50%;
  flex: none;
}
</style>